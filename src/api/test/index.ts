import { FastifyPluginAsyncZod, ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const test: FastifyPluginAsyncZod = async function (app, _opts) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: z.object({
          success: z.boolean(),
        }),
      },
    },
    handler: (request, response) => {
      request.log.info('hello world.');
      return { success: true };
    },
  });
};

export default test;