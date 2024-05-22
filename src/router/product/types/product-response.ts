import { Product } from '@/entities';

export type ProductResponse = {
  totalProducts: number;
  page: number;
  totalPages: number;
  limit?: number;
  products: Product[] | object;
};
