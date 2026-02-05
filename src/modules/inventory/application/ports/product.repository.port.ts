import type { Product } from "../../domain/entities/product.entity";
import type {
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
} from "../dto/product.dto";

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductRepositoryPort {
  findAll(filters?: ProductFilters): Promise<PaginatedResult<Product>>;
  findById(id: string): Promise<Product | null>;
  create(data: CreateProductDto): Promise<Product>;
  update(id: string, data: UpdateProductDto): Promise<Product>;
  delete(id: string): Promise<void>;
  toggleStatus(id: string, isActive: boolean): Promise<Product>;
}
