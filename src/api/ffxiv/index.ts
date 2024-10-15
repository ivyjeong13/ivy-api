import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const ffxivRoutes: FastifyPluginAsyncZod = async function (app, _opts) {
  await app.register(import('./character'), { prefix: '/character' });
};

export default ffxivRoutes;
