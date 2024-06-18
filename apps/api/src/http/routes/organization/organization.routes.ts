import { FastifyInstance } from 'fastify';

import { CreateOrganizationController } from './create-organization.controller';
import { GetMembershipController } from './get-membership.controller';
import { GetOrganizationController } from './get-organization.controller';
import { GetOrganizationsController } from './get-organizations.controller';
import { UpdateOrganizationController } from './update-organization.controller';

export async function OrganizationRoutes(app: FastifyInstance) {
  app.register(CreateOrganizationController);
  app.register(GetMembershipController);
  app.register(GetOrganizationController);
  app.register(GetOrganizationsController);
  app.register(UpdateOrganizationController);
}
