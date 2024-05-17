import fastify from 'fastify';

import { AuthRoutes } from './auth/auth.routes';

const router = fastify().register(AuthRoutes);
