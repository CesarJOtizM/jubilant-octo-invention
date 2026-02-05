import type { TransferStatus } from "../../domain/entities/transfer.entity";

/**
 * API Response DTOs for Transfers
 */

export interface TransferResponseDto {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  quantity: number;
  status: TransferStatus;
  notes: string | null;
  createdBy: string;
  createdAt: string;
  completedAt: string | null;
}

export interface TransferListResponseDto {
  data: TransferResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateTransferDto {
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  notes?: string;
}

export interface UpdateTransferStatusDto {
  status: TransferStatus;
}

export interface TransferFilters {
  productId?: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  status?: TransferStatus;
  search?: string;
  page?: number;
  limit?: number;
}
