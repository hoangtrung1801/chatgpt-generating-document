import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import openai from "./openai";

export const chatGPTRequest = async (messages: ChatCompletionRequestMessage[]) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0301",
      messages: [...messages],
      temperature: 0.2,
      // max_tokens: 2048,
    });

    return response;
  } catch (error) {
    return error;
  }
};

export const chatGPTRequestWithKey = async (key: string, messages: ChatCompletionRequestMessage[]) => {
  try {
    const config = new Configuration({
      apiKey: key,
    });

    const openai = new OpenAIApi(config);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0301",
      messages: [...messages],
      temperature: 1,
      // max_tokens: 2048,
    });

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

export const chatGPTRequestUserFlow = async (briefPrompt: string, briefAnswered: string, userFlowPrompt: string) => {
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
      content: briefAnswered,
    },
    {
      role: "user",
      content: userFlowPrompt,
    },
  ]);
  return response.data;
};

export default chatGPTRequest;
