import { z } from 'zod'

export const appEnvVariablesSchema = z.object({
    VITE_SUPABASE_URL: z.string(),
    VITE_SUPABASE_ANON_KEY: z.string(),
    CLOUD_API_ACCESS_TOKEN: z.string(),
    WA_PHONE_NUMBER_ID: z.string(),
    CLOUD_API_VERSION: z.string(),
})

export type AppEnvVariables = z.infer<typeof appEnvVariablesSchema>;
