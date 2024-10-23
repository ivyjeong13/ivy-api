import {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { z } from 'zod';
import { XivCollectMinion } from '../../../../modules/ffxiv/collect/types';
import { getCollectableMinions } from '../../../../modules/ffxiv/collect/api';

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
        }),
      },
    },
    handler: async (_request, _reply) => {
      const minions = await getCollectableMinions();

      return {
        minions,
      };
    },
  });
};

export default route;
