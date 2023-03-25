import OptionsController from "@/controllers/options.controller";
import { CreateOptionDto } from "@/dtos/option.dto";
import validationMiddleware from "@/middlewares/validation.middleware";
import { Routes } from "@interfaces/routes.interface";
import { Router } from "express";

class OptionsRoute implements Routes {
  public path = "/options";
  public router = Router();
  public optionsController = new OptionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.optionsController.getOptions);
    // this.router.post(`${this.path}`, this.optionsController.createOptions);
    this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateOptionDto, "body", true), this.optionsController.updateOption);
    this.router.put(`${this.path}/:id(\\d+)`, this.optionsController.deleteOption);

    // this.router.get(`${this.path}/:id(\\d+)`, this.optionsController.getQuestionById);
    // // this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, "body"), this.usersController.createCategory);
    // this.router.post(`${this.path}`, validationMiddleware(CreateQuestionDto, "body"), this.optionsController.createQuestion);
    // // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, "body", true), this.usersController.updateCategory);
    // this.router.put(`${this.path}/:id(\\d+)`, this.optionsController.updateQuestion);
    // this.router.delete(`${this.path}/:id(\\d+)`, this.optionsController.deleteQuestion);
  }
}

export default OptionsRoute;
