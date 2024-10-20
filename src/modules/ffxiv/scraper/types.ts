import { z } from 'zod';

export const XivCharacterSearchResponse = z.object({
  List: z.array(
    z.object({
      Avatar: z.string(),
      ID: z.number().int(),
      Lang: z.string(),
      Name: z.string(),
      RankName: z.string(),
      RankIcon: z.string(),
      World: z.string(),
      DC: z.string(),
    }),
  ),
});

export const XivCharacterResponse = z.object({
  ActiveClassjob: z.string(),
  Level: z.number().int(),
  Avatar: z.string(),
  Bio: z.string(),
  ClassjobIcons: z.array(
    z.object({
      Icon: z.string(),
    }),
  ),
  FreeCompany: z
    .object({
      ID: z.string(),
      Name: z.string(),
    })
    .optional(),
  Name: z.string(),
  Rank: z.string().optional(),
  GuardianDeity: z.object({
    Name: z.string(),
    Icon: z.string(),
  }),
  Nameday: z.string(),
  Portrait: z.string(),
  PvpTeam: z.string().optional(),
  Race: z.string(),
  Tribe: z.string(),
  Gender: z.string(),
  World: z.string(),
  DC: z.string(),
  Title: z.string().optional(),
  Town: z.object({
    Name: z.string(),
    Icon: z.string(),
  }),
});

export const XivCharacterMount = z.object({
  Name: z.string(),
  Icon: z.string(),
});

export const XivCharacterMountResponse = z.object({
  Mounts: z.object({
    List: z.array(XivCharacterMount),
  }),
});

export const XivCharacterMinion = z.object({
  Name: z.string(),
  Icon: z.string(),
});

export const XivCharacterMinionResponse = z.object({
  Minions: z.object({
    List: z.array(XivCharacterMinion),
  }),
});
