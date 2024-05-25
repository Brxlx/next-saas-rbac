import { FastifyInstance } from 'fastify';

import { AuthRoutes } from './auth/auth.routes';
import { OrganizationRoutes } from './organization/organization.routes';

export const appRoutes = async (app: FastifyInstance) => {
  app.register(AuthRoutes);
  app.register(OrganizationRoutes);
};
