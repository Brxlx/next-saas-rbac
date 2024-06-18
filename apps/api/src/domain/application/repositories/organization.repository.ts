import { Select } from '@/core/types/Select';
import { Organization } from '@/domain/enterprise/entities/organization';

export interface OrganizationRepository {
  findById(id: string, { select }: Select<Organization>): Promise<Organization | null>;
  findByDomain(domain: string, { select }: Select<Organization>): Promise<Organization | null>;
  findByDomainAndNotSlug(
    domain: string,
    slug: string,
    { select }: Select<Organization>
  ): Promise<Organization | null>;
  findWhereUserIsIn(userId: string, { select }: Select<Organization>): Promise<Organization[]>;
  createAsAdmin(organization: Organization): Promise<Organization>;
  update(organization: Organization): Promise<Organization | null>;
  delete(userId: string, organizationId: string): Promise<void>;
}
