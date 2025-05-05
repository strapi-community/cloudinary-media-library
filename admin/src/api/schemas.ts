import * as z from 'zod';

export const configSchema = z.object({
  cloud_name: z.string().optional(),
  api_key: z.string().optional(),
});

export type Config = z.infer<typeof configSchema>;
