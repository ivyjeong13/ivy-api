import {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as ffxiv from '@xivapi/nodestone';
import { XivCharacterSearchResponse } from '../../../../modules/ffxiv/scraper';

const route: FastifyPluginAsyncZod = async function (app, _opts) {
  /**
   * This endpoint returns collectables that are available in FFXIV.
   */
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      querystring: z.object({
        name: z.string(),
        dc: z.string().optional(),
        server: z.string().optional(),
      }),
      response: {
        200: z.object({
          results: z.array(
            z.object({
              avatar_url: z.string(),
              name: z.string(),
              id: z.number(),
              data_center: z.string().nullable(),
              server: z.string().nullable(),
            }),
          ),
        }),
      },
    },
    handler: async (request, _reply) => {
      const { name, dc, server } = request.query;
      const characterSearch = new ffxiv.CharacterSearch();
      const response = (await characterSearch.parse(request as any)) as z.infer<
        typeof XivCharacterSearchResponse
      >;
      const formatted = response.List.map((characterResult) => ({
        avatar_url: characterResult.Avatar,
        name: characterResult.Name,
        id: characterResult.ID,
        data_center: characterResult.DC,
        server: characterResult.World,
      }));
      return {
        results: formatted,
      };
    },
  });
};

export default route;
