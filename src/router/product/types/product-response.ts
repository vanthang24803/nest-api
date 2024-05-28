import { Product } from '@/entities';

export type ProductResponse = {
  total_products: number;
  page: number;
  total_pages: number;
  limit?: number;
  products: Product[] | object;
};
