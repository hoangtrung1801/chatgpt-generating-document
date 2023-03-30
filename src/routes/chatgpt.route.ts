import ChatGPTController from "@/controllers/chatgpt.controller";
import { GenerateBriefAnswerDto } from "@/dtos/chatgpt.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { Routes } from "@interfaces/routes.interface";
import { Router } from "express";

class ChatGPTRoute implements Routes {
  public path = "/chatgpt";
  public router = Router();
  public chatgptController = new ChatGPTController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(`${this.path}`, authMiddleware);

    this.router.get(`${this.path}`, this.chatgptController.test);

    this.router.get(`${this.path}/briefs`, this.chatgptController.getBriefAnswers);
    this.router.get(`${this.path}/briefs/:id`, this.chatgptController.getBriefAnswerById);
    this.router.get(`${this.path}/questions`, this.chatgptController.getQuestionAnswers);

    this.router.post(`${this.path}/briefs`, validationMiddleware(GenerateBriefAnswerDto, "body"), this.chatgptController.generateBriefAnswer);
    this.router.post(`${this.path}/briefs/:id/tasks`, this.chatgptController.generateTodoList);
    // this.router.post(`${this.path}/questions`, this.chatgptController.generateQuestionAnswer);

    // this.router.get(`${this.path}`, this.questionController.getQuestions);
    // this.router.get(`${this.path}/:id(\\d+)`, this.questionController.getQuestionById);
    // // this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, "body"), this.usersController.createCategory);
    // this.router.post(`${this.path}`, validationMiddleware(CreateQuestionDto, "body"), this.questionController.createQuestion);
    // // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, "body", true), this.usersController.updateCategory);
    // this.router.put(`${this.path}/:id(\\d+)`, this.questionController.updateQuestion);
    // this.router.delete(`${this.path}/:id(\\d+)`, this.questionController.deleteQuestion);
  }
}

export default ChatGPTRoute;
