import { Entity } from '@/core/entities/entity';
import { EntityId } from '@/core/entities/entity-id';
import { Optional } from '@/core/types/Optional';

interface OrganizationProps {
  name: string;
  slug: string;
  domain?: string | null;
  shouldAttachUsersByDomain?: boolean;
  ownerId: EntityId;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}
export class Organization extends Entity<OrganizationProps> {
  get name() {
    return this.props.name;
  }

  get slug() {
    return this.props.slug;
  }

  get domain() {
    return this.props.domain;
  }

  get ownerId() {
    return this.props.ownerId;
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

  get shouldAttachUsersByDomain() {
    return this.props.shouldAttachUsersByDomain;
  }

  static create(
    props: Optional<OrganizationProps, 'shouldAttachUsersByDomain' | 'createdAt'>,
    id?: EntityId
  ) {
    return new Organization(
      {
        ...props,
        shouldAttachUsersByDomain: props.shouldAttachUsersByDomain ?? false,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
