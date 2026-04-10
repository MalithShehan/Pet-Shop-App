const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

class OrderService {
  async create(userId, { shippingAddress, shippingCity, shippingState, shippingPostal, shippingPhone, notes, paymentMethod = 'COD' }) {
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      const error = new Error('Cart is empty');
      error.statusCode = 400;
      throw error;
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (item.productId) {
        const product = await Product.findById(item.productId);
        if (product && product.stock < item.quantity) {
          const error = new Error(`${product.name} only has ${product.stock} in stock`);
          error.statusCode = 400;
          throw error;
        }
      }
    }

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);

    const deliveryFee = subtotal > 5000 ? 0 : 250;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      userId,
      total,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPostal,
      shippingPhone,
      notes,
      items: cart.items.map((item) => ({
        productId: item.productId || null,
        petId: item.petId || null,
        name: item.name || 'Unknown',
        quantity: item.quantity,
        price: item.price,
      })),
      payment: {
        method: paymentMethod,
        amount: total,
        status: 'PENDING',
      },
    });

    // Decrease stock for each product
    for (const item of cart.items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    // Clear the cart
    cart.items = [];
    await cart.save();

    return order;
  }

  async getByUser(userId, { page = 1, limit = 10 }) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(take),
      Order.countDocuments({ userId }),
    ]);

    return {
      orders,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    };
  }

  async getById(orderId, userId) {
    const order = await Order.findById(orderId);

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    if (order.userId.toString() !== userId) {
      const error = new Error('Not authorized to view this order');
      error.statusCode = 403;
      throw error;
    }

    return order;
  }

  async updateStatus(orderId, status) {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    return order;
  }

  async cancelOrder(orderId, userId) {
    const order = await Order.findById(orderId);

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    if (order.userId.toString() !== userId) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      const error = new Error('Order cannot be cancelled at this stage');
      error.statusCode = 400;
      throw error;
    }

    // Restore stock
    for (const item of order.items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.status = 'CANCELLED';
    if (order.payment) {
      order.payment.status = 'REFUNDED';
    }
    await order.save();

    return order;
  }

  // Admin: get all orders
  async getAll({ page = 1, limit = 20, status }) {
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take),
      Order.countDocuments(filter),
    ]);

    return {
      orders,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    };
  }
}

module.exports = new OrderService();
