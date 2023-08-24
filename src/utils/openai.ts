import { CHATGPT_API } from "@/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: CHATGPT_API,
});

// const completion = await openai.createChatCompletion({
//     model: 'gpt-3.5-turbo-0301',
// })

export default openai;
