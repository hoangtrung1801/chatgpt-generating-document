import { CHATGPT_API } from "@/config";
import axios from "axios";
import openai from "./openai";
import { ChatCompletionRequestMessage } from "openai";
import { PrismaClient } from "@prisma/client";

const chatGPTUrl = "https://api.openai.com/v1/chat/completions";
const chatgptKeys = new PrismaClient().chatGPTKey;

export const chatGPTRequest = async (messages: ChatCompletionRequestMessage[]) => {
  const chatgptKey = await chatgptKeys.findFirst({ where: { isRunning: false } });
  if (!chatgptKey) {
    throw new Error("No chatgpt key available");
  }

  await chatgptKeys.update({
    where: { id: chatgptKey.id },
    data: { isRunning: true },
  });

  let response;
  try {
    response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0301",
      messages: [...messages],
      temperature: 0.2,
      // max_tokens: 2048,
    });
  } catch (error) {
    console.log({ response });
  }

  await chatgptKeys.update({
    where: { id: chatgptKey.id },
    data: { isRunning: true },
  });

  return response;
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
