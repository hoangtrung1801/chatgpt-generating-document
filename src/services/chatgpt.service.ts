import { chatGPTRequestTodoListPrompt } from "@/utils/chatgpt-request";
import { PrismaClient } from "@prisma/client";
import { isEmpty } from "class-validator";

class ChatGPTService {
  public chatgptBrief = new PrismaClient().chatGPTBriefAnswer;

  public async test() {
    return {};
  }

  public async getBriefsOfUser(userId: number) {
    const findBriefs = await this.chatgptBrief.findMany({
      where: {
        selection: {
          userId,
        },
      },
    });
    return findBriefs;
  }

  public async getBriefById(briefId: number) {
    const findBrief = await this.chatgptBrief.findUnique({
      where: {
        id: briefId,
      },
    });
    return findBrief;
  }

  public async generateUserStoryList(briefId: number): Promise<string[]> {
    const findBrief = await this.chatgptBrief.findUnique({
      where: {
        id: briefId,
      },
    });
    const briefPrompt = findBrief.prompt;
    const answeredBrief = findBrief.answer;

    const response = await chatGPTRequestTodoListPrompt(briefPrompt, answeredBrief);
    const responseContent: string = response.choices[0].message.content;

    const todos = responseContent
      .split("+")
      .map((e: string) => e.replace("\n", "").trim())
      .filter(e => !isEmpty(e));
    return todos;
  }
}

export default ChatGPTService;
