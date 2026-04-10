const petService = require('../services/petService');
const asyncHandler = require('../middleware/asyncHandler');

const getPets = asyncHandler(async (req, res) => {
  const result = await petService.getAll(req.query);

  return res.json({
    success: true,
    data: result,
  });
});

const getPetById = asyncHandler(async (req, res) => {
  const pet = await petService.getById(req.params.id);

  return res.json({
    success: true,
    data: { pet },
  });
});

const getFeaturedPets = asyncHandler(async (req, res) => {
  const pets = await petService.getFeatured(req.query.limit);

  return res.json({
    success: true,
    data: { pets },
  });
});

const createPet = asyncHandler(async (req, res) => {
  const pet = await petService.create(req.body);

  return res.status(201).json({
    success: true,
    message: 'Pet created successfully',
    data: { pet },
  });
});

const updatePet = asyncHandler(async (req, res) => {
  const pet = await petService.update(req.params.id, req.body);

  return res.json({
    success: true,
    message: 'Pet updated successfully',
    data: { pet },
  });
});

const deletePet = asyncHandler(async (req, res) => {
  await petService.delete(req.params.id);

  return res.json({
    success: true,
    message: 'Pet deleted successfully',
  });
});

module.exports = {
  getPets,
  getPetById,
  getFeaturedPets,
  createPet,
  updatePet,
  deletePet,
};
