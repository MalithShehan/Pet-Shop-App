const orderService = require('../services/orderService');
const asyncHandler = require('../middleware/asyncHandler');

const { createNotification } = require('./notificationController');
const { sendNotification } = require('../utils/socket');

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.create(req.user.id, req.body);

  // Create notification for user
  const notification = await createNotification(
    req.user.id,
    'order',
    'Your order has been placed!',
    `/orders/${order._id}`
  );
  // Emit real-time notification
  if (notification) {
    sendNotification(req.user.id.toString(), notification);
  }

  return res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: { order },
  });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getByUser(req.user.id, req.query);

  return res.json({
    success: true,
    data: result,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getById(req.params.id, req.user.id);

  return res.json({
    success: true,
    data: { order },
  });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(req.params.id, req.user.id);

  return res.json({
    success: true,
    message: 'Order cancelled',
    data: { order },
  });
});

// Admin endpoints
const getAllOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getAll(req.query);

  return res.json({
    success: true,
    data: result,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateStatus(req.params.id, req.body.status);

  return res.json({
    success: true,
    message: 'Order status updated',
    data: { order },
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};
