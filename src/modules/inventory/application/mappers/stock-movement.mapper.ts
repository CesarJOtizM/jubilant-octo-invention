import { StockMovement } from "../../domain/entities/stock-movement.entity";
import type { StockMovementResponseDto } from "../dto/stock-movement.dto";

export class StockMovementMapper {
  static toDomain(dto: StockMovementResponseDto): StockMovement {
    return StockMovement.create({
      id: dto.id,
      productId: dto.productId,
      productName: dto.productName,
      productSku: dto.productSku,
      warehouseId: dto.warehouseId,
      warehouseName: dto.warehouseName,
      type: dto.type,
      quantity: dto.quantity,
      previousQuantity: dto.previousQuantity,
      newQuantity: dto.newQuantity,
      reason: dto.reason,
      reference: dto.reference,
      createdBy: dto.createdBy,
      createdAt: new Date(dto.createdAt),
    });
  }

  static toDto(entity: StockMovement): StockMovementResponseDto {
    return {
      id: entity.id,
      productId: entity.productId,
      productName: entity.productName,
      productSku: entity.productSku,
      warehouseId: entity.warehouseId,
      warehouseName: entity.warehouseName,
      type: entity.type,
      quantity: entity.quantity,
      previousQuantity: entity.previousQuantity,
      newQuantity: entity.newQuantity,
      reason: entity.reason,
      reference: entity.reference,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
