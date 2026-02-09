import type { TransferStatus } from "../../domain/entities/transfer.entity";

/**
 * API Response DTOs for Transfers
 */

export interface TransferLineResponseDto {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  receivedQuantity: number | null;
}

/** Raw shape returned by GET /inventory/transfers (list) */
export interface TransferApiRawDto {
  id: string;
  fromWarehouseId: string;
  fromWarehouseName?: string;
  toWarehouseId: string;
  toWarehouseName?: string;
  status: TransferStatus;
  note: string | null;
  linesCount?: number;
  lines?: TransferLineResponseDto[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export interface TransferResponseDto {
  id: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  status: TransferStatus;
  notes: string | null;
  lines: TransferLineResponseDto[];
  linesCount: number;
  createdBy: string;
  createdAt: string;
  completedAt: string | null;
}

export interface TransferListResponseDto {
  data: TransferApiRawDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateTransferLineDto {
  productId: string;
  quantity: number;
}

export interface CreateTransferDto {
  fromWarehouseId: string;
  toWarehouseId: string;
  notes?: string;
  lines: CreateTransferLineDto[];
}

export interface UpdateTransferStatusDto {
  status: TransferStatus;
}

export interface TransferFilters {
  fromWarehouseId?: string;
  toWarehouseId?: string;
  status?: TransferStatus;
  search?: string;
  page?: number;
  limit?: number;
}
