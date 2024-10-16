import { z } from 'zod';

export const XivSource = z.object({
  type: z.string(),
  text: z.string(),
  related_type: z.string().nullable(),
  related_id: z.number().int().nullable(),
});

export const XivCollectMount = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  enhanced_description: z.string(),
  tooltip: z.string(),
  movement: z.string(),
  seats: z.number().int(),
  patch: z.string(),
  image: z.string(),
  icon: z.string(),
  sources: z.array(XivSource),
});

export const XivCollectMinion = z.object({
  id: z.number().int(),
  name: z.string(),
  behavior: z.object({
    id: z.number().int(),
    name: z.string(),
  }),
  description: z.string(),
  enhanced_description: z.string(),
  patch: z.string(),
  image: z.string(),
  icon: z.string(),
  sources: z.array(XivSource),
});

export type XivCollectMountType = z.infer<typeof XivCollectMount>;
export type XivCollectMinionType = z.infer<typeof XivCollectMinion>;
