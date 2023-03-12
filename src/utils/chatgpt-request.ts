import { CHATGPT_API } from "@/config";
import axios from "axios";
const chatGPTUrl = "https://api.openai.com/v1/chat/completions";

export const chatGPTRequest = async (messages: { role: string; content: string }[] = []) => {
  try {
    const response = await axios.post(
      chatGPTUrl,
      {
        model: "gpt-3.5-turbo",
        messages,
      },
      {
        headers: {
          Authorization: CHATGPT_API,
          "Content-Type": "application/json",
        },
      },
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const chatGPTRequestBriefPrompt = async (briefPrompt: string) => {
  const response = await chatGPTRequest([
    {
      role: "system",
      content: "You are a document generator",
    },
    {
      role: "user",
      content: briefPrompt,
    },
  ]);
  return response.data;
};

export const chatGPTRequestQuestionPrompt = async (briefPrompt: string) => {
  const response = await chatGPTRequest([
    {
      role: "system",
      content: "You are a document generator",
    },
    {
      role: "user",
      content: briefPrompt,
    },
  ]);
  return response.data;
};

export default chatGPTRequest;
