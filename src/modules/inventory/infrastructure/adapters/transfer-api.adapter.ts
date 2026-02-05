import { apiClient } from "@/shared/infrastructure/http";
import type { Transfer, TransferStatus } from "../../domain/entities/transfer.entity";
import type {
  TransferRepositoryPort,
  PaginatedResult,
} from "../../application/ports/transfer.repository.port";
import type {
  TransferListResponseDto,
  TransferResponseDto,
  CreateTransferDto,
  TransferFilters,
} from "../../application/dto/transfer.dto";
import { TransferMapper } from "../../application/mappers/transfer.mapper";

interface ApiResponse<T> {
  data: T;
}

export class TransferApiAdapter implements TransferRepositoryPort {
  private readonly basePath = "/inventory/transfers";

  async findAll(filters?: TransferFilters): Promise<PaginatedResult<Transfer>> {
    const response = await apiClient.get<TransferListResponseDto>(this.basePath, {
      params: this.buildQueryParams(filters),
    });

    return {
      data: response.data.data.map(TransferMapper.toDomain),
      pagination: response.data.pagination,
    };
  }

  async findById(id: string): Promise<Transfer | null> {
    try {
      const response = await apiClient.get<ApiResponse<TransferResponseDto>>(
        `${this.basePath}/${id}`
      );
      return TransferMapper.toDomain(response.data.data);
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return null;
      }
      throw error;
    }
  }

  async create(data: CreateTransferDto): Promise<Transfer> {
    const response = await apiClient.post<ApiResponse<TransferResponseDto>>(
      this.basePath,
      data
    );
    return TransferMapper.toDomain(response.data.data);
  }

  async updateStatus(id: string, status: TransferStatus): Promise<Transfer> {
    const response = await apiClient.patch<ApiResponse<TransferResponseDto>>(
      `${this.basePath}/${id}/status`,
      { status }
    );
    return TransferMapper.toDomain(response.data.data);
  }

  private buildQueryParams(filters?: TransferFilters): Record<string, unknown> {
    if (!filters) return {};

    const params: Record<string, unknown> = {};

    if (filters.productId) {
      params.productId = filters.productId;
    }
    if (filters.fromWarehouseId) {
      params.fromWarehouseId = filters.fromWarehouseId;
    }
    if (filters.toWarehouseId) {
      params.toWarehouseId = filters.toWarehouseId;
    }
    if (filters.status) {
      params.status = filters.status;
    }
    if (filters.search) {
      params.search = filters.search;
    }
    if (filters.page) {
      params.page = filters.page;
    }
    if (filters.limit) {
      params.limit = filters.limit;
    }

    return params;
  }

  private isNotFoundError(error: unknown): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: { status?: number } }).response === "object" &&
      (error as { response: { status?: number } }).response?.status === 404
    );
  }
}

export const transferApiAdapter = new TransferApiAdapter();
