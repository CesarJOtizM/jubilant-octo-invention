/**
 * API Response DTOs for Products
 */

/** Forma real de la respuesta del backend (puede variar del DTO interno) */
export interface ProductApiRawDto {
  id: string;
  sku: string;
  name: string;
  description?: string | null;
  /** Objeto unidad (backend) o no presente si viene unitOfMeasure */
  unit?: { code?: string; name?: string; precision?: number };
  unitOfMeasure?: string;
  barcode?: string;
  brand?: string;
  model?: string;
  status?: string;
  isActive?: boolean;
  costMethod?: string;
  orgId?: string;
  cost?: number;
  price?: number;
  minStock?: number;
  maxStock?: number;
  categoryId?: string | null;
  categoryName?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

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
