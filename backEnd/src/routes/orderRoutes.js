const express = require('express');
const { body, param } = require('express-validator');

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Customer routes
router.post(
  '/',
  protect,
  [
    body('shippingAddress').trim().notEmpty().withMessage('Shipping address is required'),
    body('shippingCity').trim().notEmpty().withMessage('City is required'),
    body('shippingState').trim().notEmpty().withMessage('State is required'),
    body('shippingPostal').trim().notEmpty().withMessage('Postal code is required'),
    body('paymentMethod').optional().isIn(['CARD', 'COD', 'BANK_TRANSFER', 'EASYPAISA', 'JAZZCASH']),
  ],
  validateRequest,
  createOrder
);

router.get('/my-orders', protect, getMyOrders);

router.get(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Valid order id is required')],
  validateRequest,
  getOrderById
);

router.put(
  '/:id/cancel',
  protect,
  [param('id').isMongoId().withMessage('Valid order id is required')],
  validateRequest,
  cancelOrder
);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);

router.put(
  '/:id/status',
  protect,
  adminOnly,
  [
    param('id').isMongoId().withMessage('Valid order id is required'),
    body('status').isIn(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  ],
  validateRequest,
  updateOrderStatus
);

module.exports = router;
