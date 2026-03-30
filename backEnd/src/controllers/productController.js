const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

function getSortOption(sort) {
  if (sort === 'price_asc') {
    return { price: 1 };
  }
  if (sort === 'price_desc') {
    return { price: -1 };
  }
  return { createdAt: -1 };
}

async function listProducts(req, res, extraFilter = {}) {
  const { page = 1, limit = 10, sort = 'latest' } = req.query;

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
  const skip = (safePage - 1) * safeLimit;

  const filter = { ...extraFilter };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(getSortOption(sort)).skip(skip).limit(safeLimit),
    Product.countDocuments(filter),
  ]);

  return res.json({
    success: true,
    data: {
      products,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    },
  });
}

const getProducts = asyncHandler(async (req, res) => {
  return listProducts(req, res);
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  return listProducts(req, res, { category: String(req.params.category).toLowerCase() });
});

const getProductsBySubCategory = asyncHandler(async (req, res) => {
  return listProducts(req, res, {
    subCategory: String(req.params.subCategory).toLowerCase(),
  });
});

const searchProducts = asyncHandler(async (req, res) => {
  const keyword = String(req.query.q || '').trim();

  if (!keyword) {
    return res.status(400).json({
      success: false,
      message: 'q query parameter is required',
    });
  }

  return listProducts(req, res, {
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ],
  });
});

const filterProducts = asyncHandler(async (req, res) => {
  const { category, subCategory, minPrice, maxPrice } = req.query;

  const filter = {};

  if (category) {
    filter.category = String(category).toLowerCase();
  }
  if (subCategory) {
    filter.subCategory = String(subCategory).toLowerCase();
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) {
      filter.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  return listProducts(req, res, filter);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  return res.json({
    success: true,
    data: { product },
  });
});

const createProduct = asyncHandler(async (req, res) => {
  if (process.env.ADMIN_SECRET) {
    const providedSecret = req.headers['x-admin-secret'];
    if (providedSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: invalid admin secret',
      });
    }
  }

  const product = await Product.create({
    ...req.body,
    category: String(req.body.category).toLowerCase(),
    subCategory: String(req.body.subCategory).toLowerCase(),
  });

  return res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: { product },
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  if (process.env.ADMIN_SECRET) {
    const providedSecret = req.headers['x-admin-secret'];
    if (providedSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: invalid admin secret',
      });
    }
  }

  const payload = { ...req.body };
  if (payload.category) {
    payload.category = String(payload.category).toLowerCase();
  }
  if (payload.subCategory) {
    payload.subCategory = String(payload.subCategory).toLowerCase();
  }

  const product = await Product.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  return res.json({
    success: true,
    message: 'Product updated successfully',
    data: { product },
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  if (process.env.ADMIN_SECRET) {
    const providedSecret = req.headers['x-admin-secret'];
    if (providedSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: invalid admin secret',
      });
    }
  }

  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  return res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

module.exports = {
  getProducts,
  getProductsByCategory,
  getProductsBySubCategory,
  searchProducts,
  filterProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
