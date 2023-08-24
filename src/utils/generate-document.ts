import { ChatGPTKey, PrismaClient, Selection } from "@prisma/client";
import { ChatCompletionRequestMessage } from "openai";
import { chatGPTRequestWithKey } from "./chatgpt-request";
import { OUTLINE_OF_DOCUMENT, createOutline, createOutlinePrompt } from "./create-generating-document-prompts";
import { highLightDocument } from "./highlight-document";
import { Http } from "winston/lib/winston/transports";
import { HttpException } from "@/exceptions/HttpException";

const chatgptKey = new PrismaClient().chatGPTKey;
const selectionPrisma = new PrismaClient().selection;

export async function generatePartsInDocument(selection: Selection) {
  const keys = await chatgptKey.findMany({
    where: {
      isRunning: false,
    },
  });

  await chatgptKey.updateMany({
    where: {
      id: {
        in: keys.map(key => key.id),
      },
    },
    data: {
      isRunning: true,
    },
  });
  // begin

  const begin = Date.now();
  //   console.log({ selection });
  //   console.log("begin");

  const amount = Math.ceil(OUTLINE_OF_DOCUMENT.length / keys.length);
  const data = await Promise.all(keys.map((key, id) => generate(selection, key, id * amount, (id + 1) * amount)));
  let document = `
${createOutline(selection)}

${data.flat().join("\n\n")}
  `;

  console.log({ document });
  document = highLightDocument(document);
  // document = convertMarkdownToHTML(document);

  console.log({ document });

  await selectionPrisma.update({
    where: { id: selection.id },
    data: {
      document,
    },
  });

  //   console.log("end");
  const end = Date.now();
  console.log(`Time generating document: ${end - begin}ms`);

  // done
  await chatgptKey.updateMany({
    where: {
      id: {
        in: keys.map(key => key.id),
      },
    },
    data: {
      isRunning: false,
    },
  });
}

async function generate(selection: Selection, chatgptKey: ChatGPTKey, from: number, to: number) {
  const result = [];

  for (const outline of OUTLINE_OF_DOCUMENT.slice(from, to > OUTLINE_OF_DOCUMENT.length ? OUTLINE_OF_DOCUMENT.length : to)) {
    console.log(outline);
    let response;
    do {
      const body: ChatCompletionRequestMessage[] = [
        {
          role: "system",
          content: "You are expert in making software requirement",
        },
        {
          role: "user",
          content: createOutlinePrompt(selection.projectName, selection.description, [
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
          content: `Rewrite a ${outline} part. It should be written in a clear and concise style, made longer, and more specific, detail. The final must be in markdown format and minimum 1 pages in length.`,
        },
      ];
      response = await chatGPTRequestWithKey(chatgptKey.key, body);

      if (response.status === 429) {
        console.log("Error: react limit request");
      }

      // if it reach limit request
    } while (response.status === 429);

    result.push(response.data.choices[0].message.content);
  }

  return result;
}

export async function generateFullyDocument(selection: Selection) {
  console.log("BEGIN generate document");
  const keys = await chatgptKey.findMany({
    where: {
      isRunning: false,
    },
  });

  await chatgptKey.updateMany({
    where: {
      id: {
        in: keys.map(key => key.id),
      },
    },
    data: {
      isRunning: true,
    },
  });

  const features = [
    "User profile creation and management",
    "News feed displaying content from friends and followed pages",
    "Friend requests and messaging",
    "Group creation and management",
    "Pages creation and management",
    "Like, comment, and share functionalities for posts and pages",
    "Notifications for activity on the website",
  ];

  const prompt = `
Using the information I provide, you should generate a proposal document in a word processing format with the following sections:

1. Introduction: Provide a brief description of the software's purpose and its intended audience.
2. Project Overview: Describe the features of the software, the programming language and operating system it will use, and the methodology that will be used to develop the project.
3. Functional Objectives: Divide provided features into small subsection and describe it in detail matching on current software, including specific use cases or scenarios.
4. Non-functional Objectives: Outline the non-functional objectives of the software, such as performance or security requirements.
5. Project Scope: Define the scope of the project, including any constraints or limitations that may impact the development or delivery of the software.
6. Project Plan: Detail the timeline and milestones for the project, including the phases of development and testing.
7. Budget: Provide a breakdown of the estimated costs for developing and delivering the software, including any resources or tools required.
8. Conclusion: Summarize the key details and objectives of the software, and express confidence in delivering the project according to the specified objectives and requirements.

This is software information I provide:
+ Software name: ${selection.projectName}
+ Description: ${selection.description}
+ Features: ${features.join(", ")}

The document should be written in a clear and concise style, formatted like a standard business proposal, and include any specific terminology or language you provide. The document must be written as longer as possible. The document must be in markdown format.
  `;

  const body: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: "You are expert in making software requirement document",
    },
    {
      role: "user",
      content: prompt,
    },
  ];
  const response = await chatGPTRequestWithKey(keys[0].key, body);

  if (response.status === 429) {
    throw new HttpException(400, "Reach limit request when querying to OpenAI");
  }

  const document = response.data.choices[0].message.content;

  await selectionPrisma.update({
    where: { id: selection.id },
    data: {
      document,
    },
  });

  // done
  await chatgptKey.updateMany({
    where: {
      id: {
        in: keys.map(key => key.id),
      },
    },
    data: {
      isRunning: false,
    },
  });

  console.log(document);
  console.log("END generate document");

  return true;
}
