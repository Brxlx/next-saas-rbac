export enum ProvidersEnum {
  GITHUB = 'GITHUB',
}

export interface AccountProviderParams {
  provider: ProvidersEnum;
  userId: string;
}
