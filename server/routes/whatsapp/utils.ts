interface Props {
    WA_PHONE_NUMBER_ID: string;
    RECIPIENT_PHONE_NUMBER: string;
    ACCESS_TOKEN: string;
    body: string;
    preview_url?: string;
}

interface TextMessageResponse {
    messaging_product: string;
    contacts: {
        input: string;
        wa_id: string;
    }[];
    messages: {
        id: string;
    }[]
}

export function sendMessage(props: Props) {
    const { WA_PHONE_NUMBER_ID, RECIPIENT_PHONE_NUMBER, ACCESS_TOKEN, body, preview_url } = props;
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
            to: RECIPIENT_PHONE_NUMBER,
            type: 'text',
            text: {
                preview_url: preview_url ? true : false,
                body: body
            }
        })
    })
        .then((res) => res.json())
        .then((data) => data as TextMessageResponse)
        .catch((err) => console.error(err));
}
