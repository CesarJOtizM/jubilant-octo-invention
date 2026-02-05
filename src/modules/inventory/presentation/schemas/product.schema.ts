import { z } from "zod";
import type { CreateProductDto, UpdateProductDto } from "../../application/dto/product.dto";

export const createProductSchema = z.object({
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(50, "SKU cannot exceed 50 characters")
    .regex(
      /^[A-Za-z0-9-_]+$/,
      "SKU can only contain letters, numbers, hyphens and underscores"
    ),
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name cannot exceed 200 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  categoryId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal("")),
  unitOfMeasure: z.string().min(1, "Unit of measure is required"),
  cost: z.number().min(0, "Cost cannot be negative"),
  price: z.number().min(0, "Price cannot be negative"),
  minStock: z.number().int().min(0, "Minimum stock cannot be negative"),
  maxStock: z.number().int().min(0, "Maximum stock cannot be negative"),
  imageUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal("")),
});

export const updateProductSchema = createProductSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// Form data types - use these for react-hook-form
export interface CreateProductFormData {
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

export interface UpdateProductFormData extends Partial<CreateProductFormData> {
  isActive?: boolean;
}

// Helper to transform form data to DTO
export function toCreateProductDto(data: CreateProductFormData): CreateProductDto {
  return {
    sku: data.sku,
    name: data.name,
    description: data.description || undefined,
    categoryId: data.categoryId || undefined,
    unitOfMeasure: data.unitOfMeasure,
    cost: data.cost,
    price: data.price,
    minStock: data.minStock,
    maxStock: data.maxStock,
    imageUrl: data.imageUrl || undefined,
  };
}

export function toUpdateProductDto(data: UpdateProductFormData): UpdateProductDto {
  const dto: UpdateProductDto = {};

  if (data.sku !== undefined) dto.sku = data.sku;
  if (data.name !== undefined) dto.name = data.name;
  if (data.description !== undefined) dto.description = data.description || undefined;
  if (data.categoryId !== undefined) dto.categoryId = data.categoryId || undefined;
  if (data.unitOfMeasure !== undefined) dto.unitOfMeasure = data.unitOfMeasure;
  if (data.cost !== undefined) dto.cost = data.cost;
  if (data.price !== undefined) dto.price = data.price;
  if (data.minStock !== undefined) dto.minStock = data.minStock;
  if (data.maxStock !== undefined) dto.maxStock = data.maxStock;
  if (data.isActive !== undefined) dto.isActive = data.isActive;
  if (data.imageUrl !== undefined) dto.imageUrl = data.imageUrl || undefined;

  return dto;
}

// Validation that maxStock >= minStock
export const validateStockRange = (data: CreateProductFormData) => {
  if (data.maxStock < data.minStock) {
    return {
      success: false,
      error: "Maximum stock must be greater than or equal to minimum stock",
    };
  }
  return { success: true };
};
