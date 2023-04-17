export default function convertMermaidToReactFlow(mermaid: string) {
  return mermaid.replace("```mermaid\n", "").replace("```", "");
}
