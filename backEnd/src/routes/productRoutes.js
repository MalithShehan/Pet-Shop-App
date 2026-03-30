const express = require('express');
const { body, param, query } = require('express-validator');

const {
  getProducts,
  getProductsByCategory,
  getProductsBySubCategory,
  searchProducts,
  filterProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const categoryValues = ['pet', 'food', 'accessory'];
const subCategoryValues = [
  'dog',
  'cat',
  'bird',
  'dog-food',
  'cat-food',
  'bird-food',
  'toys',
  'cages',
  'leashes',
  'bowls',
];

const listQueryValidators = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be >= 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['latest', 'price_asc', 'price_desc'])
    .withMessage('sort must be latest, price_asc, or price_desc'),
];

router.get(
  '/',
  listQueryValidators,
  validateRequest,
  getProducts
);

router.get(
  '/category/:category',
  [
    ...listQueryValidators,
    param('category').isIn(categoryValues).withMessage('category must be pet, food, or accessory'),
  ],
  validateRequest,
  getProductsByCategory
);

router.get(
  '/subcategory/:subCategory',
  [
    ...listQueryValidators,
    param('subCategory')
      .isIn(subCategoryValues)
      .withMessage('invalid subCategory value'),
  ],
  validateRequest,
  getProductsBySubCategory
);

router.get(
  '/search',
  [
    ...listQueryValidators,
    query('q').isString().trim().notEmpty().withMessage('q query parameter is required'),
  ],
  validateRequest,
  searchProducts
);

router.get(
  '/filter',
  [
    ...listQueryValidators,
    query('category').optional().isIn(categoryValues).withMessage('invalid category value'),
    query('subCategory').optional().isIn(subCategoryValues).withMessage('invalid subCategory value'),
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be >= 0'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be >= 0'),
  ],
  validateRequest,
  filterProducts
);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Valid product id is required')],
  validateRequest,
  getProductById
);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be >= 0'),
    body('image').isURL().withMessage('Image must be a valid URL'),
    body('category').isIn(categoryValues).withMessage('category must be pet, food, or accessory'),
    body('subCategory').isIn(subCategoryValues).withMessage('invalid subCategory value'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('stock').optional().isInt({ min: 0 }).withMessage('stock must be >= 0'),
  ],
  validateRequest,
  createProduct
);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Valid product id is required'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be >= 0'),
    body('image').optional().isURL().withMessage('Image must be a valid URL'),
    body('category').optional().isIn(categoryValues).withMessage('category must be pet, food, or accessory'),
    body('subCategory').optional().isIn(subCategoryValues).withMessage('invalid subCategory value'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('stock').optional().isInt({ min: 0 }).withMessage('stock must be >= 0'),
  ],
  validateRequest,
  updateProduct
);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Valid product id is required')],
  validateRequest,
  deleteProduct
);

module.exports = router;
