import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const apiRoutes: FastifyPluginAsyncZod = async function (app, _opts) {
  await app.register(import('./ffxiv'), { prefix: '/ffxiv' });
};

export default apiRoutes;
