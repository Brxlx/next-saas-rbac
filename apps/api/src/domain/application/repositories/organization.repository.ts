import { Select } from '@/core/types/select';
import { Organization } from '@/domain/enterprise/entities/organization';

export interface OrganizationRepository {
  findById(id: string, { select }: Select<Organization>): Promise<Organization | null>;
  findByDomain(domain: string, { select }: Select<Organization>): Promise<Organization | null>;
  createAsAdmin(organization: Organization): Promise<Organization>;
}
