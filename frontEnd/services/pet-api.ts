import { apiRequest } from './api-client';

export type Pet = {
  id: string;
  name: string;
  breed: string | null;
  category: string;
  gender: string | null;
  age: string | null;
  price: number;
  description: string | null;
  image: string;
  images: string[];
  available: boolean;
  reviews?: Review[];
  createdAt: string;
};

export type Review = {
  id: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string; avatar: string | null };
};

export type PetListResponse = {
  pets: Pet[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

type PetParams = {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: string;
};

export async function fetchPets(params: PetParams = {}): Promise<PetListResponse> {
  return apiRequest<PetListResponse>('/pets', {
    query: params as Record<string, string | number | undefined>,
  });
}

export async function fetchFeaturedPets(limit = 8): Promise<{ pets: Pet[] }> {
  return apiRequest<{ pets: Pet[] }>('/pets/featured', {
    query: { limit },
  });
}

export async function fetchPetById(id: string): Promise<{ pet: Pet }> {
  return apiRequest<{ pet: Pet }>(`/pets/${id}`);
}
