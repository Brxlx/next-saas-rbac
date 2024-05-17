import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { createAccount } from './routes/auth/create-account';

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

app.register(fastifyCors);

app.register(createAccount);

app.listen({ host: '0.0.0.0', port: 3333 }).then((address) => {
  console.log(`App running on ${address}`);
});
