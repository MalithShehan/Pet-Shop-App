const reviewService = require('../services/reviewService');
const asyncHandler = require('../middleware/asyncHandler');

const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.create(req.user.id, req.body);

  return res.status(201).json({
    success: true,
    message: 'Review submitted',
    data: { review },
  });
});

const getProductReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getByProduct(req.params.productId, req.query);

  return res.json({
    success: true,
    data: result,
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.delete(req.params.id, req.user.id);

  return res.json({
    success: true,
    message: 'Review deleted',
  });
});

module.exports = {
  createReview,
  getProductReviews,
  deleteReview,
};
