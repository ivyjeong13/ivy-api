import Fastify from 'fastify';
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

const fastify = Fastify({
  logger: true
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.code(400).send({
      error: 'Response Validation Error',
            message: "Request doesn't match the schema",
            statusCode: 400,
            details: {
                issues: error.validation,
                method: request.method,
                url: request.url,
            },
    });
  }

  if (isResponseSerializationError(error)) {
    return reply.code(500).send({
        error: 'Internal Server Error',
        message: "Response doesn't match the schema",
        statusCode: 500,
        details: {
            issues: error.cause.issues,
            method: error.method,
            url: error.url,
        },
    })
}
});

fastify.register(import('./api'), { prefix: '/api' });

fastify.get('/', (_request, reply) => {
  return reply.send('OK');
});

fastify.listen({ port: Number(process.env.PORT ?? 3000), host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.info(`Fastify is listening on port: ${address}`);
});