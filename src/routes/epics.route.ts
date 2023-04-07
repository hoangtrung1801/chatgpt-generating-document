import EpicsController from "@/controllers/epics.controller";
import { CreateEpicDto } from "@/dtos/epics.dto";
import validationMiddleware from "@/middlewares/validation.middleware";
import { Routes } from "@interfaces/routes.interface";
import { Router } from "express";

class EpicsRoute implements Routes {
  public path = "/epics";
  public router = Router();
  public epicController = new EpicsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.epicController.getAllEpics);
    this.router.get(`${this.path}/:id`, this.epicController.getEpicById);
    this.router.get(`${this.path}/:id/user-stories`, this.epicController.getUserStoriesInEpic);

    this.router.post(`${this.path}`, validationMiddleware(CreateEpicDto, "body"), this.epicController.createEpic);

    this.router.put(`${this.path}/:id`, validationMiddleware(CreateEpicDto, "body", true), this.epicController.updateEpic);
  }
}

export default EpicsRoute;
