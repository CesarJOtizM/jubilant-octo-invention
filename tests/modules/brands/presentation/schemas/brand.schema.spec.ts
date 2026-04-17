import { describe, it, expect } from "vitest";
import {
  createBrandSchema,
  updateBrandSchema,
} from "@/modules/brands/presentation/schemas/brand.schema";

describe("Brand Schemas", () => {
  describe("createBrandSchema", () => {
    it("Given: valid data with name only When: parsing Then: should pass validation", () => {
      const data = { name: "Samsung" };

      const result = createBrandSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("Given: name + description When: parsing Then: should pass validation", () => {
      const data = { name: "Samsung", description: "Electronics" };

      const result = createBrandSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBe("Electronics");
      }
    });

    it("Given: empty name When: parsing Then: should fail with required error", () => {
      const data = { name: "" };

      const result = createBrandSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("required");
      }
    });

    it("Given: missing name When: parsing Then: should fail validation", () => {
      const result = createBrandSchema.safeParse({});

      expect(result.success).toBe(false);
    });

    it("Given: name exceeding 200 chars When: parsing Then: should fail validation", () => {
      const data = { name: "A".repeat(201) };

      const result = createBrandSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("Given: name at exactly 200 chars When: parsing Then: should pass validation", () => {
      const data = { name: "A".repeat(200) };

      const result = createBrandSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("Given: description exceeding 500 chars When: parsing Then: should fail validation", () => {
      const data = { name: "Brand", description: "D".repeat(501) };

      const result = createBrandSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("Given: description at exactly 500 chars When: parsing Then: should pass validation", () => {
      const data = { name: "Brand", description: "D".repeat(500) };

      const result = createBrandSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("Given: no description When: parsing Then: should pass with undefined", () => {
      const result = createBrandSchema.safeParse({ name: "Brand" });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBeUndefined();
      }
    });
  });

  describe("updateBrandSchema", () => {
    it("Given: partial data with only name When: parsing Then: should pass", () => {
      const result = updateBrandSchema.safeParse({ name: "Updated" });

      expect(result.success).toBe(true);
    });

    it("Given: empty object When: parsing Then: should pass (all fields optional)", () => {
      const result = updateBrandSchema.safeParse({});

      expect(result.success).toBe(true);
    });

    it("Given: only description When: parsing Then: should pass", () => {
      const result = updateBrandSchema.safeParse({ description: "desc" });

      expect(result.success).toBe(true);
    });

    it("Given: name exceeding max length When: parsing Then: should fail", () => {
      const result = updateBrandSchema.safeParse({ name: "A".repeat(201) });

      expect(result.success).toBe(false);
    });
  });
});
