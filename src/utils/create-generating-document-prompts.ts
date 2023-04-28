import { Selection } from "@prisma/client";

export const OUTLINE_OF_DOCUMENT = [
  "Introduction",
  "Project Overview",
  "Functional Objectives",
  "Non-functional Objectives",
  "Project Scope",
  "Project Plan",
  "Budget",
  "Conclusion",
];

export function createOutline(selection: Selection) {
  const tableOfContent = OUTLINE_OF_DOCUMENT.map((title, id) => `${id + 1}. ${title}:`).join("\n");

  return `
Software Requirement Specification for ${selection.projectName}

Table of Contents
${tableOfContent}
  `;
}

export function createOutlinePrompt(softwareName: string, description: string, features: string[]) {
  return `
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
+ Software name: ${softwareName}
+ Description: ${description}
+ Features: ${features.join(", ")}

The document should be written in a clear and concise style, formatted like a standard business proposal, and include any specific terminology or language you provide.
`;
}
