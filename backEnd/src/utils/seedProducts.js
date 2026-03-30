require('dotenv').config();

const connectDB = require('../config/db');
const Product = require('../models/Product');

const sampleProducts = [
  {
    name: 'Premium Dog Food 5kg',
    price: 42.5,
    image:
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80',
    category: 'food',
    subCategory: 'dog-food',
    description: 'Balanced nutrition with high protein for active adult dogs.',
    stock: 50,
  },
  {
    name: 'Organic Cat Food 3kg',
    price: 35.0,
    image:
      'https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?auto=format&fit=crop&w=900&q=80',
    category: 'food',
    subCategory: 'cat-food',
    description: 'Grain-free cat food with salmon and essential vitamins.',
    stock: 42,
  },
  {
    name: 'Comfort Bird Cage',
    price: 89.0,
    image:
      'https://images.unsplash.com/photo-1611764461525-95e54f4bde30?auto=format&fit=crop&w=900&q=80',
    category: 'accessory',
    subCategory: 'cages',
    description: 'Spacious cage with secure lock and detachable food tray.',
    stock: 12,
  },
  {
    name: 'Interactive Dog Rope Toy',
    price: 12.5,
    image:
      'https://images.unsplash.com/photo-1560743173-567a3b5658b1?auto=format&fit=crop&w=900&q=80',
    category: 'accessory',
    subCategory: 'toys',
    description: 'Durable rope toy for chewing, fetch, and tug play sessions.',
    stock: 38,
  },
  {
    name: 'Reflective Dog Leash',
    price: 22.0,
    image:
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=900&q=80',
    category: 'accessory',
    subCategory: 'leashes',
    description: 'Comfort grip leash with reflective stitching for evening walks.',
    stock: 30,
  },
  {
    name: 'Anti-Slip Feeding Bowl',
    price: 14.75,
    image:
      'https://images.unsplash.com/photo-1583511655826-05700442b31b?auto=format&fit=crop&w=900&q=80',
    category: 'accessory',
    subCategory: 'bowls',
    description: 'Stainless bowl with silicone base to prevent slipping while feeding.',
    stock: 55,
  },
];

async function run() {
  try {
    await connectDB();

    for (const product of sampleProducts) {
      await Product.updateOne(
        { name: product.name, category: product.category, subCategory: product.subCategory },
        { $set: product },
        { upsert: true }
      );
    }

    const total = await Product.countDocuments();
    console.log(`Product seed complete. Total products in DB: ${total}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

run();
