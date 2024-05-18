import { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';

import { ApiError } from '@/domain/application/useCases/errors/apiError';

import { BadRequestError } from './routes/_errors/bad-request-error';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (err, req, reply) => {
  if (err instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation Error',
      statusCode: err.statusCode || 400,
      errors: err.flatten().fieldErrors,
    });
  }

  if (err instanceof BadRequestError) {
    return reply.status(400).send({
      message: err.message,
      statusCode: err.statusCode || 400,
    });
  }

  if (err instanceof ApiError) {
    return reply.status(err.statusCode).send({
      message: err.message,
      statusCode: err.statusCode || 500,
    });
  }

  console.log(err);

  // send error to observability platform

  return reply.status(err.statusCode || 500).send({
    message: err.message,
    statusCode: err.statusCode || 500,
  });
};
