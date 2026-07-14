import { Stock } from "@/modules/inventory/domain/entities/stock.entity";
import type {
  StockResponseDto,
  StockApiRawDto,
} from "@/modules/inventory/application/dto/stock.dto";

function resolveCompanyId(dto: StockApiRawDto | StockResponseDto): string {
  return ("companyId" in dto ? dto.companyId : undefined) ?? "";
}

function resolveCompositeId(
  dto: StockApiRawDto | StockResponseDto,
  index?: number,
): string {
  const companyId = resolveCompanyId(dto);
  return `${dto.productId}:${dto.warehouseId}:${companyId}:${index ?? 0}`;
}

export class StockMapper {
  static toDomain(
    dto: StockApiRawDto | StockResponseDto,
    index?: number,
  ): Stock {
    const quantity = dto.quantity ?? 0;
    const reservedQuantity = dto.reservedQuantity ?? 0;
    const companyId = resolveCompanyId(dto);

    return Stock.create({
      id: dto.id ?? resolveCompositeId(dto, index),
      productId: dto.productId,
      productName: dto.productName ?? "",
      productSku: dto.productSku ?? "",
      productBarcode: dto.productBarcode,
      warehouseId: dto.warehouseId,
      warehouseName: dto.warehouseName ?? "",
      companyId,
      quantity,
      reservedQuantity,
      availableQuantity: dto.availableQuantity ?? quantity - reservedQuantity,
      averageCost: ("averageCost" in dto ? dto.averageCost : undefined) ?? 0,
      totalValue: ("totalValue" in dto ? dto.totalValue : undefined) ?? 0,
      currency: ("currency" in dto ? dto.currency : undefined) ?? "USD",
      lastMovementAt:
        typeof dto.lastMovementAt === "string"
          ? new Date(dto.lastMovementAt)
          : null,
    });
  }

  static toDto(entity: Stock): StockResponseDto {
    return {
      id: entity.id,
      productId: entity.productId,
      productName: entity.productName,
      productSku: entity.productSku,
      productBarcode: entity.productBarcode,
      warehouseId: entity.warehouseId,
      warehouseName: entity.warehouseName,
      companyId: entity.companyId,
      quantity: entity.quantity,
      reservedQuantity: entity.reservedQuantity,
      availableQuantity: entity.availableQuantity,
      lastMovementAt: entity.lastMovementAt?.toISOString() ?? null,
    };
  }
}
