import { ValueObject } from "@/shared/domain";

interface WarehouseIdProps {
  value: string;
}

export class WarehouseId extends ValueObject<WarehouseIdProps> {
  private constructor(props: WarehouseIdProps) {
    super(props);
  }

  static create(id: string): WarehouseId {
    if (!id || id.trim().length === 0) {
      throw new Error("Warehouse ID cannot be empty");
    }
    return new WarehouseId({ value: id });
  }

  get value(): string {
    return this.props.value;
  }
}
