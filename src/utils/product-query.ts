export class ProductQuery {
  page: number;
  limit: number;

  constructor(queryParams: Params) {
    this.page = queryParams?.page || 1;
    this.limit = queryParams?.limit || 20;
  }
}

export type Params = { page: number; limit: number };
