import {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as ffxiv from '@xivapi/nodestone';
import {
  CharacterMinions,
  CharacterMounts,
  XivCharacterMinionResponse,
  XivCharacterMountResponse,
  XivCharacterResponse,
} from '../../../modules/ffxiv/scraper';

const CharacterResponseSchema = z.object({
  active_class: z.string(),
  current_title: z.string().nullable(),
  data_center: z.string(),
  free_company: z.string().nullable(),
  gender: z.string(),
  guardian_diety: z.object({
    name: z.string(),
    thumbnail_url: z.string(),
  }),
  level: z.number().int(),
  name: z.string(),
  nameday: z.string(),
  minions: z.array(
    z.object({
      name: z.string(),
      image_url: z.string(),
    }),
  ),
  mounts: z.array(
    z.object({
      name: z.string(),
      image_url: z.string(),
    }),
  ),
  portrait_url: z.string(),
  race: z.string(),
  rank: z.string().nullable(),
  starting_town: z.string(),
  total_minions: z.number().int(),
  total_mounts: z.number().int(),
  tribe: z.string(),
  world: z.string(),
});

const route: FastifyPluginAsyncZod = async function (app, _opts) {
  /**
   * This endpoint is to fetch a FFXIV character with information needed
   * to display what mounts/minions they've successfully collected.
   *
   * @xivapi/nodestone did not have parsers for mount & minions.
   * modules/ffxiv contains the scraper for mount / minion Lodestone pages.
   */
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/:characterId',
    schema: {
      params: z.object({
        characterId: z.coerce.number().int(),
      }),
      response: {
        200: CharacterResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const { characterId } = request.params;
      request.log.info(`Requesting character: ${characterId}.`);

      const characterParser = new ffxiv.Character();
      // Potential TODO: add achievements
      // const achievementParser = new ffxiv.Achievements();
      const characterMountsParser = new CharacterMounts();
      const characterMinionsParser = new CharacterMinions();

      const characterResponse = (await characterParser.parse({
        params: { characterId },
      } as any)) as z.infer<typeof XivCharacterResponse>;

      let ownedMountsResponse:
        | z.infer<typeof XivCharacterMountResponse>
        | undefined;
      try {
        ownedMountsResponse = (await characterMountsParser.parse(
          {
            params: { characterId },
          } as any,
          undefined,
          true,
        )) as z.infer<typeof XivCharacterMountResponse>;
      } catch (error) {
        request.log.error(
          `An error occurred during fetching of mounts.`,
          error,
        );
      }

      let ownedMinionsResponse:
        | z.infer<typeof XivCharacterMinionResponse>
        | undefined;
      try {
        ownedMinionsResponse = (await characterMinionsParser.parse(
          {
            params: { characterId },
          } as any,
          undefined,
          true,
        )) as z.infer<typeof XivCharacterMinionResponse>;
      } catch (error) {
        request.log.error(
          `An error occurred during fetching of minions.`,
          error,
        );
      }

      const mounts = ownedMountsResponse
        ? ownedMountsResponse.Mounts.List.map((mount) => ({
            name: mount.Name,
            image_url: mount.Icon,
          }))
        : [];

      const minions = ownedMinionsResponse
        ? ownedMinionsResponse.Minions.List.map((minion) => ({
            name: minion.Name,
            image_url: minion.Icon,
          }))
        : [];

      const character = {
        active_class: characterResponse.ActiveClassjob,
        avatar_url: characterResponse.Avatar,
        current_title: characterResponse.Title ?? null,
        data_center: characterResponse.DC,
        free_company: characterResponse.FreeCompany
          ? characterResponse.FreeCompany.Name
          : null,
        gender: characterResponse.Gender,
        guardian_diety: {
          name: characterResponse.GuardianDeity.Name,
          thumbnail_url: characterResponse.GuardianDeity.Icon,
        },
        level: characterResponse.Level,
        name: characterResponse.Name,
        nameday: characterResponse.Nameday,
        portrait_url: characterResponse.Portrait,
        race: characterResponse.Race,
        rank: characterResponse.Rank ?? null,
        starting_town: characterResponse.Town.Name,
        total_minions: minions.length,
        total_mounts: mounts.length,
        tribe: characterResponse.Tribe,
        world: characterResponse.World,
      };

      return {
        ...character,
        minions,
        mounts,
      };
    },
  });
};

export default route;
