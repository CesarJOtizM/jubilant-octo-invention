import { Entity } from "@/shared/domain";

export type TransferStatus = "PENDING" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED";

export interface TransferProps {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  quantity: number;
  status: TransferStatus;
  notes: string | null;
  createdBy: string;
  createdAt: Date;
  completedAt: Date | null;
}

export class Transfer extends Entity<string> {
  private readonly props: Omit<TransferProps, "id">;

  private constructor(id: string, props: Omit<TransferProps, "id">) {
    super(id);
    this.props = props;
  }

  static create(props: TransferProps): Transfer {
    return new Transfer(props.id, {
      productId: props.productId,
      productName: props.productName,
      productSku: props.productSku,
      fromWarehouseId: props.fromWarehouseId,
      fromWarehouseName: props.fromWarehouseName,
      toWarehouseId: props.toWarehouseId,
      toWarehouseName: props.toWarehouseName,
      quantity: props.quantity,
      status: props.status,
      notes: props.notes,
      createdBy: props.createdBy,
      createdAt: props.createdAt,
      completedAt: props.completedAt,
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

  get fromWarehouseId(): string {
    return this.props.fromWarehouseId;
  }

  get fromWarehouseName(): string {
    return this.props.fromWarehouseName;
  }

  get toWarehouseId(): string {
    return this.props.toWarehouseId;
  }

  get toWarehouseName(): string {
    return this.props.toWarehouseName;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get status(): TransferStatus {
    return this.props.status;
  }

  get notes(): string | null {
    return this.props.notes;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get completedAt(): Date | null {
    return this.props.completedAt;
  }

  get isPending(): boolean {
    return this.props.status === "PENDING";
  }

  get isInTransit(): boolean {
    return this.props.status === "IN_TRANSIT";
  }

  get isCompleted(): boolean {
    return this.props.status === "COMPLETED";
  }

  get isCancelled(): boolean {
    return this.props.status === "CANCELLED";
  }

  get canStartTransit(): boolean {
    return this.props.status === "PENDING";
  }

  get canComplete(): boolean {
    return this.props.status === "IN_TRANSIT";
  }

  get canCancel(): boolean {
    return this.props.status === "PENDING" || this.props.status === "IN_TRANSIT";
  }
}
