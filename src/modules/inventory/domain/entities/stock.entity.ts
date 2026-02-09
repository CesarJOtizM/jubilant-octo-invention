import { Entity } from "@/shared/domain";

export interface StockProps {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  averageCost: number;
  totalValue: number;
  currency: string;
  lastMovementAt: Date | null;
}

export class Stock extends Entity<string> {
  private readonly props: Omit<StockProps, "id">;

  private constructor(id: string, props: Omit<StockProps, "id">) {
    super(id);
    this.props = props;
  }

  static create(props: StockProps): Stock {
    return new Stock(props.id, {
      productId: props.productId,
      productName: props.productName,
      productSku: props.productSku,
      warehouseId: props.warehouseId,
      warehouseName: props.warehouseName,
      quantity: props.quantity,
      reservedQuantity: props.reservedQuantity,
      availableQuantity: props.availableQuantity,
      averageCost: props.averageCost,
      totalValue: props.totalValue,
      currency: props.currency,
      lastMovementAt: props.lastMovementAt,
    });
  }

  get productId(): string {
    return this.props.productId;
  }

  get productName(): string {
    return this.props.productName;
  }

  get productSku(): string {
    return this.props.productSku;
  }

  get warehouseId(): string {
    return this.props.warehouseId;
  }

  get warehouseName(): string {
    return this.props.warehouseName;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get reservedQuantity(): number {
    return this.props.reservedQuantity;
  }

  get availableQuantity(): number {
    return this.props.availableQuantity;
  }

  get averageCost(): number {
    return this.props.averageCost;
  }

  get totalValue(): number {
    return this.props.totalValue;
  }

  get currency(): string {
    return this.props.currency;
  }

  get lastMovementAt(): Date | null {
    return this.props.lastMovementAt;
  }

  get hasReservedStock(): boolean {
    return this.props.reservedQuantity > 0;
  }

  get isOutOfStock(): boolean {
    return this.props.availableQuantity === 0;
  }
}
