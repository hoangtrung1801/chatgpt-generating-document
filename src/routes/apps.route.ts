import AppsController from "@/controllers/apps.controller";
import { CreateAppDto } from "@/dtos/apps.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { Routes } from "@interfaces/routes.interface";
import { Router } from "express";

class AppsRoute implements Routes {
  public path = "/apps";
  public router = Router();
  public usersController = new AppsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(`${this.path}`, authMiddleware);

    this.router.get(`${this.path}`, this.usersController.getApps);
    this.router.get(`${this.path}/:id(\\d+)`, this.usersController.getAppById);
    // this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, "body"), this.usersController.createCategory);
    this.router.post(`${this.path}`, validationMiddleware(CreateAppDto, "body"), this.usersController.createApp);
    // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, "body", true), this.usersController.updateCategory);
    this.router.put(`${this.path}/:id(\\d+)`, this.usersController.updateApp);
    this.router.delete(`${this.path}/:id(\\d+)`, this.usersController.deleteApp);
  }
}

export default AppsRoute;
