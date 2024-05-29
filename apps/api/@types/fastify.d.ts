import 'fastify';

import { MembershipRole } from '@/core/repositories/membership-roles';

interface GetUserMembershipResponse {
  organization: {
    id: string;
    name: string;
    slug: string;
    domain: string | null;
    shouldAttachUsersByDomain: boolean;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    ownerId: string;
  };
  membership: {
    id: string;
    role: MembershipRole;
    organizationId: string;
    userId: string;
    projectId: string | null;
  };
}

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>;
    getUserMembership(slug: string): Promise<GetUserMembershipResponse>;
  }
}
