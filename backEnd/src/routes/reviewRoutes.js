const express = require('express');
const { body, param } = require('express-validator');

const {
  createReview,
  getProductReviews,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get(
  '/product/:productId',
  [param('productId').isMongoId().withMessage('Valid product id is required')],
  validateRequest,
  getProductReviews
);

router.post(
  '/',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim(),
    body('productId').optional().isMongoId(),
    body('petId').optional().isMongoId(),
  ],
  validateRequest,
  createReview
);

router.delete(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Valid review id is required')],
  validateRequest,
  deleteReview
);

module.exports = router;
