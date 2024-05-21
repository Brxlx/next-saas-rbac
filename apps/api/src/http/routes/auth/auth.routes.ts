import type { FastifyInstance } from 'fastify';

import { AuthenticateWithPasswordController } from './authenticate-with-password.controller';
import { CreateAccountController } from './create-account.controller';
import { GetProfileController } from './get-profile.controller';
import { RequestPasswordRecoverController } from './request-password-recover.controller';
import { ResetPasswordController } from './reset-password.controller';

export async function AuthRoutes(app: FastifyInstance) {
  app.register(CreateAccountController);
  app.register(AuthenticateWithPasswordController);
  app.register(GetProfileController);
  app.register(RequestPasswordRecoverController);
  app.register(ResetPasswordController);
}
