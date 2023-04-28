export function highLightDocument(document: string) {
  const finalDocument = document;
  const reg = /.*:$/gm;
  const wordNeedHighlight = document.match(reg);

  wordNeedHighlight.forEach(word => {
    finalDocument.replace(word, `### ${word}`);
  });

  return finalDocument;
}
