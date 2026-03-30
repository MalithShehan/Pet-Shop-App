export type ProductCategory = 'pet' | 'food' | 'accessory';

export type ProductSubCategory =
  | 'dog'
  | 'cat'
  | 'bird'
  | 'dog-food'
  | 'cat-food'
  | 'bird-food'
  | 'toys'
  | 'cages'
  | 'leashes'
  | 'bowls';

export type ProductItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  description: string;
  stock?: number;
};

export const products: ProductItem[] = [
  {
    id: 'pet-dog-1',
    name: 'Golden Retriever Puppy',
    category: 'pet',
    subCategory: 'dog',
    price: 799.0,
    image:
      'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?auto=format&fit=crop&w=900&q=80',
    description: 'Friendly and playful companion, perfect for family homes and daily walks.',
    stock: 4,
  },
  {
    id: 'pet-cat-1',
    name: 'Persian Kitten',
    category: 'pet',
    subCategory: 'cat',
    price: 649.0,
    image:
      'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=900&q=80',
    description: 'Calm and affectionate kitten with silky fur and gentle personality.',
    stock: 5,
  },
  {
    id: 'pet-bird-1',
    name: 'Sun Conure',
    category: 'pet',
    subCategory: 'bird',
    price: 399.0,
    image:
      'https://images.unsplash.com/photo-1591198936750-16d8e15edb9e?auto=format&fit=crop&w=900&q=80',
    description: 'Colorful and social bird with a lively, curious personality and bright energy.',
    stock: 7,
  },
  {
    id: 'food-dog-1',
    name: 'Premium Dog Food 5kg',
    category: 'food',
    subCategory: 'dog-food',
    price: 42.5,
    image:
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80',
    description: 'Balanced nutrition with high protein for active adult dogs.',
    stock: 50,
  },
  {
    id: 'food-cat-1',
    name: 'Organic Cat Food 3kg',
    category: 'food',
    subCategory: 'cat-food',
    price: 35.0,
    image:
      'https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?auto=format&fit=crop&w=900&q=80',
    description: 'Grain-free cat food with salmon and essential vitamins.',
    stock: 42,
  },
  {
    id: 'food-bird-1',
    name: 'Bird Seed Mix 2kg',
    category: 'food',
    subCategory: 'bird-food',
    price: 19.9,
    image:
      'https://images.unsplash.com/photo-1501286353178-1ec881214838?auto=format&fit=crop&w=900&q=80',
    description: 'Nutrient-rich seed blend formulated for parrots and small birds.',
    stock: 64,
  },
  {
    id: 'acc-cage-1',
    name: 'Comfort Bird Cage',
    category: 'accessory',
    subCategory: 'cages',
    price: 89.0,
    image:
      'https://images.unsplash.com/photo-1611764461525-95e54f4bde30?auto=format&fit=crop&w=900&q=80',
    description: 'Spacious cage with secure lock and detachable food tray.',
    stock: 12,
  },
  {
    id: 'acc-toy-1',
    name: 'Interactive Dog Rope Toy',
    category: 'accessory',
    subCategory: 'toys',
    price: 12.5,
    image:
      'https://images.unsplash.com/photo-1560743173-567a3b5658b1?auto=format&fit=crop&w=900&q=80',
    description: 'Durable rope toy for chewing, fetch, and tug play sessions.',
    stock: 38,
  },
  {
    id: 'acc-toy-2',
    name: 'Cat Feather Teaser',
    category: 'accessory',
    subCategory: 'toys',
    price: 9.99,
    image:
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80',
    description: 'Lightweight teaser wand that keeps indoor cats active and happy.',
    stock: 45,
  },
  {
    id: 'acc-leash-1',
    name: 'Reflective Dog Leash',
    category: 'accessory',
    subCategory: 'leashes',
    price: 22.0,
    image:
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=900&q=80',
    description: 'Comfort grip leash with reflective stitching for evening walks.',
    stock: 30,
  },
  {
    id: 'acc-bowl-1',
    name: 'Anti-Slip Feeding Bowl',
    category: 'accessory',
    subCategory: 'bowls',
    price: 14.75,
    image:
      'https://images.unsplash.com/photo-1583511655826-05700442b31b?auto=format&fit=crop&w=900&q=80',
    description: 'Stainless bowl with silicone base to prevent slipping while feeding.',
    stock: 55,
  },
];

export const categoryOptions = ['All', 'Pets', 'Foods', 'Accessories'] as const;
export type CategoryOption = (typeof categoryOptions)[number];

export const subCategoryByCategory: Record<CategoryOption, readonly string[]> = {
  All: ['All Types', 'Dog', 'Cat', 'Bird', 'Dog Food', 'Cat Food', 'Bird Food', 'Toys', 'Cages', 'Leashes', 'Bowls'],
  Pets: ['All Types', 'Dog', 'Cat', 'Bird'],
  Foods: ['All Types', 'Dog Food', 'Cat Food', 'Bird Food'],
  Accessories: ['All Types', 'Toys', 'Cages', 'Leashes', 'Bowls'],
};

export const subCategoryLabelMap: Record<ProductSubCategory, string> = {
  dog: 'Dog',
  cat: 'Cat',
  bird: 'Bird',
  'dog-food': 'Dog Food',
  'cat-food': 'Cat Food',
  'bird-food': 'Bird Food',
  toys: 'Toys',
  cages: 'Cages',
  leashes: 'Leashes',
  bowls: 'Bowls',
};

export const categoryLabelMap: Record<ProductCategory, string> = {
  pet: 'Pet',
  food: 'Food',
  accessory: 'Accessory',
};

export const categoryOptionToValue: Record<CategoryOption, ProductCategory | 'all'> = {
  All: 'all',
  Pets: 'pet',
  Foods: 'food',
  Accessories: 'accessory',
};

export const subCategoryLabelToValue: Record<string, ProductSubCategory | 'all'> = {
  'All Types': 'all',
  Dog: 'dog',
  Cat: 'cat',
  Bird: 'bird',
  'Dog Food': 'dog-food',
  'Cat Food': 'cat-food',
  'Bird Food': 'bird-food',
  Toys: 'toys',
  Cages: 'cages',
  Leashes: 'leashes',
  Bowls: 'bowls',
};

// Backward-compatible exports used by existing screens.
export type PetItem = ProductItem;
export const pets = products;
export const categories = categoryOptions;
