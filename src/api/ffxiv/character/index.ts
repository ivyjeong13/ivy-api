import {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as ffxiv from '@xivapi/nodestone';
import { CharacterMounts } from '../../../modules/ffxiv/character-mounts';
import { CharacterMinions } from '../../../modules/ffxiv/character-minions';

const route: FastifyPluginAsyncZod = async function (app, _opts) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/:characterId',
    schema: {
      params: z.object({
        characterId: z.coerce.number().int(),
      }),
      // response: {
      //   200: z.object({
      //     success: z.boolean(),
      //   }),
      // },
    },
    handler: async (request, reply) => {
      const { characterId } = request.params;
      request.log.info(`Requesting character: ${characterId}.`);

      const characterParser = new ffxiv.Character();
      // Potential TODO: add achievements
      // const achievementParser = new ffxiv.Achievements();
      const characterMountsParser = new CharacterMounts();
      const characterMinionsParser = new CharacterMinions();

      const character = await characterParser.parse({
        params: { characterId },
      } as any);
      const characterMounts = await characterMountsParser.parse(
        {
          params: { characterId },
        } as any,
        undefined,
        true,
      );
      const characterMinions = await characterMinionsParser.parse(
        {
          params: { characterId },
        } as any,
        undefined,
        true,
      );

      return reply.send({
        ...character,
        Mounts: characterMounts,
        Minions: characterMinions,
      });
    },
  });
};

export default route;
