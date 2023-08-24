export default function convertMarkdownToHTML(str: string) {
  const md = require("markdown-it")();
  const answer = md.render(str);

  return answer;
}
