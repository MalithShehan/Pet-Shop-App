const express = require('express');
const { query, param } = require('express-validator');

const {
  getPets,
  getPetById,
  getFeaturedPets,
  createPet,
  updatePet,
  deletePet,
} = require('../controllers/petController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', getPets);
router.get('/featured', getFeaturedPets);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Valid pet id is required')],
  validateRequest,
  getPetById
);

// Admin routes
router.post('/', protect, adminOnly, createPet);
router.put('/:id', protect, adminOnly, updatePet);
router.delete('/:id', protect, adminOnly, deletePet);

module.exports = router;
