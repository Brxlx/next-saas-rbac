import { Entity } from '@/core/entities/entity';
import { EntityId } from '@/core/entities/entity-id';
import { Optional } from '@/core/types/Optional';

interface UserProps {
  name?: string | null;
  email: string;
  passwordHash?: string | null;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}
export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  get avatarUrl() {
    return this.props.avatarUrl;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<UserProps, 'createdAt'>, id?: EntityId) {
    return new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
