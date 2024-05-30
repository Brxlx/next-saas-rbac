import { Presenter } from '@/core/presenters/presenter';
import { ApiError } from '@/domain/application/useCases/errors/apiError';
import { Organization } from '@/domain/enterprise/entities/organization';

export class OrganizationPresenter implements Presenter<Organization> {
  showError(error: ApiError): ApiError {
    throw new ApiError(error.message, error.statusCode);
  }

  static toHTTP(organization: Organization) {
    return {
      id: organization.id.toString(),
    };
  }
}
