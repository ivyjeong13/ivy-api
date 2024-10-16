import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const ffxivRoutes: FastifyPluginAsyncZod = async function (app, _opts) {
  await app.register(import('./character'), { prefix: '/character' });
  await app.register(import('./collectable'), { prefix: '/collectable' });
};

export default ffxivRoutes;
