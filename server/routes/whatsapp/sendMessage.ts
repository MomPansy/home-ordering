import { factory } from "server/factory.ts";
import { zValidator } from '@hono/zod-validator';
import { sendMessage } from "./utils.ts";
import { z } from 'zod'

export const route = factory.createApp().post(
    '/',
    zValidator(
        'json',
        z.object({
            order: z.string(),
            url_endpoint: z.string()
        })
    ),
    async (c) => {
        const { WA_PHONE_NUMBER_ID, WA_ACCESS_TOKEN, NANDA_PHONE_NUMBER } = c.var
        const { order, url_endpoint } = c.req.valid('json')

        try {
            const response = await sendMessage({
                WA_PHONE_NUMBER_ID,
                ACCESS_TOKEN: WA_ACCESS_TOKEN,
                order: order,
                url_endpoint: url_endpoint,
                recipient: NANDA_PHONE_NUMBER
            });

            return c.json(response);
        } catch (error) {
            console.error("Error sending message:", error);

            return c.json(
                { error: "Failed to send message" },
                500
            );
        }
    }
)
