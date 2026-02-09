import { z } from "zod";
import type { CreateTransferDto, CreateTransferLineDto } from "../../application/dto/transfer.dto";

export const transferLineSchema = z.object({
  productId: z.string().uuid("Please select a product"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
});

export const createTransferSchema = z.object({
  fromWarehouseId: z.string().uuid("Please select a source warehouse"),
  toWarehouseId: z.string().uuid("Please select a destination warehouse"),
  lines: z
    .array(transferLineSchema)
    .min(1, "At least one product is required"),
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
}).refine((data) => data.fromWarehouseId !== data.toWarehouseId, {
  message: "Source and destination warehouses must be different",
  path: ["toWarehouseId"],
});

// Form data types - use these for react-hook-form
export interface TransferLineFormData {
  productId: string;
  quantity: number;
}

export interface CreateTransferFormData {
  fromWarehouseId: string;
  toWarehouseId: string;
  lines: TransferLineFormData[];
  notes?: string;
}

// Helper to transform form data to DTO
export function toCreateTransferDto(data: CreateTransferFormData): CreateTransferDto {
  return {
    fromWarehouseId: data.fromWarehouseId,
    toWarehouseId: data.toWarehouseId,
    lines: data.lines.map((line): CreateTransferLineDto => ({
      productId: line.productId,
      quantity: line.quantity,
    })),
    notes: data.notes || undefined,
  };
}
