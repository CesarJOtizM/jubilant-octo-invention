import type { PaginatedResult } from "@/shared/application/dto/pagination.dto";
import type { Stock } from "@/modules/inventory/domain/entities/stock.entity";
import type { StockFilters } from "@/modules/inventory/application/dto/stock.dto";

export type { PaginatedResult };

export interface StockRepositoryPort {
  findAll(filters?: StockFilters): Promise<PaginatedResult<Stock>>;
  findByProductAndWarehouse(
    productId: string,
    warehouseId: string,
    companyId?: string,
  ): Promise<Stock | null>;
}
