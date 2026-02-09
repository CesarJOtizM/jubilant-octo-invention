import { Entity } from "@/shared/domain";

export type ReturnStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";
export type ReturnType = "RETURN_CUSTOMER" | "RETURN_SUPPLIER";

export interface ReturnLineProps {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  originalSalePrice: number | null;
  originalUnitCost: number | null;
  currency: string;
  totalPrice: number;
}

export interface ReturnProps {
  id: string;
  returnNumber: string;
  status: ReturnStatus;
  type: ReturnType;
  reason: string | null;
  warehouseId: string;
  warehouseName: string;
  saleId: string | null;
  saleNumber: string | null;
  sourceMovementId: string | null;
  returnMovementId: string | null;
  note: string | null;
  totalAmount: number;
  currency: string;
  lines: ReturnLineProps[];
  createdBy: string;
  createdAt: Date;
  confirmedAt: Date | null;
  cancelledAt: Date | null;
}

export class Return extends Entity<string> {
  private readonly props: Omit<ReturnProps, "id">;

  private constructor(id: string, props: Omit<ReturnProps, "id">) {
    super(id);
    this.props = props;
  }

  static create(props: ReturnProps): Return {
    return new Return(props.id, {
      returnNumber: props.returnNumber,
      status: props.status,
      type: props.type,
      reason: props.reason,
      warehouseId: props.warehouseId,
      warehouseName: props.warehouseName,
      saleId: props.saleId,
      saleNumber: props.saleNumber,
      sourceMovementId: props.sourceMovementId,
      returnMovementId: props.returnMovementId,
      note: props.note,
      totalAmount: props.totalAmount,
      currency: props.currency,
      lines: props.lines,
      createdBy: props.createdBy,
      createdAt: props.createdAt,
      confirmedAt: props.confirmedAt,
      cancelledAt: props.cancelledAt,
    });
  }

  get returnNumber(): string {
    return this.props.returnNumber;
  }

  get status(): ReturnStatus {
    return this.props.status;
  }

  get type(): ReturnType {
    return this.props.type;
  }

  get reason(): string | null {
    return this.props.reason;
  }

  get warehouseId(): string {
    return this.props.warehouseId;
  }

  get warehouseName(): string {
    return this.props.warehouseName;
  }

  get saleId(): string | null {
    return this.props.saleId;
  }

  get saleNumber(): string | null {
    return this.props.saleNumber;
  }

  get sourceMovementId(): string | null {
    return this.props.sourceMovementId;
  }

  get returnMovementId(): string | null {
    return this.props.returnMovementId;
  }

  get note(): string | null {
    return this.props.note;
  }

  get totalAmount(): number {
    return this.props.totalAmount;
  }

  get currency(): string {
    return this.props.currency;
  }

  get lines(): ReturnLineProps[] {
    return this.props.lines;
  }

  get totalItems(): number {
    return this.props.lines.length;
  }

  get totalQuantity(): number {
    return this.props.lines.reduce((sum, line) => sum + line.quantity, 0);
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get confirmedAt(): Date | null {
    return this.props.confirmedAt;
  }

  get cancelledAt(): Date | null {
    return this.props.cancelledAt;
  }

  // Type helpers
  get isCustomerReturn(): boolean {
    return this.props.type === "RETURN_CUSTOMER";
  }

  get isSupplierReturn(): boolean {
    return this.props.type === "RETURN_SUPPLIER";
  }

  // Status helpers
  get isDraft(): boolean {
    return this.props.status === "DRAFT";
  }

  get isConfirmed(): boolean {
    return this.props.status === "CONFIRMED";
  }

  get isCancelled(): boolean {
    return this.props.status === "CANCELLED";
  }

  get canConfirm(): boolean {
    return this.props.status === "DRAFT" && this.props.lines.length > 0;
  }

  get canCancel(): boolean {
    return this.props.status !== "CANCELLED";
  }

  get canEdit(): boolean {
    return this.props.status === "DRAFT";
  }
}
