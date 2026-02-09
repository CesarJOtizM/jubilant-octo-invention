import type { StockMovement } from "../../domain/entities/stock-movement.entity";
import type {
  CreateStockMovementDto,
  StockMovementFilters,
} from "../dto/stock-movement.dto";

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StockMovementRepositoryPort {
  findAll(filters?: StockMovementFilters): Promise<PaginatedResult<StockMovement>>;
  findById(id: string): Promise<StockMovement | null>;
  create(data: CreateStockMovementDto): Promise<StockMovement>;
  post(id: string): Promise<StockMovement>;
  void(id: string): Promise<StockMovement>;
}
