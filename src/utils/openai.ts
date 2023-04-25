import { CHATGPT_API } from "@/config";
import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: `${CHATGPT_API}`,
  // accessToken: "Bearer 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",
});

const openai = new OpenAIApi(config);

// const completion = await openai.createChatCompletion({
//     model: 'gpt-3.5-turbo-0301',
// })

export default openai;
