import { FastifyInstance } from 'fastify';

import { CreateOrganizationController } from './create-organization.controller';
import { GetMembershipController } from './get-membership.controller';

export async function OrganizationRoutes(app: FastifyInstance) {
  app.register(CreateOrganizationController);
  app.register(GetMembershipController);
}
