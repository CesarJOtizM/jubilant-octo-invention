/**
 * API Response DTOs for Stock
 */

export interface StockResponseDto {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lastMovementAt: string | null;
}

export interface StockListResponseDto {
  data: StockResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StockFilters {
  productId?: string;
  warehouseId?: string;
  search?: string;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}
