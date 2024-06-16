import { Entity } from '@/core/entities/entity';
import { EntityId } from '@/core/entities/entity-id';
import { Optional } from '@/core/types/Optional';

interface MemberProps {
  role: string;
  organizationId: EntityId;
  userId: EntityId;
  projectId?: EntityId | null;
}
export class Member extends Entity<MemberProps> {
  get role() {
    return this.props.role;
  }

  get organizationId() {
    return this.props.organizationId;
  }

  get userId() {
    return this.props.userId;
  }

  get projectId() {
    return this.props.projectId;
  }

  static create(props: Optional<MemberProps, 'projectId'>, id?: EntityId) {
    return new Member(
      {
        ...props,
        projectId: props.projectId ?? null,
      },
      id
    );
  }
}
