import { ChatGPTKey, PrismaClient, Selection } from "@prisma/client";
import { ChatCompletionRequestMessage } from "openai";
import { chatGPTRequestWithKey } from "./chatgpt-request";
import { OUTLINE_OF_DOCUMENT, createOutline, createOutlinePrompt } from "./create-generating-document-prompts";
import convertMarkdownToHTML from "./convertMarkdownToHTML";
import { highLightDocument } from "./highlight-document";

const chatgptKey = new PrismaClient().chatGPTKey;
const selectionPrisma = new PrismaClient().selection;

export async function generatePartsInDocument(selection: Selection) {
  const keys = await chatgptKey.findMany({
    where: {
      isRunning: false,
    },
  });

  if (keys.length === 0) {
    console.log("No key available");
    return;
    // throw new Error("No key available");
  }

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

  // const data = await Promise.all([generate(selection, keys[0], 0, 4), generate(selection, keys[1], 4, 8)]);
  const amount = Math.ceil(OUTLINE_OF_DOCUMENT.length / keys.length);
  const data = await Promise.all(keys.map((key, id) => generate(selection, key, id * amount, (id + 1) * amount)));
  let document = `
${createOutline(selection)}

${data.flat().join("\n\n")}
  `;

  document = highLightDocument(document);
  document = convertMarkdownToHTML(document);
  //   console.log({ document });

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
          content: `Rewrite a ${outline} part. It should be written in a clear and concise style, made longer, and more specific, detail. The final must be minimum 1 pages in length.`,
        },
      ];
      response = await chatGPTRequestWithKey(chatgptKey.key, body);

      if (response.status === 429) {
        console.log("Erorr: react limit request");
      }

      // if it reach limit request
    } while (response.status === 429);

    result.push(response.data.choices[0].message.content);
  }

  return result;
}
