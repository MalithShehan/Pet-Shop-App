const express = require('express');
const { body, param } = require('express-validator');

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(protect);

router.get('/', getCart);

router.post(
  '/add',
  [
    body('productId').isMongoId().withMessage('Valid productId is required'),
    body('quantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Quantity must be an integer >= 1'),
  ],
  validateRequest,
  addToCart
);

router.put(
  '/update',
  [
    body('productId').isMongoId().withMessage('Valid productId is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be an integer >= 0'),
  ],
  validateRequest,
  updateCartItem
);

router.delete(
  '/remove/:id',
  [param('id').isMongoId().withMessage('Valid product id is required')],
  validateRequest,
  removeCartItem
);

module.exports = router;
