import { z } from "zod";
import type { CreateStockMovementDto } from "../../application/dto/stock-movement.dto";
import type { MovementType } from "../../domain/entities/stock-movement.entity";

export const createMovementSchema = z.object({
  productId: z.string().uuid("Please select a product"),
  warehouseId: z.string().uuid("Please select a warehouse"),
  type: z.enum(["IN", "OUT", "ADJUSTMENT"] as const, "Please select a movement type"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
  reason: z
    .string()
    .min(1, "Reason is required")
    .max(500, "Reason cannot exceed 500 characters"),
  reference: z
    .string()
    .max(100, "Reference cannot exceed 100 characters")
    .optional(),
});

// Form data types - use these for react-hook-form
export interface CreateMovementFormData {
  productId: string;
  warehouseId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  reference?: string;
}

// Helper to transform form data to DTO
export function toCreateMovementDto(data: CreateMovementFormData): CreateStockMovementDto {
  return {
    productId: data.productId,
    warehouseId: data.warehouseId,
    type: data.type,
    quantity: data.quantity,
    reason: data.reason,
    reference: data.reference || undefined,
  };
}
