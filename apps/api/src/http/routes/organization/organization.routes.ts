import { FastifyInstance } from 'fastify';

import { CreateOrganizationController } from './create-organization.controller';

export async function OrganizationRoutes(app: FastifyInstance) {
  app.register(CreateOrganizationController);
}
