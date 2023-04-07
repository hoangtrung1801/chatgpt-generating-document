import SprintsController from "@/controllers/sprints.controller";
import { CreateSprintDto } from "@/dtos/sprints.dto";
import validationMiddleware from "@/middlewares/validation.middleware";
import { Routes } from "@interfaces/routes.interface";
import { Router } from "express";

class SprintsRoute implements Routes {
  public path = "/sprints";
  public router = Router();
  public sprintsController = new SprintsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.sprintsController.getAllSprints);
    this.router.get(`${this.path}/:id`, this.sprintsController.getSprintById);
    this.router.get(`${this.path}/:id/user-stories`, this.sprintsController.getUserStoriesInSprint);

    this.router.post(`${this.path}`, validationMiddleware(CreateSprintDto, "body"), this.sprintsController.createSprint);

    this.router.put(`${this.path}/:id`, validationMiddleware(CreateSprintDto, "body", true), this.sprintsController.updateSprint);
  }
}

export default SprintsRoute;
