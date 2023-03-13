export function generateBriefPrompt(appName, features: object) {
  return `
  I would like to generate a requirement document of software development with some specs:

  1. Introduction
  1.1. Purpose of project: make a app like ${appName}

  2. Product features:
  ${Object.keys(features)
    .map((key, id) => `2.${id + 1}. ${key}: ${features[key].join(", ")}`)
    .join("\n")}

  3. Conclusion

  I would like you to write in detail in each section like a professional document.
  `;
}
