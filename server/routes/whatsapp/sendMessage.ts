import { factory } from "server/factory.ts";
import { zValidator } from '@hono/zod-validator';
import { sendMessage } from "./utils.ts";
import { z } from 'zod'

export const route = factory.createApp().post(
    '/',
    zValidator(
        'json',
        z.object({
            message: z.string(),
            recipient: z.string(),
            preview_url: z.string().optional()
        })
    ),
    async (c) => {
        const { WA_PHONE_NUMBER_ID, CLOUD_API_ACCESS_TOKEN } = c.var
        const { message, recipient, preview_url } = c.req.valid('json')
        const response = await sendMessage({
            WA_PHONE_NUMBER_ID,
            RECIPIENT_PHONE_NUMBER: recipient,
            ACCESS_TOKEN: CLOUD_API_ACCESS_TOKEN,
            body: message,
            preview_url
        })
    }
)
