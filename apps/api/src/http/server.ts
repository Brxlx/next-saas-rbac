import fastifyCors from '@fastify/cors';
import fastifyJWT from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { env } from '@saas/env';
import { fastify } from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { errorHandler } from './error-handler';
import { appRoutes } from './routes';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'ACL SAAS',
      description: 'ACL Account Management with multi tenant and RBAC.',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerToken: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Authenticate with jwt token',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
});

app.register(fastifyJWT, {
  secret: env.JWT_SECRET,
});

app.register(fastifyCors);

/**
 * App routes
 */
app.register(appRoutes);

app.listen({ host: '0.0.0.0', port: env.SERVER_PORT }).then((address) => {
  console.log(`App running on ${address}`);
});
