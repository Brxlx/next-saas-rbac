import { FastifyInstance } from 'fastify';

import { AuthRoutes } from './auth/auth.routes';

export const appRoutes = async (app: FastifyInstance) => {
  app.register(AuthRoutes);
};
