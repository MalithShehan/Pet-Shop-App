const Review = require('../models/Review');
const Product = require('../models/Product');

class ReviewService {
  async create(userId, { productId, petId, rating, comment }) {
    if (productId) {
      const existing = await Review.findOne({ userId, productId });
      if (existing) {
        const error = new Error('You have already reviewed this product');
        error.statusCode = 409;
        throw error;
      }
    }

    const review = await Review.create({ userId, productId, petId, rating, comment });
    await review.populate('userId', 'name avatar');

    // Update product rating
    if (productId) {
      await this._updateProductRating(productId);
    }

    return review;
  }

  async getByProduct(productId, { page = 1, limit = 10 }) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ productId })
        .populate('userId', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take),
      Review.countDocuments({ productId }),
    ]);

    return {
      reviews,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    };
  }

  async delete(reviewId, userId) {
    const review = await Review.findById(reviewId);
    if (!review) {
      const error = new Error('Review not found');
      error.statusCode = 404;
      throw error;
    }

    if (review.userId.toString() !== userId) {
      const error = new Error('Not authorized to delete this review');
      error.statusCode = 403;
      throw error;
    }

    const { productId } = review;
    await Review.findByIdAndDelete(reviewId);

    // Update product rating
    if (productId) {
      await this._updateProductRating(productId);
    }
  }

  async _updateProductRating(productId) {
    const stats = await Review.aggregate([
      { $match: { productId: productId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        numReviews: stats[0].count,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        numReviews: 0,
      });
    }
  }
}

module.exports = new ReviewService();
