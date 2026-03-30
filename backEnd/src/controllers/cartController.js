const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  return cart;
}

const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);

  return res.json({
    success: true,
    data: { cart },
  });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity || 1);

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  if (product.stock < qty) {
    return res.status(400).json({
      success: false,
      message: `Insufficient stock. Available stock: ${product.stock}`,
    });
  }

  const cart = await getOrCreateCart(req.user._id);

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    const nextQty = existingItem.quantity + qty;
    if (product.stock < nextQty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available stock: ${product.stock}`,
      });
    }

    existingItem.quantity = nextQty;
    existingItem.name = product.name;
    existingItem.price = product.price;
    existingItem.category = product.category;
    existingItem.subCategory = product.subCategory;
  } else {
    cart.items.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      subCategory: product.subCategory,
      quantity: qty,
    });
  }

  await cart.save();

  return res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: { cart },
  });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity);

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((entry) => entry.productId.toString() === productId);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found in cart',
    });
  }

  if (qty <= 0) {
    cart.items = cart.items.filter((entry) => entry.productId.toString() !== productId);
  } else {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock < qty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available stock: ${product.stock}`,
      });
    }

    item.quantity = qty;
    item.name = product.name;
    item.price = product.price;
    item.category = product.category;
    item.subCategory = product.subCategory;
  }

  await cart.save();

  return res.json({
    success: true,
    message: 'Cart updated',
    data: { cart },
  });
});

const removeCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const cart = await getOrCreateCart(req.user._id);
  const originalLength = cart.items.length;

  cart.items = cart.items.filter((entry) => entry.productId.toString() !== id);

  if (cart.items.length === originalLength) {
    return res.status(404).json({
      success: false,
      message: 'Item not found in cart',
    });
  }

  await cart.save();

  return res.json({
    success: true,
    message: 'Item removed from cart',
    data: { cart },
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
