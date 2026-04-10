require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Pet = require('../models/Pet');

const products = [
  {
    name: 'Premium Dog Food',
    category: 'FOOD',
    subCategory: 'DOG_FOOD',
    price: 2499.99,
    stock: 50,
    description: 'High-quality premium dog food with real chicken and vegetables. Rich in protein and essential nutrients for your adult dog.',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Whiskas Cat Food',
    category: 'FOOD',
    subCategory: 'CAT_FOOD',
    price: 1299.99,
    stock: 75,
    description: 'Delicious ocean fish flavored cat food. Complete nutrition for adult cats with vitamins and minerals.',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    rating: 4.3,
    numReviews: 8,
  },
  {
    name: 'Bird Seed Mix',
    category: 'FOOD',
    subCategory: 'BIRD_FOOD',
    price: 799.99,
    stock: 100,
    description: 'Premium blend of seeds, grains, and dried fruits for all types of pet birds.',
    image: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=400',
    rating: 4.0,
    numReviews: 5,
  },
  {
    name: 'Interactive Rope Toy',
    category: 'TOYS',
    subCategory: 'INTERACTIVE_TOYS',
    price: 599.99,
    stock: 200,
    description: 'Durable cotton rope toy for dogs. Great for tug-of-war, fetch, and solo chewing.',
    image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400',
    rating: 4.7,
    numReviews: 20,
  },
  {
    name: 'Premium Dog Leash',
    category: 'ACCESSORIES',
    subCategory: 'LEASHES',
    price: 1499.99,
    stock: 30,
    description: 'Retractable dog leash with comfortable grip. 5-meter extension with one-button lock.',
    image: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400',
    rating: 4.6,
    numReviews: 15,
  },
  {
    name: 'Stainless Steel Bowl Set',
    category: 'ACCESSORIES',
    subCategory: 'BOWLS',
    price: 899.99,
    stock: 60,
    description: 'Set of 2 non-slip stainless steel bowls with silicone base. Dishwasher safe.',
    image: 'https://images.unsplash.com/photo-1583337130417-13104dec14a6?w=400',
    rating: 4.4,
    numReviews: 10,
  },
  {
    name: 'Luxury Cat Bed',
    category: 'ACCESSORIES',
    subCategory: 'BEDS',
    price: 3499.99,
    stock: 25,
    description: 'Ultra-soft plush cat bed with raised edges for security. Machine washable cover.',
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400',
    rating: 4.8,
    numReviews: 18,
  },
  {
    name: 'Bird Cage Deluxe',
    category: 'ACCESSORIES',
    subCategory: 'CAGES',
    price: 7999.99,
    stock: 15,
    description: 'Large wrought iron bird cage with multiple perches, feeding cups, and removable tray.',
    image: 'https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=400',
    rating: 4.2,
    numReviews: 7,
  },
  {
    name: 'Pet Shampoo Natural',
    category: 'GROOMING',
    subCategory: 'SHAMPOO',
    price: 699.99,
    stock: 80,
    description: 'Natural oatmeal pet shampoo for sensitive skin. Soap-free, gentle formula with aloe vera.',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400',
    rating: 4.1,
    numReviews: 6,
  },
  {
    name: 'Plush Squeaky Toy',
    category: 'TOYS',
    subCategory: 'PLUSH_TOYS',
    price: 449.99,
    stock: 150,
    description: 'Adorable plush animal toy with built-in squeaker. Perfect for small to medium dogs.',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400',
    rating: 4.5,
    numReviews: 22,
  },
];

const pets = [
  {
    name: 'Buddy',
    breed: 'Golden Retriever',
    category: 'DOG',
    gender: 'MALE',
    age: '2 years',
    price: 45000,
    description: 'Friendly and loyal Golden Retriever. Fully vaccinated, trained, and loves kids.',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    images: [],
    available: true,
  },
  {
    name: 'Luna',
    breed: 'Persian Cat',
    category: 'CAT',
    gender: 'FEMALE',
    age: '1 year',
    price: 25000,
    description: 'Beautiful white Persian cat with blue eyes. Very affectionate and gentle.',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    images: [],
    available: true,
  },
  {
    name: 'Charlie',
    breed: 'Cockatiel',
    category: 'BIRD',
    gender: 'MALE',
    age: '6 months',
    price: 8000,
    description: 'Friendly hand-raised cockatiel. Can whistle tunes and loves human interaction.',
    image: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=400',
    images: [],
    available: true,
  },
  {
    name: 'Max',
    breed: 'German Shepherd',
    category: 'DOG',
    gender: 'MALE',
    age: '1.5 years',
    price: 55000,
    description: 'Intelligent German Shepherd, great guard dog. Trained basic commands.',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400',
    images: [],
    available: true,
  },
  {
    name: 'Nemo',
    breed: 'Goldfish',
    category: 'FISH',
    gender: 'MALE',
    age: '3 months',
    price: 500,
    description: 'Beautiful fancy goldfish with flowing fins. Healthy and vibrant orange color.',
    image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400',
    images: [],
    available: true,
  },
  {
    name: 'Snowball',
    breed: 'Holland Lop',
    category: 'RABBIT',
    gender: 'FEMALE',
    age: '4 months',
    price: 7000,
    description: 'Adorable white Holland Lop rabbit. Very gentle and loves to be held.',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400',
    images: [],
    available: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    // Clear existing data
    await Product.deleteMany({});
    await Pet.deleteMany({});
    console.log('Cleared existing products and pets');

    // Seed products
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);

    // Seed pets
    await Pet.insertMany(pets);
    console.log(`Seeded ${pets.length} pets`);

    console.log('Seeding complete!');
  } catch (e) {
    console.error('Seed error:', e);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
