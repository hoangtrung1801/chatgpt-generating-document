export default function generateUserFlowPrompt() {
  return `
Generate a flowchart by using valid mermaid.js syntax that show the prototypical user on a website. The flowchart is generated based on information and features of software provided before. The flowchart will be specific and minimum with 15 nodes.
Just only answer with a valid mermaid.js syntax, not explaining the flowchart.
  `;
}
