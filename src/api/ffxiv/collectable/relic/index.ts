import {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { z } from 'zod';
import { XivCollectRelic } from '../../../../modules/ffxiv/collect/types';
import { getCollectableRelics } from '../../../../modules/ffxiv/collect/api';

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
          relics: z.object({
            total: z.number().int(),
            results: z.array(XivCollectRelic),
          }),
        }),
      },
    },
    handler: async (_request, _reply) => {
      const relics = await getCollectableRelics();

      return {
        relics,
      };
    },
  });
};

export default route;
