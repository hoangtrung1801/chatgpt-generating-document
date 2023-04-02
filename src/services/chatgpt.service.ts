import { chatGPTRequestTodoListPrompt } from "@/utils/chatgpt-request";
import { PrismaClient } from "@prisma/client";
import { isEmpty } from "class-validator";

class ChatGPTService {
  public chatgptBrief = new PrismaClient().chatGPTBriefAnswer;

  public async test() {
    // const briefId = 21;
    // const findBrief = await this.chatgptBrief.findUnique({
    //   where: {
    //     id: briefId,
    //   },
    // });
    // const briefPrompt = findBrief.prompt;
    // const answeredBrief = findBrief.answer;
    // const response = await chatGPTRequestTodoListPrompt(briefPrompt, answeredBrief);
    // const responseContent: string = response.choices[0].message.content;
    // const todos = responseContent
    //   .split("+")
    //   .map((e: string) => e.replace("\n", "").trim())
    //   .filter(e => !isEmpty(e));
    // const response = await Promise.all(todos.map(todo => jiraPushTask(todo)));
    // const response = await jiraPushTask("test");
    // console.log("response", response);
    // const response = await axios.get("https://hoangtrung1801.atlassian.net/rest/api/3/issuetype", {
    //   headers: {
    //     Authorization:
    //       "Basic aG9hbmd0cnVuZzE4MDEuMjAwM0BnbWFpbC5jb206QVRBVFQzeEZmR0YwM2hXUURzdTRBZmYzX0s3UE1mdlZQc3A0NzFLeFo2alBrZVF6eDdTUDkzNzVXajhrN1BMY09SNXJQMDU3VGJackhjMUZVWkVpaVJET0FsanBfSFExS19rQTBIVjlqOTY1a19nSXNNb2VsMC1yd3FfbS1CUlpuMkY0RWhwQUoxXzJrV0pUWlM2VldyYVU0bWdXZEpYbnNzUmNqWEFsQkNjOTJGbGF0aFJfd3NBPTcxN0I3NkJF",
    //     Accept: "application/json",
    //   },
    // });
    // console.log("response", response.data);
    // const response = await axios.post(
    //   "https://hoangtrung1801.atlassian.net/rest/api/3/issue",
    //   {
    //     fields: {
    //       project: {
    //         key: "CCDG",
    //       },
    //       summary: "test 30032023",
    //       issuetype: {
    //         name: "Task",
    //       },
    //     },
    //   },
    //   {
    //     headers: {
    //       Authorization:
    //         "Basic aG9hbmd0cnVuZzE4MDEuMjAwM0BnbWFpbC5jb206QVRBVFQzeEZmR0YwM2hXUURzdTRBZmYzX0s3UE1mdlZQc3A0NzFLeFo2alBrZVF6eDdTUDkzNzVXajhrN1BMY09SNXJQMDU3VGJackhjMUZVWkVpaVJET0FsanBfSFExS19rQTBIVjlqOTY1a19nSXNNb2VsMC1yd3FfbS1CUlpuMkY0RWhwQUoxXzJrV0pUWlM2VldyYVU0bWdXZEpYbnNzUmNqWEFsQkNjOTJGbGF0aFJfd3NBPTcxN0I3NkJF",
    //       Accept: "application/json",
    //     },
    //   },
    // );
    // console.log("response", response.data);
    // console.log("response", (await jiraPushTask("test 123456")).data);
  }

  public async getBriefById(briefId: number) {
    const findBrief = await this.chatgptBrief.findUnique({
      where: {
        id: briefId,
      },
    });
    return findBrief;
  }

  public async generateTodoList(briefId: number): Promise<string[]> {
    const findBrief = await this.chatgptBrief.findUnique({
      where: {
        id: briefId,
      },
    });
    const briefPrompt = findBrief.prompt;
    const answeredBrief = findBrief.answer;

    const response = await chatGPTRequestTodoListPrompt(briefPrompt, answeredBrief);
    const responseContent: string = response.choices[0].message.content;

    const todos = responseContent
      .split("+")
      .map((e: string) => e.replace("\n", "").trim())
      .filter(e => !isEmpty(e));
    return todos;
  }
}

export default ChatGPTService;
