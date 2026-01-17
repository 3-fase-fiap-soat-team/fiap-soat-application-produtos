export interface CategoryResponse {
  id: string;
  name: string;
}

export abstract class ICategoryClient {
  abstract findById(id: string): Promise<CategoryResponse | null>;
}
