export function generateBriefPrompt(appName, features: string[]) {
  return `
  I would like to generate a requirement document of software development with some specs:

  1. Introduction
  1.1. Purpose of project: make a app like ${appName}

  2. Product features:
  ${features.map((feature, id) => `2.${id + 1}. ${feature}`).join("\n")}

  3. Conclusion

  I would like you to write in detail in each section like a professional document.
  `;
}
