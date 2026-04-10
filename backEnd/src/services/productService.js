const Product = require('../models/Product');

class ProductService {
  async getAll({ page = 1, limit = 20, sort = 'latest', search, category, subCategory, minPrice, maxPrice }) {
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    if (subCategory) filter.subCategory = { $regex: new RegExp(`^${subCategory}$`, 'i') };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    let sortObj = {};
    switch (sort) {
      case 'price_asc':
        sortObj = { price: 1 };
        break;
      case 'price_desc':
        sortObj = { price: -1 };
        break;
      case 'rating':
        sortObj = { rating: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = Math.min(parseInt(limit), 100);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(take),
      Product.countDocuments(filter),
    ]);

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    };
  }

  async getById(id) {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    // Populate reviews separately
    const Review = require('../models/Review');
    const reviews = await Review.find({ productId: id })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    return { ...product.toJSON(), reviews };
  }

  async create(data) {
    return Product.create(data);
  }

  async update(id, data) {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    return product;
  }

  async delete(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
  }

  async getFeatured(limit = 8) {
    return Product.find().sort({ createdAt: -1 }).limit(parseInt(limit));
  }
}

module.exports = new ProductService();
