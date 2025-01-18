interface Props {
    WA_PHONE_NUMBER_ID: string;
    ACCESS_TOKEN: string;
    order: string;
    url_endpoint: string;
    recipient: string;
}

interface TextMessageResponse {
    messaging_product: string;
    contacts: {
        input: string;
        wa_id: string;
    }[];
    messages: {
        id: string;
        message_status: string;
    }[]
}

export function sendMessage(props: Props) {
    const { WA_PHONE_NUMBER_ID, ACCESS_TOKEN, order, url_endpoint, recipient } = props;

    const url = `https://graph.facebook.com/v21.0/${WA_PHONE_NUMBER_ID}/messages`;
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ACCESS_TOKEN}`
        },
        body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: recipient,
            type: 'template',
            template: {
                name: 'order_confirmation',
                language: {
                    code: 'en'
                },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            {
                                type: 'text',
                                text: order
                            }
                        ]
                    },
                    {
                        type: 'button',
                        sub_type: 'url',
                        index: 0,
                        parameters: [
                            {
                                type: 'text',
                                text: url_endpoint
                            }
                        ]
                    }
                ]
            }
        })
    })
        .then((res) => res.json())
        .then((data) => data as TextMessageResponse)
        .catch((err) => {
            console.error(err)
            throw err
        });
}
