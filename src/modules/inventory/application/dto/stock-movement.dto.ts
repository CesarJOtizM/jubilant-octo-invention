import type { MovementType } from "../../domain/entities/stock-movement.entity";

/**
 * API Response DTOs for Stock Movements
 */

export interface StockMovementResponseDto {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  warehouseId: string;
  warehouseName: string;
  type: MovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  reference: string | null;
  createdBy: string;
  createdAt: string;
}

export interface StockMovementListResponseDto {
  data: StockMovementResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateStockMovementDto {
  productId: string;
  warehouseId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  reference?: string;
}

export interface StockMovementFilters {
  productId?: string;
  warehouseId?: string;
  type?: MovementType;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}
