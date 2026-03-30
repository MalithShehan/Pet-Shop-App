import { ProductCategory, ProductItem, ProductSubCategory } from '@/data/pets';
import { apiRequest } from '@/services/api-client';

type ProductListParams = {
  category?: ProductCategory;
  subCategory?: ProductSubCategory;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  page?: number;
  limit?: number;
  sort?: 'latest' | 'price_asc' | 'price_desc';
};

export async function fetchProducts(params: ProductListParams = {}) {
  const { q, category, subCategory, minPrice, maxPrice, page = 1, limit = 100, sort = 'latest' } = params;

  if (q && q.trim()) {
    const data = await apiRequest<{
      products: ProductItem[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>('/products/search', {
      query: { q: q.trim(), page, limit, sort },
    });

    return data.products;
  }

  if (category && !subCategory && minPrice === undefined && maxPrice === undefined) {
    const data = await apiRequest<{
      products: ProductItem[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(`/products/category/${category}`, {
      query: { page, limit, sort },
    });

    return data.products;
  }

  if (subCategory && !category && minPrice === undefined && maxPrice === undefined) {
    const data = await apiRequest<{
      products: ProductItem[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(`/products/subcategory/${subCategory}`, {
      query: { page, limit, sort },
    });

    return data.products;
  }

  const data = await apiRequest<{
    products: ProductItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>('/products/filter', {
    query: {
      category,
      subCategory,
      minPrice,
      maxPrice,
      page,
      limit,
      sort,
    },
  });

  return data.products;
}

export async function fetchProductById(id: string) {
  const data = await apiRequest<{ product: ProductItem }>(`/products/${id}`);
  return data.product;
}
