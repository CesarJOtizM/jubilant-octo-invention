import type { Return } from "../../domain/entities/return.entity";
import type {
  CreateReturnDto,
  CreateReturnLineDto,
  UpdateReturnDto,
  ReturnFilters,
} from "../dto/return.dto";

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReturnRepositoryPort {
  findAll(filters?: ReturnFilters): Promise<PaginatedResult<Return>>;
  findById(id: string): Promise<Return | null>;
  create(data: CreateReturnDto): Promise<Return>;
  update(id: string, data: UpdateReturnDto): Promise<Return>;
  confirm(id: string): Promise<Return>;
  cancel(id: string): Promise<Return>;
  addLine(returnId: string, line: CreateReturnLineDto): Promise<Return>;
  removeLine(returnId: string, lineId: string): Promise<Return>;
}
