import { apiClient } from "@/shared/infrastructure/http";
import type { Product } from "../../domain/entities/product.entity";
import type {
  ProductRepositoryPort,
  PaginatedResult,
} from "../../application/ports/product.repository.port";
import type {
  ProductListResponseDto,
  ProductResponseDto,
  ProductApiRawDto,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
} from "../../application/dto/product.dto";
import { ProductMapper } from "../../application/mappers/product.mapper";

interface ApiResponse<T> {
  data: T;
}

/** Convierte la respuesta real del API al DTO que espera el dominio */
function mapApiProductToDto(raw: ProductApiRawDto): ProductResponseDto {
  const unit = raw.unit;
  const unitOfMeasure =
    raw.unitOfMeasure ??
    (typeof unit === "object" && unit !== null
      ? unit.name ?? unit.code ?? "UNIT"
      : "UNIT");

  return {
    id: raw.id,
    sku: raw.sku,
    name: raw.name,
    description: raw.description ?? null,
    categoryId: raw.categoryId ?? null,
    categoryName: raw.categoryName ?? null,
    unitOfMeasure,
    cost: raw.cost ?? 0,
    price: raw.price ?? 0,
    minStock: raw.minStock ?? 0,
    maxStock: raw.maxStock ?? 0,
    isActive: raw.isActive ?? raw.status === "ACTIVE",
    imageUrl: raw.imageUrl ?? null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export class ProductApiAdapter implements ProductRepositoryPort {
  private readonly basePath = "/inventory/products";

  async findAll(filters?: ProductFilters): Promise<PaginatedResult<Product>> {
    const response = await apiClient.get<{
      data: ProductApiRawDto[];
      pagination: ProductListResponseDto["pagination"];
    }>(this.basePath, {
      params: this.buildQueryParams(filters),
    });

    return {
      data: response.data.data.map((raw) =>
        ProductMapper.toDomain(mapApiProductToDto(raw))
      ),
      pagination: response.data.pagination,
    };
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const response = await apiClient.get<ApiResponse<ProductApiRawDto>>(
        `${this.basePath}/${id}`
      );
      const dto = mapApiProductToDto(response.data.data);
      return ProductMapper.toDomain(dto);
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
      params.status = filters.isActive ? "ACTIVE" : "INACTIVE";
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
