import UserStoriesController from "@/controllers/user-stories.controller";
import { CreateUserStoryDto } from "@/dtos/user-story.dto";
import validationMiddleware from "@/middlewares/validation.middleware";
import { Routes } from "@interfaces/routes.interface";
import { Router } from "express";

class UserStoriesRoute implements Routes {
  public path = "/user-stories";
  public router = Router();
  public userStoriesController = new UserStoriesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.userStoriesController.getAllUserStories);
    this.router.get(`${this.path}/:id`, this.userStoriesController.getUserStoryById);

    this.router.post(`${this.path}`, validationMiddleware(CreateUserStoryDto, "body"), this.userStoriesController.createUserStory);

    this.router.put(`${this.path}/:id`, validationMiddleware(CreateUserStoryDto, "body", true), this.userStoriesController.updateUserStory);
  }
}

export default UserStoriesRoute;
