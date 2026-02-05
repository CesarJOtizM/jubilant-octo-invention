import { ValueObject } from "@/shared/domain";

interface ProductIdProps {
  value: string;
}

export class ProductId extends ValueObject<ProductIdProps> {
  private constructor(props: ProductIdProps) {
    super(props);
  }

  static create(id: string): ProductId {
    if (!id || id.trim().length === 0) {
      throw new Error("Product ID cannot be empty");
    }
    return new ProductId({ value: id });
  }

  get value(): string {
    return this.props.value;
  }
}
