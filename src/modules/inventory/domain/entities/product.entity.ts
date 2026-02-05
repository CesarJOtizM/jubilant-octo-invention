import { Entity } from "@/shared/domain";

export interface ProductProps {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  categoryId: string | null;
  categoryName: string | null;
  unitOfMeasure: string;
  cost: number;
  price: number;
  minStock: number;
  maxStock: number;
  isActive: boolean;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Product extends Entity<string> {
  private readonly props: Omit<ProductProps, "id">;

  private constructor(id: string, props: Omit<ProductProps, "id">) {
    super(id);
    this.props = props;
  }

  static create(props: ProductProps): Product {
    return new Product(props.id, {
      sku: props.sku,
      name: props.name,
      description: props.description,
      categoryId: props.categoryId,
      categoryName: props.categoryName,
      unitOfMeasure: props.unitOfMeasure,
      cost: props.cost,
      price: props.price,
      minStock: props.minStock,
      maxStock: props.maxStock,
      isActive: props.isActive,
      imageUrl: props.imageUrl,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  get sku(): string {
    return this.props.sku;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | null {
    return this.props.description;
  }

  get categoryId(): string | null {
    return this.props.categoryId;
  }

  get categoryName(): string | null {
    return this.props.categoryName;
  }

  get unitOfMeasure(): string {
    return this.props.unitOfMeasure;
  }

  get cost(): number {
    return this.props.cost;
  }

  get price(): number {
    return this.props.price;
  }

  get minStock(): number {
    return this.props.minStock;
  }

  get maxStock(): number {
    return this.props.maxStock;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get imageUrl(): string | null {
    return this.props.imageUrl;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get margin(): number {
    if (this.props.cost === 0) return 0;
    return ((this.props.price - this.props.cost) / this.props.cost) * 100;
  }

  get profit(): number {
    return this.props.price - this.props.cost;
  }

  isLowStock(currentQuantity: number): boolean {
    return currentQuantity <= this.props.minStock;
  }

  isOverStock(currentQuantity: number): boolean {
    return currentQuantity > this.props.maxStock;
  }
}
