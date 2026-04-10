const mongoose = require('mongoose');

const PET_CATEGORIES = ['DOG', 'CAT', 'BIRD', 'FISH', 'RABBIT'];
const GENDERS = ['MALE', 'FEMALE'];

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    breed: { type: String, default: null },
    category: {
      type: String,
      required: true,
      enum: PET_CATEGORIES,
    },
    gender: {
      type: String,
      enum: GENDERS,
      default: null,
    },
    age: { type: String, default: null },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: null },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  }
);

petSchema.index({ category: 1 });
petSchema.index({ name: 'text', description: 'text' });

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
module.exports.PET_CATEGORIES = PET_CATEGORIES;
module.exports.GENDERS = GENDERS;
