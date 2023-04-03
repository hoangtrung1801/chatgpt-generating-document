import SelectionsController from "@/controllers/selections.controller";
import { CreateSelectionDto } from "@/dtos/selections.dto";
import authMiddleware from "@/middlewares/auth.middleware";
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
    this.router.use(`/${this.path}`, authMiddleware);

    this.router.get(`${this.path}`, this.seletionsController.getSelections);
    this.router.get(`${this.path}/:id(\\d+)`, this.seletionsController.getSelectionById);
    this.router.get(`${this.path}/:id/user-stories`, this.seletionsController.getUserStoriesInSelection);
    this.router.get(`${this.path}/current-user`, this.seletionsController.getCurrentUserSelections);

    this.router.post(`${this.path}`, validationMiddleware(CreateSelectionDto, "body"), this.seletionsController.createSelection);

    this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateSelectionDto, "body", true), this.seletionsController.updateSelection);
    this.router.put(`${this.path}/:id(\\d+)/user-stories/:userStoryId(\\d+)`, this.seletionsController.updateUserStoriesInSelection);

    this.router.delete(`${this.path}/:id(\\d+)`, this.seletionsController.deleteSelection);

    // this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, "body"), this.usersController.createCategory);
    // this.router.post(`${this.path}`, validationMiddleware(CreateQuestionDto, "body"), this.questionController.createQuestion);
    // // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, "body", true), this.usersController.updateCategory);
    // this.router.put(`${this.path}/:id(\\d+)`, this.questionController.updateQuestion);
    // this.router.delete(`${this.path}/:id(\\d+)`, this.questionController.deleteQuestion);
  }
}

export default SelectionRoute;
