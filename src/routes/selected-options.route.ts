import SelectedOptionsController from "@/controllers/selected-options.controller";
import { Routes } from "@interfaces/routes.interface";
import { Router } from "express";

class SelectedOptionsRoute implements Routes {
  public path = "/selected-options";
  public router = Router();
  public selectedOptionsController = new SelectedOptionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.selectedOptionsController.getSelectedOptions);
    // this.router.get(`${this.path}/:id(\\d+)`, this.selectedOptionsController.getSelectionById);
    // this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, "body"), this.usersController.createCategory);
    // this.router.post(`${this.path}`, validationMiddleware(CreateQuestionDto, "body"), this.questionController.createQuestion);
    // // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, "body", true), this.usersController.updateCategory);
    // this.router.put(`${this.path}/:id(\\d+)`, this.questionController.updateQuestion);
    // this.router.delete(`${this.path}/:id(\\d+)`, this.questionController.deleteQuestion);
  }
}

export default SelectedOptionsRoute;
