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
      content: "You are expert in making software requirement document",
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
      content: "You are expert in making software requirement document",
    },
    {
      role: "user",
      content: briefPrompt,
    },
  ]);
  return response.data;
};

export const chatGPTRequestTodoListPrompt = async (briefPrompt: string, answeredBrief: string) => {
  const response = await chatGPTRequest([
    {
      role: "system",
      content: "You are expert in making software requirement document",
    },
    {
      role: "user",
      content: briefPrompt,
    },
    {
      role: "assistant",
      content: answeredBrief,
    },
    {
      role: "user",
      content:
        "Base on the generated document, list todos I need do into list items. Your answer should only consist todo items, start with character '+'",
    },
  ]);
  return response.data;
};

export default chatGPTRequest;
