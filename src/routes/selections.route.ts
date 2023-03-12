import SelectionsController from "@/controllers/selections.controller";
import { CreateSelectionDto } from "@/dtos/selections.dto";
import validationMiddleware from "@/middlewares/validation.middleware";
import { Routes } from "@interfaces/routes.interface";
import { Router } from "express";

class SelectionRoute implements Routes {
  public path = "/selections";
  public router = Router();
  public seletionsController = new SelectionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.seletionsController.getSelections);
    this.router.get(`${this.path}/:id(\\d+)`, this.seletionsController.getSelectionById);
    this.router.post(`${this.path}`, validationMiddleware(CreateSelectionDto, "body"), this.seletionsController.createSelection);
    // this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, "body"), this.usersController.createCategory);
    // this.router.post(`${this.path}`, validationMiddleware(CreateQuestionDto, "body"), this.questionController.createQuestion);
    // // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, "body", true), this.usersController.updateCategory);
    // this.router.put(`${this.path}/:id(\\d+)`, this.questionController.updateQuestion);
    // this.router.delete(`${this.path}/:id(\\d+)`, this.questionController.deleteQuestion);
  }
}

export default SelectionRoute;
