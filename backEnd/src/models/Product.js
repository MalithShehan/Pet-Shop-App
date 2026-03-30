const mongoose = require('mongoose');

const PRODUCT_CATEGORIES = ['pet', 'food', 'accessory'];
const PRODUCT_SUB_CATEGORIES = [
  'dog',
  'cat',
  'bird',
  'dog-food',
  'cat-food',
  'bird-food',
  'toys',
  'cages',
  'leashes',
  'bowls',
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
    category: {
      type: String,
      required: true,
      enum: PRODUCT_CATEGORIES,
      lowercase: true,
      trim: true,
    },
    subCategory: {
      type: String,
      required: true,
      enum: PRODUCT_SUB_CATEGORIES,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
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
