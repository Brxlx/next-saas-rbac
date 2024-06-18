import { Entity } from '@/core/entities/entity';
import { EntityId } from '@/core/entities/entity-id';
import { MembershipRoleEnum } from '@/core/repositories/membership-roles';
import { Optional } from '@/core/types/Optional';

import { Slug } from './value-objects/slug';

interface OrganizationProps {
  name: string;
  slug: Slug;
  domain?: string | null;
  shouldAttachUsersByDomain?: boolean | null;
  ownerId: EntityId;
  avatarUrl?: string | null;
  role?: MembershipRoleEnum;
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

  get role() {
    return this.props.role;
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
        role: props.role ?? undefined,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  static createWithoutRole(
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
