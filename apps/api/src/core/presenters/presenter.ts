import { ApiError } from '@/domain/application/useCases/errors/apiError';

export interface Presenter<ResponseModel> {
  // toHTTP(response: ResponseModel): Partial<ResponseModel>;
  // showSuccess(response: ResponseModel): void;
  showError(error: ApiError): void;
}
