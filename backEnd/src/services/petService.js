const Pet = require('../models/Pet');

class PetService {
  async getAll({ page = 1, limit = 20, sort = 'latest', search, category, minPrice, maxPrice, gender }) {
    const filter = { available: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = category;
    if (gender) filter.gender = gender;

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
      default:
        sortObj = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = Math.min(parseInt(limit), 100);

    const [pets, total] = await Promise.all([
      Pet.find(filter).sort(sortObj).skip(skip).limit(take),
      Pet.countDocuments(filter),
    ]);

    return {
      pets,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    };
  }

  async getById(id) {
    const pet = await Pet.findById(id);
    if (!pet) {
      const error = new Error('Pet not found');
      error.statusCode = 404;
      throw error;
    }

    const Review = require('../models/Review');
    const reviews = await Review.find({ petId: id })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    return { ...pet.toJSON(), reviews };
  }

  async create(data) {
    return Pet.create(data);
  }

  async update(id, data) {
    const pet = await Pet.findByIdAndUpdate(id, data, { new: true });
    if (!pet) {
      const error = new Error('Pet not found');
      error.statusCode = 404;
      throw error;
    }

    return pet;
  }

  async delete(id) {
    const pet = await Pet.findByIdAndDelete(id);
    if (!pet) {
      const error = new Error('Pet not found');
      error.statusCode = 404;
      throw error;
    }
  }

  async getFeatured(limit = 8) {
    return Pet.find({ available: true }).sort({ createdAt: -1 }).limit(parseInt(limit));
  }
}

module.exports = new PetService();
