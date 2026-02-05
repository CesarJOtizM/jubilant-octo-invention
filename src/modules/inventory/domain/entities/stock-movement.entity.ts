import { Entity } from "@/shared/domain";

export type MovementType = "IN" | "OUT" | "ADJUSTMENT";

export interface StockMovementProps {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  warehouseId: string;
  warehouseName: string;
  type: MovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  reference: string | null;
  createdBy: string;
  createdAt: Date;
}

export class StockMovement extends Entity<string> {
  private readonly props: Omit<StockMovementProps, "id">;

  private constructor(id: string, props: Omit<StockMovementProps, "id">) {
    super(id);
    this.props = props;
  }

  static create(props: StockMovementProps): StockMovement {
    return new StockMovement(props.id, {
      productId: props.productId,
      productName: props.productName,
      productSku: props.productSku,
      warehouseId: props.warehouseId,
      warehouseName: props.warehouseName,
      type: props.type,
      quantity: props.quantity,
      previousQuantity: props.previousQuantity,
      newQuantity: props.newQuantity,
      reason: props.reason,
      reference: props.reference,
      createdBy: props.createdBy,
      createdAt: props.createdAt,
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

  get type(): MovementType {
    return this.props.type;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get previousQuantity(): number {
    return this.props.previousQuantity;
  }

  get newQuantity(): number {
    return this.props.newQuantity;
  }

  get reason(): string {
    return this.props.reason;
  }

  get reference(): string | null {
    return this.props.reference;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get isEntry(): boolean {
    return this.props.type === "IN";
  }

  get isExit(): boolean {
    return this.props.type === "OUT";
  }

  get isAdjustment(): boolean {
    return this.props.type === "ADJUSTMENT";
  }

  get quantityDifference(): number {
    return this.props.newQuantity - this.props.previousQuantity;
  }
}
