import { describe, it, expect } from "vitest";
import { ComboMapper } from "@/modules/inventory/application/mappers/combo.mapper";
import { Combo } from "@/modules/inventory/domain/entities/combo.entity";
import type { ComboResponseDto } from "@/modules/inventory/application/dto/combo.dto";

describe("ComboMapper", () => {
  const mockDto: ComboResponseDto = {
    id: "combo-001",
    sku: "COMBO-001",
    name: "Starter pack",
    description: "Nice combo",
    price: 100,
    currency: "COP",
    isActive: true,
    orgId: "org-1",
    items: [
      {
        id: "item-1",
        productId: "prod-1",
        productName: "Product A",
        productSku: "SKU-A",
        quantity: 2,
      },
    ],
    createdAt: "2026-03-07T10:00:00.000Z",
    updatedAt: "2026-03-07T12:00:00.000Z",
  };

  describe("toDomain", () => {
    it("Given: valid DTO When: mapping Then: should return Combo entity with correct values", () => {
      const combo = ComboMapper.toDomain(mockDto);

      expect(combo.id).toBe("combo-001");
      expect(combo.sku).toBe("COMBO-001");
      expect(combo.name).toBe("Starter pack");
      expect(combo.description).toBe("Nice combo");
      expect(combo.price).toBe(100);
      expect(combo.currency).toBe("COP");
      expect(combo.isActive).toBe(true);
      expect(combo.orgId).toBe("org-1");
      expect(combo.items).toHaveLength(1);
    });

    it("Given: null description When: mapping Then: should keep null", () => {
      const combo = ComboMapper.toDomain({ ...mockDto, description: null });

      expect(combo.description).toBeNull();
    });

    it("Given: missing description When: mapping Then: should default to null", () => {
      const { description: _d, ...dtoNoDesc } = mockDto;

      const combo = ComboMapper.toDomain(dtoNoDesc as ComboResponseDto);

      expect(combo.description).toBeNull();
    });

    it("Given: missing price When: mapping Then: should default to 0", () => {
      const dto = { ...mockDto, price: undefined as unknown as number };

      const combo = ComboMapper.toDomain(dto);

      expect(combo.price).toBe(0);
    });

    it("Given: missing currency When: mapping Then: should default to USD", () => {
      const dto = { ...mockDto, currency: undefined as unknown as string };

      const combo = ComboMapper.toDomain(dto);

      expect(combo.currency).toBe("USD");
    });

    it("Given: missing isActive When: mapping Then: should default to true", () => {
      const dto = { ...mockDto, isActive: undefined as unknown as boolean };

      const combo = ComboMapper.toDomain(dto);

      expect(combo.isActive).toBe(true);
    });

    it("Given: missing orgId When: mapping Then: should default to empty string", () => {
      const dto = { ...mockDto, orgId: undefined as unknown as string };

      const combo = ComboMapper.toDomain(dto);

      expect(combo.orgId).toBe("");
    });

    it("Given: missing items When: mapping Then: should default to empty array", () => {
      const dto = {
        ...mockDto,
        items: undefined as unknown as ComboResponseDto["items"],
      };

      const combo = ComboMapper.toDomain(dto);

      expect(combo.items).toEqual([]);
    });

    it("Given: item without productName/productSku When: mapping Then: should default to empty strings", () => {
      const dto: ComboResponseDto = {
        ...mockDto,
        items: [
          {
            id: "item-1",
            productId: "prod-1",
            productName: undefined as unknown as string,
            productSku: undefined as unknown as string,
            quantity: 1,
          },
        ],
      };

      const combo = ComboMapper.toDomain(dto);

      expect(combo.items[0].productName).toBe("");
      expect(combo.items[0].productSku).toBe("");
    });
  });

  describe("toDto", () => {
    it("Given: Combo entity When: mapping to DTO Then: should return the correct DTO", () => {
      const entity = Combo.create({
        id: "combo-001",
        sku: "COMBO-001",
        name: "Starter pack",
        description: "Nice combo",
        price: 100,
        currency: "COP",
        isActive: true,
        orgId: "org-1",
        items: [
          {
            id: "item-1",
            productId: "prod-1",
            productName: "Product A",
            productSku: "SKU-A",
            quantity: 2,
          },
        ],
        createdAt: "2026-03-07T10:00:00.000Z",
        updatedAt: "2026-03-07T12:00:00.000Z",
      });

      const dto = ComboMapper.toDto(entity);

      expect(dto).toEqual(mockDto);
    });
  });

  describe("toCreateDto", () => {
    it("Given: form data with all fields When: converting Then: should map all fields", () => {
      const dto = ComboMapper.toCreateDto({
        sku: "COMBO-001",
        name: "Name",
        description: "Desc",
        price: 50,
        currency: "EUR",
        items: [{ productId: "p-1", quantity: 2 }],
      });

      expect(dto).toEqual({
        sku: "COMBO-001",
        name: "Name",
        description: "Desc",
        price: 50,
        currency: "EUR",
        items: [{ productId: "p-1", quantity: 2 }],
      });
    });

    it("Given: empty description When: converting Then: should map to undefined", () => {
      const dto = ComboMapper.toCreateDto({
        sku: "COMBO-001",
        name: "Name",
        description: "",
        price: 50,
        currency: "COP",
        items: [{ productId: "p-1", quantity: 1 }],
      });

      expect(dto.description).toBeUndefined();
    });

    it("Given: empty currency When: converting Then: should map to undefined", () => {
      const dto = ComboMapper.toCreateDto({
        sku: "COMBO-001",
        name: "Name",
        price: 50,
        currency: "",
        items: [{ productId: "p-1", quantity: 1 }],
      });

      expect(dto.currency).toBeUndefined();
    });

    it("Given: no description/currency When: converting Then: should default to undefined", () => {
      const dto = ComboMapper.toCreateDto({
        sku: "COMBO-001",
        name: "Name",
        price: 50,
        items: [{ productId: "p-1", quantity: 1 }],
      });

      expect(dto.description).toBeUndefined();
      expect(dto.currency).toBeUndefined();
    });
  });

  describe("toUpdateDto", () => {
    it("Given: empty form data When: converting Then: should return empty DTO", () => {
      const dto = ComboMapper.toUpdateDto({});

      expect(dto).toEqual({});
    });

    it("Given: only name When: converting Then: should include only name", () => {
      const dto = ComboMapper.toUpdateDto({ name: "Updated" });

      expect(dto).toEqual({ name: "Updated" });
    });

    it("Given: empty description When: converting Then: should map to undefined", () => {
      const dto = ComboMapper.toUpdateDto({ description: "" });

      expect(dto.description).toBeUndefined();
    });

    it("Given: non-empty description When: converting Then: should keep string", () => {
      const dto = ComboMapper.toUpdateDto({ description: "hello" });

      expect(dto.description).toBe("hello");
    });

    it("Given: empty currency When: converting Then: should map to undefined", () => {
      const dto = ComboMapper.toUpdateDto({ currency: "" });

      expect(dto.currency).toBeUndefined();
    });

    it("Given: non-empty currency When: converting Then: should keep string", () => {
      const dto = ComboMapper.toUpdateDto({ currency: "USD" });

      expect(dto.currency).toBe("USD");
    });

    it("Given: price field When: converting Then: should include price", () => {
      const dto = ComboMapper.toUpdateDto({ price: 99 });

      expect(dto.price).toBe(99);
    });

    it("Given: items field When: converting Then: should include items", () => {
      const items = [{ productId: "p-1", quantity: 1 }];
      const dto = ComboMapper.toUpdateDto({ items });

      expect(dto.items).toEqual(items);
    });

    it("Given: all fields When: converting Then: should include all in DTO", () => {
      const dto = ComboMapper.toUpdateDto({
        name: "Name",
        description: "Desc",
        price: 50,
        currency: "EUR",
        items: [{ productId: "p-1", quantity: 1 }],
      });

      expect(dto).toEqual({
        name: "Name",
        description: "Desc",
        price: 50,
        currency: "EUR",
        items: [{ productId: "p-1", quantity: 1 }],
      });
    });
  });
});
