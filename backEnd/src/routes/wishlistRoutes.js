const express = require('express');
const { body, param } = require('express-validator');

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', protect, getWishlist);
router.get('/check', protect, checkWishlist);

router.post(
  '/',
  protect,
  [body('productId').optional().isMongoId(), body('petId').optional().isMongoId()],
  validateRequest,
  addToWishlist
);

router.delete(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Valid item id is required')],
  validateRequest,
  removeFromWishlist
);

module.exports = router;
