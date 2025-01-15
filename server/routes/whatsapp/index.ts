
import { factory } from '../../factory.ts'
import { route as sendMessageRoute } from './sendMessage.ts'

export const route = factory
    .createApp()
    .route('/sendMessage', sendMessageRoute)
