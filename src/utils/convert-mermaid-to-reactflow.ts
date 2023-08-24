export default function convertMermaidToReactFlow(mermaid: string) {
  console.log(mermaid.match(/```mermaid\s+([\s\S]+?)```/g));
  return mermaid.replace("```mermaid\n", "").replaceAll("mermaid", "").replace("```", "");
  // return mermaid.replaceAll("```", "").replaceAll("mermaid", "");
}
