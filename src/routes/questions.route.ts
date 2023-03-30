import QuestionsController from "@/controllers/questions.controller";
import { CreateQuestionDto } from "@/dtos/questions.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { Routes } from "@interfaces/routes.interface";
import { Router } from "express";

class QuestionsRoute implements Routes {
  public path = "/questions";
  public router = Router();
  public questionController = new QuestionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(`${this.path}`, authMiddleware);

    this.router.get(`${this.path}`, this.questionController.getQuestions);
    this.router.get(`${this.path}/:id(\\d+)`, this.questionController.getQuestionById);
    // this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, "body"), this.usersController.createCategory);
    this.router.post(`${this.path}`, validationMiddleware(CreateQuestionDto, "body"), this.questionController.createQuestion);
    // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, "body", true), this.usersController.updateCategory);
    this.router.put(`${this.path}/:id(\\d+)`, this.questionController.updateQuestion);
    this.router.delete(`${this.path}/:id(\\d+)`, this.questionController.deleteQuestion);
  }
}

export default QuestionsRoute;
