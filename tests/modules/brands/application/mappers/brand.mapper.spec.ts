import { describe, it, expect } from "vitest";
import { BrandMapper } from "@/modules/brands/application/mappers/brand.mapper";
import { Brand } from "@/modules/brands/domain/entities/brand.entity";
import type { BrandResponseDto } from "@/modules/brands/application/dto/brand.dto";

describe("BrandMapper", () => {
  const mockDto: BrandResponseDto = {
    id: "brand-001",
    name: "Samsung",
    description: "Electronics manufacturer",
    isActive: true,
    createdAt: "2026-03-07T10:00:00.000Z",
    updatedAt: "2026-03-07T12:00:00.000Z",
  };

  describe("toDomain", () => {
    it("Given: valid DTO When: mapping Then: should return Brand entity with correct values", () => {
      const brand = BrandMapper.toDomain(mockDto);

      expect(brand.id).toBe("brand-001");
      expect(brand.name).toBe("Samsung");
      expect(brand.description).toBe("Electronics manufacturer");
      expect(brand.isActive).toBe(true);
    });

    it("Given: date strings When: mapping Then: should convert to Date objects", () => {
      const brand = BrandMapper.toDomain(mockDto);

      expect(brand.createdAt).toBeInstanceOf(Date);
      expect(brand.updatedAt).toBeInstanceOf(Date);
      expect(brand.createdAt.toISOString()).toBe("2026-03-07T10:00:00.000Z");
      expect(brand.updatedAt.toISOString()).toBe("2026-03-07T12:00:00.000Z");
    });

    it("Given: null description When: mapping Then: should preserve null", () => {
      const dto: BrandResponseDto = { ...mockDto, description: null };

      const brand = BrandMapper.toDomain(dto);

      expect(brand.description).toBeNull();
    });

    it("Given: non-string description (undefined) When: mapping Then: should default to null", () => {
      const dto = { ...mockDto } as BrandResponseDto;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (dto as any).description;

      const brand = BrandMapper.toDomain(dto);

      expect(brand.description).toBeNull();
    });

    it("Given: string description When: mapping Then: should keep the string", () => {
      const dto: BrandResponseDto = { ...mockDto, description: "Test desc" };

      const brand = BrandMapper.toDomain(dto);

      expect(brand.description).toBe("Test desc");
    });

    it("Given: inactive brand DTO When: mapping Then: should preserve isActive false", () => {
      const dto: BrandResponseDto = { ...mockDto, isActive: false };

      const brand = BrandMapper.toDomain(dto);

      expect(brand.isActive).toBe(false);
    });
  });

  describe("toDto", () => {
    it("Given: Brand entity When: mapping to DTO Then: should return correct DTO", () => {
      const entity = Brand.create({
        id: "brand-001",
        name: "Samsung",
        description: "Electronics manufacturer",
        isActive: true,
        createdAt: new Date("2026-03-07T10:00:00.000Z"),
        updatedAt: new Date("2026-03-07T12:00:00.000Z"),
      });

      const dto = BrandMapper.toDto(entity);

      expect(dto.id).toBe("brand-001");
      expect(dto.name).toBe("Samsung");
      expect(dto.description).toBe("Electronics manufacturer");
      expect(dto.isActive).toBe(true);
      expect(dto.createdAt).toBe("2026-03-07T10:00:00.000Z");
      expect(dto.updatedAt).toBe("2026-03-07T12:00:00.000Z");
    });

    it("Given: entity with null description When: mapping to DTO Then: should preserve null", () => {
      const entity = Brand.create({
        id: "brand-002",
        name: "NoDesc Brand",
        description: null,
        isActive: false,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      });

      const dto = BrandMapper.toDto(entity);

      expect(dto.description).toBeNull();
      expect(dto.isActive).toBe(false);
    });
  });

  describe("roundtrip", () => {
    it("Given: DTO → Domain → DTO When: full roundtrip Then: should be equivalent", () => {
      const domain = BrandMapper.toDomain(mockDto);
      const dto = BrandMapper.toDto(domain);

      expect(dto).toEqual(mockDto);
    });
  });
});
