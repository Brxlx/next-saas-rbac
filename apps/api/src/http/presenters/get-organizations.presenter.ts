import { Presenter } from '@/core/presenters/presenter';
import { ApiError } from '@/domain/application/useCases/errors/apiError';
import { Organization } from '@/domain/enterprise/entities/organization';

export class GetOrganizationsPresenter implements Presenter<Organization> {
  showError(error: ApiError): ApiError {
    throw new ApiError(error.message, error.statusCode);
  }

  static toHTTP(organizations: Organization[]) {
    return organizations.map((org) => {
      return {
        id: org.id.toString(),
        name: org.name,
        slug: org.slug,
        avatarUrl: org.avatarUrl ?? null,
        role: org.role,
      };
    });
  }
}
