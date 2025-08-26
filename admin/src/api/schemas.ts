import * as z from 'zod';

export const configSchema = z.object({
  cloudName: z.string().nullable().optional(),
  apiKey: z.string().nullable().optional(),
});

export type Config = z.infer<typeof configSchema>;
