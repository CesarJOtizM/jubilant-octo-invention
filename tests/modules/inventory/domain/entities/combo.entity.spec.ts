import { describe, it, expect } from "vitest";
import {
  Combo,
  type ComboProps,
  type ComboItemProps,
} from "@/modules/inventory/domain/entities/combo.entity";

describe("Combo Entity", () => {
  const items: ComboItemProps[] = [
    {
      id: "item-1",
      productId: "prod-1",
      productName: "Product A",
      productSku: "SKU-A",
      quantity: 2,
    },
    {
      id: "item-2",
      productId: "prod-2",
      productName: "Product B",
      productSku: "SKU-B",
      quantity: 1,
    },
  ];

  const validProps: ComboProps = {
    id: "combo-001",
    sku: "COMBO-001",
    name: "Starter pack",
    description: "Nice combo",
    price: 100,
    currency: "COP",
    isActive: true,
    orgId: "org-1",
    items,
    createdAt: "2026-03-07T10:00:00.000Z",
    updatedAt: "2026-03-07T12:00:00.000Z",
  };

  describe("create", () => {
    it("Given: valid props When: creating Then: should create with correct data", () => {
      const entity = Combo.create(validProps);

      expect(entity.id).toBe("combo-001");
      expect(entity.sku).toBe("COMBO-001");
      expect(entity.name).toBe("Starter pack");
      expect(entity.description).toBe("Nice combo");
      expect(entity.price).toBe(100);
      expect(entity.currency).toBe("COP");
      expect(entity.isActive).toBe(true);
      expect(entity.orgId).toBe("org-1");
      expect(entity.items).toHaveLength(2);
      expect(entity.createdAt).toBe("2026-03-07T10:00:00.000Z");
      expect(entity.updatedAt).toBe("2026-03-07T12:00:00.000Z");
    });

    it("Given: null description When: creating Then: should preserve null", () => {
      const entity = Combo.create({ ...validProps, description: null });

      expect(entity.description).toBeNull();
    });

    it("Given: inactive combo When: creating Then: should store false", () => {
      const entity = Combo.create({ ...validProps, isActive: false });

      expect(entity.isActive).toBe(false);
    });

    it("Given: empty items array When: creating Then: should store empty array", () => {
      const entity = Combo.create({ ...validProps, items: [] });

      expect(entity.items).toEqual([]);
    });

    it("Given: zero price When: creating Then: should store zero", () => {
      const entity = Combo.create({ ...validProps, price: 0 });

      expect(entity.price).toBe(0);
    });
  });

  describe("items getter", () => {
    it("Given: combo with items When: getting items Then: should return same items", () => {
      const entity = Combo.create(validProps);

      expect(entity.items[0].productName).toBe("Product A");
      expect(entity.items[1].productSku).toBe("SKU-B");
      expect(entity.items[0].quantity).toBe(2);
    });
  });

  describe("toJSON", () => {
    it("Given: entity When: calling toJSON Then: should return plain object with id and props", () => {
      const entity = Combo.create(validProps);

      const json = entity.toJSON();

      expect(json).toEqual({
        id: "combo-001",
        sku: "COMBO-001",
        name: "Starter pack",
        description: "Nice combo",
        price: 100,
        currency: "COP",
        isActive: true,
        orgId: "org-1",
        items,
        createdAt: "2026-03-07T10:00:00.000Z",
        updatedAt: "2026-03-07T12:00:00.000Z",
      });
    });
  });
});
