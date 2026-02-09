import { Entity } from "@/shared/domain";

export type SaleStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

export interface SaleLineProps {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  salePrice: number;
  currency: string;
  totalPrice: number;
}

export interface SaleProps {
  id: string;
  saleNumber: string;
  status: SaleStatus;
  warehouseId: string;
  warehouseName: string;
  customerReference: string | null;
  externalReference: string | null;
  note: string | null;
  totalAmount: number;
  currency: string;
  lines: SaleLineProps[];
  movementId: string | null;
  createdBy: string;
  createdAt: Date;
  confirmedAt: Date | null;
  cancelledAt: Date | null;
}

export class SaleLine {
  constructor(private readonly props: SaleLineProps) {}

  get id(): string {
    return this.props.id;
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

  get quantity(): number {
    return this.props.quantity;
  }

  get salePrice(): number {
    return this.props.salePrice;
  }

  get currency(): string {
    return this.props.currency;
  }

  get totalPrice(): number {
    return this.props.totalPrice;
  }
}

export class Sale extends Entity<string> {
  private readonly props: Omit<SaleProps, "id">;

  private constructor(id: string, props: Omit<SaleProps, "id">) {
    super(id);
    this.props = props;
  }

  static create(props: SaleProps): Sale {
    return new Sale(props.id, {
      saleNumber: props.saleNumber,
      status: props.status,
      warehouseId: props.warehouseId,
      warehouseName: props.warehouseName,
      customerReference: props.customerReference,
      externalReference: props.externalReference,
      note: props.note,
      totalAmount: props.totalAmount,
      currency: props.currency,
      lines: props.lines,
      movementId: props.movementId,
      createdBy: props.createdBy,
      createdAt: props.createdAt,
      confirmedAt: props.confirmedAt,
      cancelledAt: props.cancelledAt,
    });
  }

  get saleNumber(): string {
    return this.props.saleNumber;
  }

  get status(): SaleStatus {
    return this.props.status;
  }

  get warehouseId(): string {
    return this.props.warehouseId;
  }

  get warehouseName(): string {
    return this.props.warehouseName;
  }

  get customerReference(): string | null {
    return this.props.customerReference;
  }

  get externalReference(): string | null {
    return this.props.externalReference;
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

  get lines(): SaleLineProps[] {
    return this.props.lines;
  }

  get totalItems(): number {
    return this.props.lines.length;
  }

  get totalQuantity(): number {
    return this.props.lines.reduce((sum, line) => sum + line.quantity, 0);
  }

  get movementId(): string | null {
    return this.props.movementId;
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

  get canAddLines(): boolean {
    return this.props.status === "DRAFT";
  }
}
