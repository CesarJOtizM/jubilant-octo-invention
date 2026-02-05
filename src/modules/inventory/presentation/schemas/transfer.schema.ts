import { z } from "zod";
import type { CreateTransferDto } from "../../application/dto/transfer.dto";

export const createTransferSchema = z.object({
  productId: z.string().uuid("Please select a product"),
  fromWarehouseId: z.string().uuid("Please select a source warehouse"),
  toWarehouseId: z.string().uuid("Please select a destination warehouse"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
}).refine((data) => data.fromWarehouseId !== data.toWarehouseId, {
  message: "Source and destination warehouses must be different",
  path: ["toWarehouseId"],
});

// Form data types - use these for react-hook-form
export interface CreateTransferFormData {
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  notes?: string;
}

// Helper to transform form data to DTO
export function toCreateTransferDto(data: CreateTransferFormData): CreateTransferDto {
  return {
    productId: data.productId,
    fromWarehouseId: data.fromWarehouseId,
    toWarehouseId: data.toWarehouseId,
    quantity: data.quantity,
    notes: data.notes || undefined,
  };
}
