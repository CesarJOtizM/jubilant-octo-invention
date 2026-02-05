import { Product } from "../../domain/entities/product.entity";
import type { ProductResponseDto } from "../dto/product.dto";

export class ProductMapper {
  static toDomain(dto: ProductResponseDto): Product {
    return Product.create({
      id: dto.id,
      sku: dto.sku,
      name: dto.name,
      description: dto.description,
      categoryId: dto.categoryId,
      categoryName: dto.categoryName,
      unitOfMeasure: dto.unitOfMeasure,
      cost: dto.cost,
      price: dto.price,
      minStock: dto.minStock,
      maxStock: dto.maxStock,
      isActive: dto.isActive,
      imageUrl: dto.imageUrl,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    });
  }

  static toDto(entity: Product): ProductResponseDto {
    return {
      id: entity.id,
      sku: entity.sku,
      name: entity.name,
      description: entity.description,
      categoryId: entity.categoryId,
      categoryName: entity.categoryName,
      unitOfMeasure: entity.unitOfMeasure,
      cost: entity.cost,
      price: entity.price,
      minStock: entity.minStock,
      maxStock: entity.maxStock,
      isActive: entity.isActive,
      imageUrl: entity.imageUrl,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
