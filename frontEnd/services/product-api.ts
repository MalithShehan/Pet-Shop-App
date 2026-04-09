import { ProductCategory, ProductItem, ProductSubCategory } from '@/data/pets';
import { apiRequest } from '@/services/api-client';

type ProductListParams = {
  category?: ProductCategory;
  subCategory?: ProductSubCategory;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  q?: string;
  page?: number;
  limit?: number;
  sort?: 'latest' | 'price_asc' | 'price_desc' | 'rating';
};

type ProductListResponse = {
  products: ProductItem[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

export async function fetchProducts(params: ProductListParams = {}): Promise<ProductItem[]> {
  const { q, search, category, subCategory, minPrice, maxPrice, page = 1, limit = 100, sort = 'latest' } = params;

  const data = await apiRequest<ProductListResponse>('/products', {
    query: {
      search: q?.trim() || search?.trim() || undefined,
      category: category || undefined,
      subCategory: subCategory || undefined,
      minPrice,
      maxPrice,
      page,
      limit,
      sort,
    },
  });

  return data.products;
}

export async function fetchFeaturedProducts(limit = 8): Promise<ProductItem[]> {
  const data = await apiRequest<{ products: ProductItem[] }>('/products/featured', {
    query: { limit },
  });
  return data.products;
}

export async function fetchProductById(id: string): Promise<ProductItem> {
  const data = await apiRequest<{ product: ProductItem }>(`/products/${id}`);
  return data.product;
}
