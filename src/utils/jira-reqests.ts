import axios from "axios";

const JIRA_URL = "https://hoangtrung1801.atlassian.net/rest/api/3/issue";
// const JIRA_EMAIL = "hoangtrung1801.2003@gmail.com";
const JIRA_API_KEY =
  "Basic aG9hbmd0cnVuZzE4MDEuMjAwM0BnbWFpbC5jb206QVRBVFQzeEZmR0YwM2hXUURzdTRBZmYzX0s3UE1mdlZQc3A0NzFLeFo2alBrZVF6eDdTUDkzNzVXajhrN1BMY09SNXJQMDU3VGJackhjMUZVWkVpaVJET0FsanBfSFExS19rQTBIVjlqOTY1a19nSXNNb2VsMC1yd3FfbS1CUlpuMkY0RWhwQUoxXzJrV0pUWlM2VldyYVU0bWdXZEpYbnNzUmNqWEFsQkNjOTJGbGF0aFJfd3NBPTcxN0I3NkJF";

export const jiraPushUserStory = async (title: string) => {
  try {
    const response = await axios.post(
      JIRA_URL,
      {
        fields: {
          project: {
            key: "CCDG",
          },
          summary: title,
          issuetype: {
            name: "Task",
          },
        },
      },
      {
        headers: {
          Authorization: JIRA_API_KEY,
          Accept: "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    return error;
  }
};
