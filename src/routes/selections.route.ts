import SelectionsController from "@/controllers/selections.controller";
import { CreateSelectionDto } from "@/dtos/selections.dto";
import { CreateUserStoryDto } from "@/dtos/user-story.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { Routes } from "@interfaces/routes.interface";
import { Router } from "express";

class SelectionRoute implements Routes {
  public path = "/selections";
  public router = Router();
  public selectionsController = new SelectionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(`${this.path}`, authMiddleware);

    this.router.get(`${this.path}`, this.selectionsController.getSelections);

    this.router.get(`${this.path}/:id(\\d+)`, this.selectionsController.getSelectionById);
    this.router.get(`${this.path}/:id(\\d+)/user-stories`, this.selectionsController.getUserStoriesInSelection);

    this.router.get(`${this.path}/current-user`, this.selectionsController.getCurrentUserSelections);

    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateSelectionDto, "body"), this.selectionsController.createSelection);

    this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateSelectionDto, "body", true), this.selectionsController.updateSelection);
    this.router.put(
      `${this.path}/:id(\\d+)/user-stories/:userStoryId(\\d+)`,
      validationMiddleware(CreateUserStoryDto, "body", true),
      this.selectionsController.updateUserStoriesInSelection,
    );

    this.router.delete(`${this.path}/:id(\\d+)`, this.selectionsController.deleteSelection);

    // this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, "body"), this.usersController.createCategory);
    // this.router.post(`${this.path}`, validationMiddleware(CreateQuestionDto, "body"), this.questionController.createQuestion);
    // // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, "body", true), this.usersController.updateCategory);
    // this.router.put(`${this.path}/:id(\\d+)`, this.questionController.updateQuestion);
    // this.router.delete(`${this.path}/:id(\\d+)`, this.questionController.deleteQuestion);
  }
}

export default SelectionRoute;
