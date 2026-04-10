const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartService {
  async getCart(userId) {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    return cart;
  }

  async addItem(userId, { productId, quantity = 1 }) {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    if (product.stock < quantity) {
      const error = new Error(`Only ${product.stock} items available in stock`);
      error.statusCode = 400;
      throw error;
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const existingIdx = cart.items.findIndex(
      (item) => item.productId && item.productId.toString() === productId
    );

    if (existingIdx >= 0) {
      const newQty = cart.items[existingIdx].quantity + quantity;
      if (newQty > product.stock) {
        const error = new Error(`Cannot add more. Only ${product.stock} in stock`);
        error.statusCode = 400;
        throw error;
      }
      cart.items[existingIdx].quantity = newQty;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        category: product.category,
        subCategory: product.subCategory || '',
        quantity,
      });
    }

    await cart.save();
    return cart;
  }

  async updateItem(userId, { productId, quantity }) {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      const error = new Error('Cart not found');
      error.statusCode = 404;
      throw error;
    }

    const itemIdx = cart.items.findIndex(
      (item) => item.productId && item.productId.toString() === productId
    );

    if (itemIdx < 0) {
      const error = new Error('Item not found in cart');
      error.statusCode = 404;
      throw error;
    }

    if (quantity <= 0) {
      cart.items.splice(itemIdx, 1);
    } else {
      const product = await Product.findById(productId);
      if (product && quantity > product.stock) {
        const error = new Error(`Only ${product.stock} items available`);
        error.statusCode = 400;
        throw error;
      }
      cart.items[itemIdx].quantity = quantity;
    }

    await cart.save();
    return cart;
  }

  async removeItem(userId, productId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      const error = new Error('Cart not found');
      error.statusCode = 404;
      throw error;
    }

    const itemIdx = cart.items.findIndex(
      (item) => item.productId && item.productId.toString() === productId
    );

    if (itemIdx < 0) {
      const error = new Error('Item not found in cart');
      error.statusCode = 404;
      throw error;
    }

    cart.items.splice(itemIdx, 1);
    await cart.save();
    return cart;
  }

  async clearCart(userId) {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
  }
}

module.exports = new CartService();
