require('dotenv').config();

const connectDB = require('../config/db');
const Product = require('../models/Product');

const sampleProducts = [
  {
    name: 'Premium Dog Food',
    price: 2499.99,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
    category: 'FOOD',
    subCategory: 'DOG_FOOD',
    description: 'High-quality premium dog food with real chicken and vegetables. Rich in protein and essential nutrients for your adult dog.',
    stock: 50,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Whiskas Cat Food',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    category: 'FOOD',
    subCategory: 'CAT_FOOD',
    description: 'Delicious ocean fish flavored cat food. Complete nutrition for adult cats with vitamins and minerals.',
    stock: 75,
    rating: 4.3,
    numReviews: 8,
  },
  {
    name: 'Bird Seed Mix',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=400',
    category: 'FOOD',
    subCategory: 'BIRD_FOOD',
    description: 'Premium blend of seeds, grains, and dried fruits for all types of pet birds.',
    stock: 100,
    rating: 4.0,
    numReviews: 5,
  },
  {
    name: 'Interactive Rope Toy',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400',
    category: 'TOYS',
    subCategory: 'INTERACTIVE_TOYS',
    description: 'Durable cotton rope toy for dogs. Great for tug-of-war, fetch, and solo chewing.',
    stock: 200,
    rating: 4.7,
    numReviews: 20,
  },
  {
    name: 'Premium Dog Leash',
    price: 1499.99,
    image: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400',
    category: 'ACCESSORIES',
    subCategory: 'LEASHES',
    description: 'Retractable dog leash with comfortable grip. 5-meter extension with one-button lock.',
    stock: 30,
    rating: 4.6,
    numReviews: 15,
  },
  {
    name: 'Stainless Steel Bowl Set',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1583337130417-13104dec14a6?w=400',
    category: 'ACCESSORIES',
    subCategory: 'BOWLS',
    description: 'Set of 2 non-slip stainless steel bowls with silicone base. Dishwasher safe.',
    stock: 60,
    rating: 4.4,
    numReviews: 10,
  },
  {
    name: 'Luxury Cat Bed',
    price: 3499.99,
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400',
    category: 'ACCESSORIES',
    subCategory: 'BEDS',
    description: 'Ultra-soft plush cat bed with raised edges for security. Machine washable cover.',
    stock: 25,
    rating: 4.8,
    numReviews: 18,
  },
  {
    name: 'Bird Cage Deluxe',
    price: 7999.99,
    image: 'https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=400',
    category: 'ACCESSORIES',
    subCategory: 'CAGES',
    description: 'Large wrought iron bird cage with multiple perches, feeding cups, and removable tray.',
    stock: 15,
    rating: 4.2,
    numReviews: 7,
  },
  {
    name: 'Pet Shampoo Natural',
    price: 699.99,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400',
    category: 'GROOMING',
    subCategory: 'SHAMPOO',
    description: 'Natural oatmeal pet shampoo for sensitive skin. Soap-free, gentle formula with aloe vera.',
    stock: 80,
    rating: 4.1,
    numReviews: 6,
  },
  {
    name: 'Plush Squeaky Toy',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400',
    category: 'TOYS',
    subCategory: 'PLUSH_TOYS',
    description: 'Adorable plush animal toy with built-in squeaker. Perfect for small to medium dogs.',
    stock: 150,
    rating: 4.5,
    numReviews: 22,
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
