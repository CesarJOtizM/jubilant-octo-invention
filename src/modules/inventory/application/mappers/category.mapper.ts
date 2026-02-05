import { Category } from "../../domain/entities/category.entity";
import type { CategoryResponseDto } from "../dto/category.dto";

export class CategoryMapper {
  static toDomain(dto: CategoryResponseDto): Category {
    return Category.create({
      id: dto.id,
      name: dto.name,
      description: dto.description,
      parentId: dto.parentId,
      parentName: dto.parentName,
      isActive: dto.isActive,
      productCount: dto.productCount,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    });
  }

  static toDto(entity: Category): CategoryResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      parentId: entity.parentId,
      parentName: entity.parentName,
      isActive: entity.isActive,
      productCount: entity.productCount,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
