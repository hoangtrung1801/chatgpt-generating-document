import { OUTLINE_OF_DOCUMENT } from "./create-generating-document-prompts";

export function highLightDocument(document: string) {
  const finalDocument = document;
  // const reg = /.*:$/gm;
  // const wordNeedHighlight = document.match(reg);
  // wordNeedHighlight.push(document.split("\n").filter(line => line === "\n")[0]);

  // for (const word in OUTLINE_OF_DOCUMENT) {
  //   if (word.length > 100) return;
  //   finalDocument = finalDocument.replace(word, `### ${word}`);
  // }

  // console.log(finalDocument);

  return finalDocument;
}
