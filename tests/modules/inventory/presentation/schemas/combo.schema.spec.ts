import { describe, it, expect } from "vitest";
import {
  createComboSchema,
  updateComboSchema,
  toCreateComboDto,
  toUpdateComboDto,
  type CreateComboFormData,
  type UpdateComboFormData,
} from "@/modules/inventory/presentation/schemas/combo.schema";

describe("Combo Schemas", () => {
  const validItem = { productId: "prod-1", quantity: 2 };
  const validCreate: CreateComboFormData = {
    sku: "COMBO-001",
    name: "Starter pack",
    description: "A nice combo",
    price: 100,
    currency: "COP",
    items: [validItem],
  };

  describe("createComboSchema", () => {
    it("Given: valid data When: parsing Then: should pass validation", () => {
      const result = createComboSchema.safeParse(validCreate);

      expect(result.success).toBe(true);
    });

    it("Given: sku shorter than 3 chars When: parsing Then: should fail validation", () => {
      const result = createComboSchema.safeParse({ ...validCreate, sku: "AB" });

      expect(result.success).toBe(false);
    });

    it("Given: sku longer than 50 chars When: parsing Then: should fail validation", () => {
      const result = createComboSchema.safeParse({
        ...validCreate,
        sku: "A".repeat(51),
      });

      expect(result.success).toBe(false);
    });

    it("Given: name shorter than 2 chars When: parsing Then: should fail validation", () => {
      const result = createComboSchema.safeParse({ ...validCreate, name: "A" });

      expect(result.success).toBe(false);
    });

    it("Given: name longer than 200 chars When: parsing Then: should fail validation", () => {
      const result = createComboSchema.safeParse({
        ...validCreate,
        name: "N".repeat(201),
      });

      expect(result.success).toBe(false);
    });

    it("Given: description longer than 1000 chars When: parsing Then: should fail validation", () => {
      const result = createComboSchema.safeParse({
        ...validCreate,
        description: "D".repeat(1001),
      });

      expect(result.success).toBe(false);
    });

    it("Given: negative price When: parsing Then: should fail validation", () => {
      const result = createComboSchema.safeParse({
        ...validCreate,
        price: -1,
      });

      expect(result.success).toBe(false);
    });

    it("Given: zero price When: parsing Then: should pass validation", () => {
      const result = createComboSchema.safeParse({ ...validCreate, price: 0 });

      expect(result.success).toBe(true);
    });

    it("Given: price as string with coerce When: parsing Then: should coerce to number", () => {
      const result = createComboSchema.safeParse({
        ...validCreate,
        price: "150" as unknown as number,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.price).toBe(150);
      }
    });

    it("Given: missing currency When: parsing Then: should default to COP", () => {
      const { currency: _currency, ...withoutCurrency } = validCreate;

      const result = createComboSchema.safeParse(withoutCurrency);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currency).toBe("COP");
      }
    });

    it("Given: empty items array When: parsing Then: should fail validation", () => {
      const result = createComboSchema.safeParse({ ...validCreate, items: [] });

      expect(result.success).toBe(false);
    });

    it("Given: item with empty productId When: parsing Then: should fail validation", () => {
      const result = createComboSchema.safeParse({
        ...validCreate,
        items: [{ productId: "", quantity: 1 }],
      });

      expect(result.success).toBe(false);
    });

    it("Given: item with quantity 0 When: parsing Then: should fail validation", () => {
      const result = createComboSchema.safeParse({
        ...validCreate,
        items: [{ productId: "p-1", quantity: 0 }],
      });

      expect(result.success).toBe(false);
    });

    it("Given: item with non-integer quantity When: parsing Then: should fail validation", () => {
      const result = createComboSchema.safeParse({
        ...validCreate,
        items: [{ productId: "p-1", quantity: 1.5 }],
      });

      expect(result.success).toBe(false);
    });

    it("Given: missing description When: parsing Then: should pass validation", () => {
      const { description: _d, ...withoutDescription } = validCreate;

      const result = createComboSchema.safeParse(withoutDescription);

      expect(result.success).toBe(true);
    });
  });

  describe("updateComboSchema", () => {
    it("Given: empty object When: parsing Then: should pass (all fields optional)", () => {
      const result = updateComboSchema.safeParse({});

      expect(result.success).toBe(true);
    });

    it("Given: only name When: parsing Then: should pass", () => {
      const result = updateComboSchema.safeParse({ name: "New name" });

      expect(result.success).toBe(true);
    });

    it("Given: items field When: parsing with at least one item Then: should pass", () => {
      const result = updateComboSchema.safeParse({
        items: [validItem],
      });

      expect(result.success).toBe(true);
    });

    it("Given: items field with empty array When: parsing Then: should fail (min 1 item when provided)", () => {
      const result = updateComboSchema.safeParse({ items: [] });

      expect(result.success).toBe(false);
    });
  });

  describe("toCreateComboDto", () => {
    it("Given: full form data When: converting Then: should map all fields", () => {
      const dto = toCreateComboDto(validCreate);

      expect(dto).toEqual({
        sku: "COMBO-001",
        name: "Starter pack",
        description: "A nice combo",
        price: 100,
        currency: "COP",
        items: [{ productId: "prod-1", quantity: 2 }],
      });
    });

    it("Given: empty description When: converting Then: should map to undefined", () => {
      const dto = toCreateComboDto({ ...validCreate, description: "" });

      expect(dto.description).toBeUndefined();
    });

    it("Given: missing description When: converting Then: should map to undefined", () => {
      const { description: _d, ...rest } = validCreate;

      const dto = toCreateComboDto(rest as CreateComboFormData);

      expect(dto.description).toBeUndefined();
    });

    it("Given: missing currency When: converting Then: should default to COP", () => {
      const { currency: _c, ...rest } = validCreate;

      const dto = toCreateComboDto(rest as CreateComboFormData);

      expect(dto.currency).toBe("COP");
    });

    it("Given: multiple items When: converting Then: should map each item", () => {
      const items = [
        { productId: "p-1", quantity: 1 },
        { productId: "p-2", quantity: 3 },
      ];
      const dto = toCreateComboDto({ ...validCreate, items });

      expect(dto.items).toEqual(items);
    });
  });

  describe("toUpdateComboDto", () => {
    it("Given: empty form data When: converting Then: should return empty DTO", () => {
      const dto = toUpdateComboDto({});

      expect(dto).toEqual({});
    });

    it("Given: only name When: converting Then: should only include name", () => {
      const dto = toUpdateComboDto({ name: "Updated name" });

      expect(dto).toEqual({ name: "Updated name" });
    });

    it("Given: empty description When: converting Then: should map to undefined", () => {
      const dto = toUpdateComboDto({ description: "" });

      expect(dto.description).toBeUndefined();
    });

    it("Given: non-empty description When: converting Then: should keep string", () => {
      const dto = toUpdateComboDto({ description: "hi" });

      expect(dto.description).toBe("hi");
    });

    it("Given: price field When: converting Then: should include price", () => {
      const dto = toUpdateComboDto({ price: 99 });

      expect(dto.price).toBe(99);
    });

    it("Given: currency field When: converting Then: should include currency", () => {
      const dto = toUpdateComboDto({ currency: "USD" });

      expect(dto.currency).toBe("USD");
    });

    it("Given: items field When: converting Then: should map each item", () => {
      const data: UpdateComboFormData = {
        items: [
          { productId: "p-1", quantity: 1 },
          { productId: "p-2", quantity: 2 },
        ],
      };

      const dto = toUpdateComboDto(data);

      expect(dto.items).toEqual([
        { productId: "p-1", quantity: 1 },
        { productId: "p-2", quantity: 2 },
      ]);
    });

    it("Given: all fields When: converting Then: should include all in DTO", () => {
      const data: UpdateComboFormData = {
        name: "Name",
        description: "Desc",
        price: 50,
        currency: "EUR",
        items: [{ productId: "p-1", quantity: 1 }],
      };

      const dto = toUpdateComboDto(data);

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
