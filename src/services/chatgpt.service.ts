import { HttpException } from "@/exceptions/HttpException";
import chatGPTRequest, { chatGPTRequestBriefPrompt, chatGPTRequestTodoListPrompt, chatGPTRequestWithKey } from "@/utils/chatgpt-request";
import convertMarkdownToHTML from "@/utils/convertMarkdownToHTML";
import { createOutline, createOutlinePrompt } from "@/utils/create-generating-document-prompts";
import { generateBriefPrompt } from "@/utils/generate-chatgpt-prompt";
import generateUserFlowPrompt from "@/utils/generate-user-flow-prompt";
import { PrismaClient } from "@prisma/client";
import { isEmpty } from "class-validator";
import { OpenAI } from "openai";
import { Stream } from "openai/streaming";

class ChatGPTService {
  public chatgptBrief = new PrismaClient().chatGPTBriefAnswer;
  public selections = new PrismaClient().selection;
  public chatgptKey = new PrismaClient().chatGPTKey;
  public subDocuments = new PrismaClient().subDocument;

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
    let answer = chatGPTResponse.choices[0].message.content;
    answer = convertMarkdownToHTML(answer);

    // answer = convertMarkdownToHTML(answer);
    // answer = answer.replaceAll(/<\/*(html|body|)\/*>/gm, "");
    // answer = answer.replaceAll("<!DOCTYPE html>", "");

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
        app: {
          include: {
            questions: true,
          },
        },
      },
    });
    if (!findSelection) throw new HttpException(404, "Selection not found");

    const userFlowPrompt = generateUserFlowPrompt(
      findSelection.projectName,
      findSelection.description,
      findSelection.app.questions.map(question => question.name),
    );

    const body: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[] = [
      {
        role: "system",
        content: "You are expert in making software requirement",
      },
    ];
    body.push({
      role: "user",
      content: userFlowPrompt,
    });

    const response = await chatGPTRequest(body);
    const message: OpenAI.Chat.ChatCompletionMessage = response.data.choices[0].message;
    const mermaid = message.content;

    let finalMermaid = mermaid.match(/```mermaid(\s+([\s\S]+?))```/gi)[0];
    finalMermaid = finalMermaid.replaceAll("```mermaid", "").replaceAll("```", "");

    await this.selections.update({
      where: {
        id: selectionId,
      },
      data: {
        userFlow: mermaid,
      },
    });

    // if (!findSelection.chatGPTBriefAnswer) throw new HttpException(404, "Please generate a brief first");

    // const response = await chatGPTRequestUserFlow(
    //   findSelection.chatGPTBriefAnswer.prompt,
    //   findSelection.chatGPTBriefAnswer.answer,
    //   generateUserFlowPrompt(),
    // );
    // const data = response.choices[0].message.content;

    // const convertedData = convertMermaidToReactFlow(data);
    // console.log({ convertedData });

    // await this.selections.update({
    //   where: {
    //     id: selectionId,
    //   },
    //   data: {
    //     userFlow: convertedData,
    //   },
    // });

    return finalMermaid;
  };

  // public generateDocument = async (selectionId: number) => {
  //   try {
  //     const findSelection = await this.selections.findUnique({
  //       where: {
  //         id: selectionId,
  //       },
  //       include: {
  //         chatGPTBriefAnswer: true,
  //         app: {
  //           include: {
  //             questions: true,
  //           },
  //         },
  //       },
  //     });
  //     if (!findSelection) throw new HttpException(404, "Selection not found");

  //     // return outline
  //     const outline = createOutline(findSelection);

  //     // create each sub document for each part
  //     await this.subDocuments.createMany({
  //       data: OUTLINE_OF_DOCUMENT.map((outline, id) => ({
  //         part: String(id + 1),
  //         title: outline,
  //         selectionId,
  //       })),
  //     });

  //     // get next parts
  //     const notGenSubDocuments = await this.subDocuments.findMany({
  //       where: {
  //         selectionId,
  //       },
  //     });
  //     const nextPart = notGenSubDocuments.map(subDocument => ({
  //       part: subDocument.part,
  //       url: `/chatgpt/generate-document/${selectionId}/part/${subDocument.part}`,
  //     }));

  //     return {
  //       outline,
  //       nextPart,
  //     };
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  public generatePartOfDocument = async (selectionId: number, partIndex: number) => {
    const findSelection = await this.selections.findUnique({
      where: {
        id: selectionId,
      },
      include: {
        chatGPTBriefAnswer: true,
        app: {
          include: {
            questions: true,
          },
        },
      },
    });
    if (!findSelection) throw new HttpException(404, "Selection not found");

    const keys = await this.chatgptKey.findMany({
      where: {
        isRunning: false,
      },
    });
    if (keys.length < 1) throw new HttpException(400, "Please try again after a minutes. All keys are running");

    const chatgptKey = keys[0];
    await this.chatgptKey.update({
      where: {
        id: chatgptKey.id,
      },
      data: {
        isRunning: true,
      },
    });

    // const subDocument = await this.subDocuments.findFirst({
    //   where: {
    //     selectionId,
    //     part: partId,
    //   },
    // });
    // if (!subDocument) throw new HttpException(404, "Sub document not found");
    // if (subDocument.isGenerating) throw new HttpException(400, "Sub document is generating");

    // update is_generating status
    // await this.subDocuments.update({
    //   where: { id: subDocument.id },
    //   data: { isGenerating: true },
    // });

    // request generating part of document
    const body: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[] = [
      {
        role: "system",
        content: "You are expert in making software requirement",
      },
      {
        role: "user",
        content: createOutlinePrompt(findSelection.projectName, findSelection.description, [
          "User profile creation and management",
          "News feed displaying content from friends and followed pages",
          "Friend requests and messaging",
          "Group creation and management",
          "Pages creation and management",
          "Like, comment, and share functionalities for posts and pages",
          "Notifications for activity on the website",
        ]),
      },
      {
        role: "user",
        content: `Rewrite part ${partIndex}. It should be written in a clear and concise style, made longer, and more specific, detail. The final must be minimum 1 pages in length and in markdown format.`,
      },
    ];

    console.log(body);
    console.log("BEGIN generating part", partIndex);
    const response = await chatGPTRequestWithKey(chatgptKey.key, body);
    const message = response.data.choices[0].message;
    console.log("END generating part", partIndex);

    console.log(partIndex, { message });

    // DONE

    // update it in sub document table
    // await this.subDocuments.update({
    //   where: {
    //     id: subDocument.id,
    //   },
    //   data: {
    //     content: message.content,
    //     isGenerating: false,
    //   },
    // });

    // get next parts
    // const notGenSubDocuments = await this.subDocuments.findMany({
    //   where: {
    //     selectionId,
    //     content: {
    //       equals: null,
    //     },
    //     isGenerating: {
    //       not: true,
    //     },
    //   },
    // });
    // const nextPart = notGenSubDocuments.map(subDocument => ({
    //   part: subDocument.part,
    //   url: `/chatgpt/generate-document/${selectionId}/part/${subDocument.part}`,
    // }));

    await this.chatgptKey.update({
      where: {
        id: chatgptKey.id,
      },
      data: {
        isRunning: false,
      },
    });

    return {
      content: message.content,
      // nextPart: nextPart,
    };
  };

  public generateDocument = async (selectionId: number) => {
    const findSelection = await this.selections.findUnique({
      where: {
        id: selectionId,
      },
      include: {
        chatGPTBriefAnswer: true,
        app: {
          include: {
            questions: true,
          },
        },
      },
    });
    if (!findSelection) throw new HttpException(404, "Selection not found");

    const countKeyIsFree = await this.chatgptKey.count({
      where: {
        isRunning: false,
      },
    });
    if (countKeyIsFree < 1) throw new HttpException(400, "Please try again after a minutes. All keys are running");

    // generatePartsInDocument(findSelection);
    // generateFullyDocument(findSelection);

    // return outline
    const data = createOutline(findSelection);

    return {
      ...data,
      selection: findSelection,
    };
  };

  public generateDocumentInBackground = async (selectionId: number, body: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[]) => {
    const sections = [
      "Introduction",
      "Project Overview",
      "Functional Objectives",
      "Non-functional Objectives",
      "Project Scope",
      "Project Plan",
      "Budget",
      "Conclusion",
    ];
    const detailSections = [];

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    for (let id = 0; id < sections.length; id++) {
      await delay(id * 15000);
      const section = sections[id];

      body.push({
        role: "user",
        content:
          id === 0
            ? `Rewrite a ${section} part. It should be written in a clear and concise style, made longer, and more specific, detail. The final must be minimum 1 pages in length`
            : `Continue with ${section} part`,
      });

      const response = await chatGPTRequest(body);
      const message = response.data.choices[0].message;

      body.push(message);
      detailSections.push(message.content);
      console.log({ body });
    }

    const findSelection = await this.selections.findUnique({ where: { id: selectionId } });

    let document = `
Software Requirement Specification for ${findSelection.projectName}

${detailSections.join("\n\n")}

`;
    document = convertMarkdownToHTML(document); // convert markdown to HTMLJ

    await this.selections.update({
      where: { id: selectionId },
      data: {
        document,
      },
    });
    console.log("Finished generating document");

    return detailSections;
  };

  public getDocument = async (selectionId: number) => {
    const findSelection = await this.selections.findUnique({
      where: { id: selectionId },
    });
    if (!findSelection) throw new HttpException(404, "Selection not found");

    return findSelection.document;
  };

  private createSubDocument = async (selectionId: number, outline: string) => {
    // await this.subDocuments.create({});
  };

  public streamGeneratePartOfDocument = async (socket, selectionId: number, partIndex: number) => {
    const findSelection = await this.selections.findUnique({
      where: {
        id: selectionId,
      },
      include: {
        chatGPTBriefAnswer: true,
        app: {
          include: {
            questions: true,
          },
        },
      },
    });
    if (!findSelection) throw new Error("Selection not found");

    const keys = await this.chatgptKey.findMany({
      where: {
        isRunning: false,
      },
      orderBy: {
        lastUsedAt: "asc",
      },
    });
    console.log({ keys });
    if (keys.length < 1) throw new Error("Please try again after a minutes. All keys are running");

    const chatgptKey = keys[0];
    await this.chatgptKey.update({
      where: {
        id: chatgptKey.id,
      },
      data: {
        isRunning: true,
      },
    });

    // const subDocument = await this.subDocuments.findFirst({
    //   where: {
    //     selectionId,
    //     part: partId,
    //   },
    // });
    // if (!subDocument) throw new HttpException(404, "Sub document not found");
    // if (subDocument.isGenerating) throw new HttpException(400, "Sub document is generating");

    // update is_generating status
    // await this.subDocuments.update({
    //   where: { id: subDocument.id },
    //   data: { isGenerating: true },
    // });

    // request generating part of document
    const body: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[] = [
      {
        role: "system",
        content: "You are expert in making software requirement",
      },
      {
        role: "user",
        content: createOutlinePrompt(findSelection.projectName, findSelection.description, [
          "User profile creation and management",
          "News feed displaying content from friends and followed pages",
          "Friend requests and messaging",
          "Group creation and management",
          "Pages creation and management",
          "Like, comment, and share functionalities for posts and pages",
          "Notifications for activity on the website",
        ]),
      },
      {
        role: "user",
        content: `Rewrite part ${partIndex}. It should be written in a clear and concise style, made longer, and more specific, detail. The final must be minimum 1 pages in length and in markdown format.`,
      },
    ];

    const response = await chatGPTRequestWithKey(chatgptKey.key, body, true);

    await this.chatgptKey.update({
      where: {
        id: chatgptKey.id,
      },
      data: {
        isRunning: false,
        lastUsedAt: new Date(),
      },
    });

    return {
      stream: response,
    };
  };
}

export default ChatGPTService;
