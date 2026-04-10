const productService = require('../services/productService');
const asyncHandler = require('../middleware/asyncHandler');

const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getAll(req.query);

  return res.json({
    success: true,
    data: result,
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getById(req.params.id);

  return res.json({
    success: true,
    data: { product },
  });
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await productService.getFeatured(req.query.limit);

  return res.json({
    success: true,
    data: { products },
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.create(req.body);

  return res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: { product },
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.update(req.params.id, req.body);

  return res.json({
    success: true,
    message: 'Product updated successfully',
    data: { product },
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.delete(req.params.id);

  return res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

module.exports = {
  getProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
