import fastifyCors from '@fastify/cors';
import fastifyJWT from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { authenticateWithPassword } from './routes/auth/authenticate-with-password';
import { createAccountController } from './routes/auth/create-account.controller';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'ACL SAAS',
      description: 'ACL Account Management with multi tenant and RBAC.',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
});

app.register(fastifyJWT, {
  secret: 'my-jwt-secret',
});

app.register(fastifyCors);

app.register(createAccountController);
app.register(authenticateWithPassword);

app.listen({ host: '0.0.0.0', port: 3333 }).then((address) => {
  console.log(`App running on ${address}`);
});
