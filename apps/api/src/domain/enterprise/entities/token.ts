import { Entity } from '@/core/entities/entity';
import { EntityId } from '@/core/entities/entity-id';
import { Optional } from '@/core/types/Optional';

interface TokenProps {
  type: 'PASSWORD_RECOVER';
  userId: string;
  createdAt: Date;
}
export class Token extends Entity<TokenProps> {
  get type() {
    return this.props.type;
  }

  get userId() {
    return this.props.userId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Optional<TokenProps, 'createdAt'>, id?: EntityId) {
    return new Token(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
