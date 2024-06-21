import { Member } from '@/domain/enterprise/entities/member';

export interface MemberRepository {
  findByOrganizationIdUserId(
    organizationId: string,
    transferToUserId: string
  ): Promise<Member | null>;
  updateOwnership(organizationId: string, userId: string, transferToUserId: string): Promise<void>;
}
