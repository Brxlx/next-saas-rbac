import { randomUUID } from 'node:crypto';

export class EntityId {
  private value: string;

  toString() {
    return this.value;
  }

  toValue() {
    return this.value;
  }

  private generateId(): string {
    return randomUUID();
  }

  constructor(value?: string) {
    this.value = value ?? this.generateId();
  }

  public equals(id: EntityId): boolean {
    return id.toValue() === this.value;
  }
}
