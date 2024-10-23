import {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { z } from 'zod';
import { XivCollectMount } from '../../../../modules/ffxiv/collect/types';
import { getCollectableMounts } from '../../../../modules/ffxiv/collect/api';

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
          mounts: z.object({
            total: z.number().int(),
            results: z.array(XivCollectMount),
          }),
        }),
      },
    },
    handler: async (_request, _reply) => {
      const mounts = await getCollectableMounts();

      return {
        mounts,
      };
    },
  });
};

export default route;
