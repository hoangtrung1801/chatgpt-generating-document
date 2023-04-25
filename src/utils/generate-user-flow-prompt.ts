export default function generateUserFlowPrompt(softwareName: string, description: string, features: string[]) {
  return `
Using the information I provide, you should generate a flowchart using valid mermaid.js syntax that show the prototypical user on a website. The flowchart will be specific and minimum with 15 nodes.

This is software information I provide:
+ Software name: ${softwareName}
+ Description: ${description}
+ Features: ${features.join(", ")}

Just only answer with a valid mermaid.js syntax, not explaining the flowchart.
 `;
}
