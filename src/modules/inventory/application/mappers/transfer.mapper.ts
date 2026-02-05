import { Transfer } from "../../domain/entities/transfer.entity";
import type { TransferResponseDto } from "../dto/transfer.dto";

export class TransferMapper {
  static toDomain(dto: TransferResponseDto): Transfer {
    return Transfer.create({
      id: dto.id,
      productId: dto.productId,
      productName: dto.productName,
      productSku: dto.productSku,
      fromWarehouseId: dto.fromWarehouseId,
      fromWarehouseName: dto.fromWarehouseName,
      toWarehouseId: dto.toWarehouseId,
      toWarehouseName: dto.toWarehouseName,
      quantity: dto.quantity,
      status: dto.status,
      notes: dto.notes,
      createdBy: dto.createdBy,
      createdAt: new Date(dto.createdAt),
      completedAt: dto.completedAt ? new Date(dto.completedAt) : null,
    });
  }

  static toDto(entity: Transfer): TransferResponseDto {
    return {
      id: entity.id,
      productId: entity.productId,
      productName: entity.productName,
      productSku: entity.productSku,
      fromWarehouseId: entity.fromWarehouseId,
      fromWarehouseName: entity.fromWarehouseName,
      toWarehouseId: entity.toWarehouseId,
      toWarehouseName: entity.toWarehouseName,
      quantity: entity.quantity,
      status: entity.status,
      notes: entity.notes,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt.toISOString(),
      completedAt: entity.completedAt?.toISOString() || null,
    };
  }
}
