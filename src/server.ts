import App from "@/app";
import AuthRoute from "@routes/auth.route";
import IndexRoute from "@routes/index.route";
import UsersRoute from "@routes/users.route";
import validateEnv from "@utils/validateEnv";
import CategoriesRoute from "./routes/categories.route";
import QuestionsRoute from "./routes/questions.route";
import SelectionRoute from "./routes/selections.route";
import SelectedOptionsRoute from "./routes/selected-options.route";
import OptionsRoute from "./routes/options.route";
import ChatGPTRoute from "./routes/chatgpt.route";

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new CategoriesRoute(),
  new QuestionsRoute(),
  new SelectionRoute(),
  new SelectedOptionsRoute(),
  new OptionsRoute(),
  new ChatGPTRoute(),
]);

app.listen();
