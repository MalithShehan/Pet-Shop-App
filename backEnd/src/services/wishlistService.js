const Wishlist = require('../models/Wishlist');

class WishlistService {
  async getWishlist(userId) {
    let wishlist = await Wishlist.findOne({ userId })
      .populate('items.productId', 'name price image stock category rating')
      .populate('items.petId', 'name price image category breed available');

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, items: [] });
    }

    return wishlist;
  }

  async addItem(userId, { productId, petId }) {
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, items: [] });
    }

    if (productId) {
      const existing = wishlist.items.find(
        (item) => item.productId && item.productId.toString() === productId
      );
      if (existing) {
        const error = new Error('Product is already in your wishlist');
        error.statusCode = 409;
        throw error;
      }

      wishlist.items.push({ productId });
    } else if (petId) {
      const existing = wishlist.items.find(
        (item) => item.petId && item.petId.toString() === petId
      );
      if (existing) {
        const error = new Error('Pet is already in your wishlist');
        error.statusCode = 409;
        throw error;
      }

      wishlist.items.push({ petId });
    }

    await wishlist.save();
    return this.getWishlist(userId);
  }

  async removeItem(userId, itemId) {
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      const error = new Error('Wishlist not found');
      error.statusCode = 404;
      throw error;
    }

    const itemIdx = wishlist.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIdx < 0) {
      const error = new Error('Item not found in wishlist');
      error.statusCode = 404;
      throw error;
    }

    wishlist.items.splice(itemIdx, 1);
    await wishlist.save();

    return this.getWishlist(userId);
  }

  async isInWishlist(userId, { productId, petId }) {
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return false;

    if (productId) {
      return wishlist.items.some(
        (item) => item.productId && item.productId.toString() === productId
      );
    }

    if (petId) {
      return wishlist.items.some(
        (item) => item.petId && item.petId.toString() === petId
      );
    }

    return false;
  }
}

module.exports = new WishlistService();
