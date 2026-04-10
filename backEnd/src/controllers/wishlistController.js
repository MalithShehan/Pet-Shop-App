const wishlistService = require('../services/wishlistService');
const asyncHandler = require('../middleware/asyncHandler');

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user.id);

  return res.json({
    success: true,
    data: { wishlist },
  });
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId, petId } = req.body;
  const wishlist = await wishlistService.addItem(req.user.id, { productId, petId });

  return res.json({
    success: true,
    message: 'Added to wishlist',
    data: { wishlist },
  });
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.removeItem(req.user.id, req.params.id);

  return res.json({
    success: true,
    message: 'Removed from wishlist',
    data: { wishlist },
  });
});

const checkWishlist = asyncHandler(async (req, res) => {
  const { productId, petId } = req.query;
  const isInWishlist = await wishlistService.isInWishlist(req.user.id, { productId, petId });

  return res.json({
    success: true,
    data: { isInWishlist },
  });
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
};
