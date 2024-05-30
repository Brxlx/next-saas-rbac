import { Presenter } from '@/core/presenters/presenter';
import { ApiError } from '@/domain/application/useCases/errors/apiError';
import { User } from '@/domain/enterprise/entities/user';

export class UserPresenter implements Presenter<User> {
  showError(error: ApiError): ApiError {
    throw new ApiError(error.message, error.statusCode);
  }

  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      name: user.name ?? null,
      email: user.email,
      avatarUrl: user.avatarUrl ?? null,
    };
  }
}
