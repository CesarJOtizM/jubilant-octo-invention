/**
 * API Response DTOs for Products
 */

export interface ProductResponseDto {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  categoryId: string | null;
  categoryName: string | null;
  unitOfMeasure: string;
  cost: number;
  price: number;
  minStock: number;
  maxStock: number;
  isActive: boolean;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponseDto {
  data: ProductResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProductDto {
  sku: string;
  name: string;
  description?: string;
  categoryId?: string;
  unitOfMeasure: string;
  cost: number;
  price: number;
  minStock: number;
  maxStock: number;
  imageUrl?: string;
}

export interface UpdateProductDto {
  sku?: string;
  name?: string;
  description?: string;
  categoryId?: string;
  unitOfMeasure?: string;
  cost?: number;
  price?: number;
  minStock?: number;
  maxStock?: number;
  isActive?: boolean;
  imageUrl?: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
