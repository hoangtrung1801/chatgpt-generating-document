import { HttpException } from "@/exceptions/HttpException";
import { chatGPTRequestBriefPrompt, chatGPTRequestTodoListPrompt, chatGPTRequestUserFlow } from "@/utils/chatgpt-request";
import convertMermaidToReactFlow from "@/utils/convert-mermaid-to-reactflow";
import { generateBriefPrompt } from "@/utils/generate-chatgpt-prompt";
import generateUserFlowPrompt from "@/utils/generate-user-flow-prompt";
import { PrismaClient } from "@prisma/client";
import { isEmpty } from "class-validator";

class ChatGPTService {
  public chatgptBrief = new PrismaClient().chatGPTBriefAnswer;
  public selections = new PrismaClient().selection;

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

  public async generateBrief(selectionId: number) {
    const findSelectionData = await this.selections.findUnique({
      where: { id: selectionId },
      include: {
        selectedOptions: {
          include: {
            option: {
              include: {
                question: true,
              },
            },
          },
        },
        app: true,
      },
    });
    if (!findSelectionData) throw new HttpException(400, "SelectionId does not exist");

    // get questions
    const selectedQuestions = {};

    const selectedOptionsData = findSelectionData.selectedOptions;
    const optionsData = selectedOptionsData.map(obj => obj.option);

    optionsData.forEach(option => {
      if (!selectedQuestions[option.question.name]) {
        selectedQuestions[option.question.name] = [option.name];
      } else {
        selectedQuestions[option.question.name] = [...selectedQuestions[option.question.name], option.name];
      }
    });

    // get app name
    const appData = findSelectionData.app;
    const appName = appData.name;

    const briefPrompt = generateBriefPrompt({
      softwareName: findSelectionData.projectName,
      description: findSelectionData.description,
      features: Object.keys(selectedQuestions),
    });

    const chatGPTResponse = await chatGPTRequestBriefPrompt(briefPrompt);
    const answer = chatGPTResponse.choices[0].message.content;

    console.log("chatGPTResponse", answer);

    const chatgptBriefData = await this.chatgptBrief.create({
      data: {
        answer,
        selectionId,
        prompt: briefPrompt,
      },
    });
    return chatgptBriefData;
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

  public generateUserFlow = async (selectionId: number) => {
    // check selection exists
    const findSelection = await this.selections.findUnique({
      where: {
        id: selectionId,
      },
      include: {
        chatGPTBriefAnswer: true,
      },
    });
    if (!findSelection) throw new HttpException(404, "Selection not found");

    if (!findSelection.chatGPTBriefAnswer) throw new HttpException(404, "Please generate a brief first");

    const response = await chatGPTRequestUserFlow(
      findSelection.chatGPTBriefAnswer.prompt,
      findSelection.chatGPTBriefAnswer.answer,
      generateUserFlowPrompt(),
    );
    const data = response.choices[0].message.content;

    const convertedData = convertMermaidToReactFlow(data);

    await this.selections.update({
      where: {
        id: selectionId,
      },
      data: {
        userFlow: convertedData,
      },
    });

    return convertedData;
  };
}

export default ChatGPTService;
