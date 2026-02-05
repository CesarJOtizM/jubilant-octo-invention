import type { Category } from "../../domain/entities/category.entity";
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryFilters,
} from "../dto/category.dto";

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoryRepositoryPort {
  findAll(filters?: CategoryFilters): Promise<PaginatedResult<Category>>;
  findById(id: string): Promise<Category | null>;
  create(data: CreateCategoryDto): Promise<Category>;
  update(id: string, data: UpdateCategoryDto): Promise<Category>;
  delete(id: string): Promise<void>;
}
