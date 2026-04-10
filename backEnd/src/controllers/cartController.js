const cartService = require('../services/cartService');
const asyncHandler = require('../middleware/asyncHandler');

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);

  return res.json({
    success: true,
    data: { cart },
  });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addItem(req.user.id, {
    productId,
    quantity: Number(quantity || 1),
  });

  return res.json({
    success: true,
    message: 'Item added to cart',
    data: { cart },
  });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.updateItem(req.user.id, {
    productId,
    quantity: Number(quantity),
  });

  return res.json({
    success: true,
    message: 'Cart updated',
    data: { cart },
  });
});

const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user.id, req.params.id);

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
