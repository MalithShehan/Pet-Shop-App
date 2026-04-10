const express = require('express');
const { body, param, query } = require('express-validator');

const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const listQueryValidators = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  query('sort').optional().isIn(['latest', 'price_asc', 'price_desc', 'rating']).withMessage('Invalid sort value'),
];

router.get('/', listQueryValidators, validateRequest, getProducts);
router.get('/featured', getFeaturedProducts);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Valid product id is required')],
  validateRequest,
  getProductById
);

// Admin routes
router.post(
  '/',
  protect,
  adminOnly,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be >= 0'),
    body('image').isURL().withMessage('Image must be a valid URL'),
    body('category').notEmpty().withMessage('Category is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be >= 0'),
  ],
  validateRequest,
  createProduct
);

router.put(
  '/:id',
  protect,
  adminOnly,
  [param('id').isMongoId().withMessage('Valid product id is required')],
  validateRequest,
  updateProduct
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  [param('id').isMongoId().withMessage('Valid product id is required')],
  validateRequest,
  deleteProduct
);

module.exports = router;
