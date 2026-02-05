import { apiClient } from "@/shared/infrastructure/http";
import type { Product } from "../../domain/entities/product.entity";
import type {
  ProductRepositoryPort,
  PaginatedResult,
} from "../../application/ports/product.repository.port";
import type {
  ProductListResponseDto,
  ProductResponseDto,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
} from "../../application/dto/product.dto";
import { ProductMapper } from "../../application/mappers/product.mapper";

interface ApiResponse<T> {
  data: T;
}

export class ProductApiAdapter implements ProductRepositoryPort {
  private readonly basePath = "/inventory/products";

  async findAll(filters?: ProductFilters): Promise<PaginatedResult<Product>> {
    const response = await apiClient.get<ProductListResponseDto>(this.basePath, {
      params: this.buildQueryParams(filters),
    });

    return {
      data: response.data.data.map(ProductMapper.toDomain),
      pagination: response.data.pagination,
    };
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const response = await apiClient.get<ApiResponse<ProductResponseDto>>(
        `${this.basePath}/${id}`
      );
      return ProductMapper.toDomain(response.data.data);
    } catch (error) {
      // Return null if product not found (404)
      if (this.isNotFoundError(error)) {
        return null;
      }
      throw error;
    }
  }

  async create(data: CreateProductDto): Promise<Product> {
    const response = await apiClient.post<ApiResponse<ProductResponseDto>>(
      this.basePath,
      data
    );
    return ProductMapper.toDomain(response.data.data);
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const response = await apiClient.put<ApiResponse<ProductResponseDto>>(
      `${this.basePath}/${id}`,
      data
    );
    return ProductMapper.toDomain(response.data.data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  async toggleStatus(id: string, isActive: boolean): Promise<Product> {
    const response = await apiClient.patch<ApiResponse<ProductResponseDto>>(
      `${this.basePath}/${id}/status`,
      { isActive }
    );
    return ProductMapper.toDomain(response.data.data);
  }

  private buildQueryParams(filters?: ProductFilters): Record<string, unknown> {
    if (!filters) return {};

    const params: Record<string, unknown> = {};

    if (filters.search) {
      params.search = filters.search;
    }
    if (filters.categoryId) {
      params.categoryId = filters.categoryId;
    }
    if (filters.isActive !== undefined) {
      params.isActive = filters.isActive;
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

export const productApiAdapter = new ProductApiAdapter();
