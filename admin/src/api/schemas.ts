import * as z from 'zod';

export const configSchema = z.object({
  cloud_name: z.string(),
  api_key: z.string(),
});

export type Config = z.infer<typeof configSchema>;