import { FastifyInstance } from 'fastify';

import { CreateOrganizationController } from './create-organization.controller';
import { GetMembershipController } from './get-membership.controller';
import { GetOrganizationController } from './get-organization.controller';
import { GetOrganizationsController } from './get-organizations.controller';
import { ShutdownOrganizationController } from './shutdown-organization.controller';
import { TransferOrganizationController } from './transfer-organization.controller';
import { UpdateOrganizationController } from './update-organization.controller';

export async function OrganizationRoutes(app: FastifyInstance) {
  app.register(CreateOrganizationController);
  app.register(GetMembershipController);
  app.register(GetOrganizationController);
  app.register(GetOrganizationsController);
  app.register(UpdateOrganizationController);
  app.register(ShutdownOrganizationController);
  app.register(TransferOrganizationController);
}
