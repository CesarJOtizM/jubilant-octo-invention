import type { Warehouse } from "../../domain/entities/warehouse.entity";
import type {
  CreateWarehouseDto,
  UpdateWarehouseDto,
  WarehouseFilters,
} from "../dto/warehouse.dto";

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface WarehouseRepositoryPort {
  findAll(filters?: WarehouseFilters): Promise<PaginatedResult<Warehouse>>;
  findById(id: string): Promise<Warehouse | null>;
  create(data: CreateWarehouseDto): Promise<Warehouse>;
  update(id: string, data: UpdateWarehouseDto): Promise<Warehouse>;
  delete(id: string): Promise<void>;
  toggleStatus(id: string, isActive: boolean): Promise<Warehouse>;
}
