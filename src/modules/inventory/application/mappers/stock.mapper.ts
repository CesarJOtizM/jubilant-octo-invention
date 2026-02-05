import { Stock } from "../../domain/entities/stock.entity";
import type { StockResponseDto } from "../dto/stock.dto";

export class StockMapper {
  static toDomain(dto: StockResponseDto): Stock {
    return Stock.create({
      id: dto.id,
      productId: dto.productId,
      productName: dto.productName,
      productSku: dto.productSku,
      warehouseId: dto.warehouseId,
      warehouseName: dto.warehouseName,
      quantity: dto.quantity,
      reservedQuantity: dto.reservedQuantity,
      availableQuantity: dto.availableQuantity,
      lastMovementAt: dto.lastMovementAt ? new Date(dto.lastMovementAt) : null,
    });
  }

  static toDto(entity: Stock): StockResponseDto {
    return {
      id: entity.id,
      productId: entity.productId,
      productName: entity.productName,
      productSku: entity.productSku,
      warehouseId: entity.warehouseId,
      warehouseName: entity.warehouseName,
      quantity: entity.quantity,
      reservedQuantity: entity.reservedQuantity,
      availableQuantity: entity.availableQuantity,
      lastMovementAt: entity.lastMovementAt?.toISOString() ?? null,
    };
  }
}
