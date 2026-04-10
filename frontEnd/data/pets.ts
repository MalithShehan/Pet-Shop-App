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

export const categoryOptions = ['All', 'Food', 'Toys', 'Accessories', 'Health', 'Grooming'] as const;
export type CategoryOption = (typeof categoryOptions)[number];

export const subCategoryByCategory: Record<CategoryOption, readonly string[]> = {
  All: [
    'All Types',
    'Dog Food', 'Cat Food', 'Bird Food', 'Fish Food',
    'Interactive Toys', 'Plush Toys', 'Chew Toys',
    'Leashes', 'Bowls', 'Beds', 'Cages', 'Carriers', 'Collars',
    'Vitamins',
    'Shampoo', 'Brushes',
  ],
  Food: ['All Types', 'Dog Food', 'Cat Food', 'Bird Food', 'Fish Food'],
  Toys: ['All Types', 'Interactive Toys', 'Plush Toys', 'Chew Toys'],
  Accessories: ['All Types', 'Leashes', 'Bowls', 'Beds', 'Cages', 'Carriers', 'Collars'],
  Health: ['All Types', 'Vitamins'],
  Grooming: ['All Types', 'Shampoo', 'Brushes'],
};

// Lookup label from any category value
const _categoryLabels: Record<string, string> = {
  FOOD: 'Food',
  TOYS: 'Toys',
  ACCESSORIES: 'Accessories',
  HEALTH: 'Health',
  GROOMING: 'Grooming',
  // Keep lowercase fallbacks for safety
  food: 'Food',
  toys: 'Toys',
  accessories: 'Accessories',
  health: 'Health',
  grooming: 'Grooming',
};

export function getCategoryLabel(cat: string): string {
  return _categoryLabels[cat] ?? cat;
}

// Keep Record export for backward compat (safe indexing via getCategoryLabel preferred)
export const categoryLabelMap = _categoryLabels as Record<ProductCategory, string>;

// Lookup label from any subCategory value
const _subCategoryLabels: Record<string, string> = {
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
  Food: 'FOOD',
  Toys: 'TOYS',
  Accessories: 'ACCESSORIES',
  Health: 'HEALTH',
  Grooming: 'GROOMING',
};

export const subCategoryLabelToValue: Record<string, ProductSubCategory | 'all'> = {
  'All Types': 'all',
  'Dog Food': 'DOG_FOOD',
  'Cat Food': 'CAT_FOOD',
  'Bird Food': 'BIRD_FOOD',
  'Fish Food': 'FISH_FOOD',
  'Interactive Toys': 'INTERACTIVE_TOYS',
  'Plush Toys': 'PLUSH_TOYS',
  'Chew Toys': 'CHEW_TOYS',
  Leashes: 'LEASHES',
  Bowls: 'BOWLS',
  Beds: 'BEDS',
  Cages: 'CAGES',
  Carriers: 'CARRIERS',
  Collars: 'COLLARS',
  Vitamins: 'VITAMINS',
  Shampoo: 'SHAMPOO',
  Brushes: 'BRUSHES',
};

// Backward-compatible exports used by existing screens.
export type PetItem = ProductItem;
export const pets = products;
export const categories = categoryOptions;
