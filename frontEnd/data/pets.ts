export type ProductCategory = string;

export type ProductSubCategory = string;

export type ProductItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: ProductCategory;
  subCategory: ProductSubCategory;
  description: string;
  stock?: number;
  rating?: number;
  numReviews?: number;
};

/** @deprecated Use fetchProducts() from product-api instead */
export const products: ProductItem[] = [];

export const categoryOptions = ['All', 'Pets', 'Foods', 'Accessories'] as const;
export type CategoryOption = (typeof categoryOptions)[number];

export const subCategoryByCategory: Record<CategoryOption, readonly string[]> = {
  All: [
    'All Types',
    'Dog', 'Cat', 'Bird',
    'Dog Food', 'Cat Food', 'Bird Food', 'Fish Food',
    'Toys', 'Cages', 'Leashes', 'Bowls', 'Beds', 'Carriers',
    'Health', 'Grooming',
  ],
  Pets: ['All Types', 'Dog', 'Cat', 'Bird'],
  Foods: ['All Types', 'Dog Food', 'Cat Food', 'Bird Food', 'Fish Food'],
  Accessories: ['All Types', 'Toys', 'Cages', 'Leashes', 'Bowls', 'Beds', 'Carriers', 'Health', 'Grooming'],
};

// Lookup label from any category value (lowercase or UPPERCASE)
const _categoryLabels: Record<string, string> = {
  pet: 'Pet',
  food: 'Food',
  accessory: 'Accessory',
  FOOD: 'Food',
  TOYS: 'Toys',
  ACCESSORIES: 'Accessories',
  HEALTH: 'Health',
  GROOMING: 'Grooming',
};

export function getCategoryLabel(cat: string): string {
  return _categoryLabels[cat] ?? cat;
}

// Keep Record export for backward compat (safe indexing via getCategoryLabel preferred)
export const categoryLabelMap = _categoryLabels as Record<ProductCategory, string>;

// Lookup label from any subCategory value
const _subCategoryLabels: Record<string, string> = {
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
  DOG_FOOD: 'Dog Food',
  CAT_FOOD: 'Cat Food',
  BIRD_FOOD: 'Bird Food',
  FISH_FOOD: 'Fish Food',
  CHEW_TOYS: 'Chew Toys',
  INTERACTIVE_TOYS: 'Interactive Toys',
  PLUSH_TOYS: 'Plush Toys',
  COLLARS: 'Collars',
  LEASHES: 'Leashes',
  BOWLS: 'Bowls',
  BEDS: 'Beds',
  CAGES: 'Cages',
  CARRIERS: 'Carriers',
  VITAMINS: 'Vitamins',
  SHAMPOO: 'Shampoo',
  BRUSHES: 'Brushes',
};

export function getSubCategoryLabel(sub: string): string {
  return _subCategoryLabels[sub] ?? sub;
}

export const subCategoryLabelMap = _subCategoryLabels as Record<ProductSubCategory, string>;

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
  'Fish Food': 'FISH_FOOD',
  Toys: 'toys',
  Cages: 'cages',
  Leashes: 'leashes',
  Bowls: 'bowls',
  Beds: 'BEDS',
  Carriers: 'CARRIERS',
  Health: 'HEALTH',
  Grooming: 'GROOMING',
};

// Backward-compatible exports used by existing screens.
export type PetItem = ProductItem;
export const pets = products;
export const categories = categoryOptions;
