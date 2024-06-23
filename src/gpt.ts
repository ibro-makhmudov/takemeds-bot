import { openAI } from "./init.ts";

const REQUEST_LIMIT = 100;
const TIME_FRAME = 60 * 60 * 1000; // Time frame in milliseconds (1 hour)
let requestCount = 0;
let firstRequestTimestamp = Date.now();

export async function generate_gpt_cron(text: string) {
    if (requestCount >= REQUEST_LIMIT && (Date.now() - firstRequestTimestamp) < TIME_FRAME) {
        console.log("Request limit reached. Please wait before making more requests.");
        return;
    }

    if ((Date.now() - firstRequestTimestamp) >= TIME_FRAME) {
        requestCount = 0;
        firstRequestTimestamp = Date.now();
    }

    const content = `send me a text cron that means ${text}. wrap the cron itself in ""`;

    const reply = await openAI.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
            "role": "user",
            "content": content,
        }]
    })

    const reply_text = reply.choices[0].message.content;

    if (!reply_text) {
        console.log("no cron in gpt reply");
        return;
    }
    if(!get_cron(reply_text)) {
        console.log("no cron could be extracted from reply");
        return;
    }

    requestCount++;

    return get_cron(reply_text)?.[1];
}

function get_cron(gpt_reply: string) {
    const re = /"([^"]+)"/g;
    return re.exec(gpt_reply);
}
