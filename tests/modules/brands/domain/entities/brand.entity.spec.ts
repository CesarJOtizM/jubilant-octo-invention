import { describe, it, expect } from "vitest";
import {
  Brand,
  type BrandProps,
} from "@/modules/brands/domain/entities/brand.entity";

describe("Brand Entity", () => {
  const now = new Date("2026-03-07T10:00:00.000Z");

  const validProps: BrandProps = {
    id: "brand-001",
    name: "Samsung",
    description: "Electronics manufacturer",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  describe("create", () => {
    it("Given: valid props When: creating Then: should create with correct data", () => {
      const entity = Brand.create(validProps);

      expect(entity.id).toBe("brand-001");
      expect(entity.name).toBe("Samsung");
      expect(entity.description).toBe("Electronics manufacturer");
      expect(entity.isActive).toBe(true);
      expect(entity.createdAt).toEqual(now);
      expect(entity.updatedAt).toEqual(now);
    });

    it("Given: null description When: creating Then: should preserve null", () => {
      const entity = Brand.create({ ...validProps, description: null });

      expect(entity.description).toBeNull();
    });

    it("Given: inactive brand When: creating Then: should store false", () => {
      const entity = Brand.create({ ...validProps, isActive: false });

      expect(entity.isActive).toBe(false);
    });
  });

  describe("toJSON", () => {
    it("Given: entity When: calling toJSON Then: should return plain object with id and props", () => {
      const entity = Brand.create(validProps);

      const json = entity.toJSON();

      expect(json).toEqual({
        id: "brand-001",
        name: "Samsung",
        description: "Electronics manufacturer",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    });

    it("Given: entity with null description When: calling toJSON Then: should serialize null", () => {
      const entity = Brand.create({ ...validProps, description: null });

      const json = entity.toJSON();

      expect(json.description).toBeNull();
    });
  });

  describe("Entity identity", () => {
    it("Given: two entities with same id When: comparing ids Then: should be equal", () => {
      const a = Brand.create(validProps);
      const b = Brand.create({ ...validProps, name: "Other name" });

      expect(a.id).toBe(b.id);
    });

    it("Given: two entities with different ids When: comparing Then: should differ", () => {
      const a = Brand.create(validProps);
      const b = Brand.create({ ...validProps, id: "brand-002" });

      expect(a.id).not.toBe(b.id);
    });
  });
});
