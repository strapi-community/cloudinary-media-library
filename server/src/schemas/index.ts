import * as z from 'zod';

export const configSchema = z.object({
  cloudName: z.string().optional(),
  apiKey: z.string().optional(),
  encryptionKey: z.string(),
});

export type Config = z.infer<typeof configSchema>;
