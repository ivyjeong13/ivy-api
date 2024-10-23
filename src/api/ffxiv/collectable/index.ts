import {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { z } from 'zod';
import {
  XivCollectMinion,
  XivCollectMount,
} from '../../../modules/ffxiv/collect/types';
import {
  getCollectableMinions,
  getCollectableMounts,
} from '../../../modules/ffxiv/collect/api';

const route: FastifyPluginAsyncZod = async function (app, _opts) {
  /**
   * This endpoint returns collectables that are available in FFXIV.
   */
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: z.object({
          minions: z.object({
            total: z.number().int(),
            results: z.array(XivCollectMinion),
          }),
          mounts: z.object({
            total: z.number().int(),
            results: z.array(XivCollectMount),
          }),
        }),
      },
    },
    handler: async (_request, _reply) => {
      const minions = await getCollectableMinions();
      const mounts = await getCollectableMounts();

      return {
        minions,
        mounts,
      };
    },
  });
};

const collectableRoutes: FastifyPluginAsyncZod = async function (app, _opts) {
  await app.register(route);
  await app.register(import('./minion'), { prefix: '/minion' });
  await app.register(import('./mount'), { prefix: '/mount' });
  await app.register(import('./relic'), { prefix: '/relic' });
};

export default collectableRoutes;
