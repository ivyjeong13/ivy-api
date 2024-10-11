import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const api: FastifyPluginAsyncZod = async function (app, _opts) {
  await app.register(import('./test'), { prefix: '/test' });
};

export default api;