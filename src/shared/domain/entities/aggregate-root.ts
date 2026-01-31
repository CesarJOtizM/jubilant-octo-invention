import { Entity } from "./entity";

export abstract class AggregateRoot<T> extends Entity<T> {
  constructor(id: T) {
    super(id);
  }
}
