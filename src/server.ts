import App from "@/app";
import AuthRoute from "@routes/auth.route";
import IndexRoute from "@routes/index.route";
import UsersRoute from "@routes/users.route";
import validateEnv from "@utils/validateEnv";
import AppsRoute from "./routes/apps.route";
import QuestionsRoute from "./routes/questions.route";
import SelectionRoute from "./routes/selections.route";
import SelectedOptionsRoute from "./routes/selected-options.route";
import OptionsRoute from "./routes/options.route";
import ChatGPTRoute from "./routes/chatgpt.route";
import UserStoriesRoute from "./routes/user-stories.route";
import SprintsRoute from "./routes/sprints.route";
import EpicsRoute from "./routes/epics.route";

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new AppsRoute(),
  new QuestionsRoute(),
  new SelectionRoute(),
  new SelectedOptionsRoute(),
  new OptionsRoute(),
  new ChatGPTRoute(),
  new UserStoriesRoute(),
  new SprintsRoute(),
  new EpicsRoute(),
]);

app.listen();
