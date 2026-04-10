const mongoose = require('mongoose');

const PRODUCT_CATEGORIES = ['FOOD', 'TOYS', 'ACCESSORIES', 'HEALTH', 'GROOMING'];
const PRODUCT_SUB_CATEGORIES = [
  'DOG_FOOD',
  'CAT_FOOD',
  'BIRD_FOOD',
  'FISH_FOOD',
  'CHEW_TOYS',
  'INTERACTIVE_TOYS',
  'PLUSH_TOYS',
  'COLLARS',
  'LEASHES',
  'BOWLS',
  'BEDS',
  'CAGES',
  'CARRIERS',
  'VITAMINS',
  'SHAMPOO',
  'BRUSHES',
];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
      enum: PRODUCT_CATEGORIES,
      trim: true,
    },
    subCategory: {
      type: String,
      enum: PRODUCT_SUB_CATEGORIES,
      trim: true,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
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

productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
module.exports.PRODUCT_CATEGORIES = PRODUCT_CATEGORIES;
module.exports.PRODUCT_SUB_CATEGORIES = PRODUCT_SUB_CATEGORIES;
