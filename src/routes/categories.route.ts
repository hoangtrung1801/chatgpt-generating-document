import CategoriesController from "@/controllers/categories.controller";
import validationMiddleware from "@/middlewares/validation.middleware";
import { Routes } from "@interfaces/routes.interface";
import { Router } from "express";

class CategoriesRoute implements Routes {
  public path = "/categories";
  public router = Router();
  public usersController = new CategoriesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.usersController.getCategories);
    this.router.get(`${this.path}/:id(\\d+)`, this.usersController.getCategoryById);
    // this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, "body"), this.usersController.createCategory);
    this.router.post(`${this.path}`, this.usersController.createCategory);
    // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, "body", true), this.usersController.updateCategory);
    this.router.put(`${this.path}/:id(\\d+)`, this.usersController.updateCategory);
    this.router.delete(`${this.path}/:id(\\d+)`, this.usersController.deleteCategory);
  }
}

export default CategoriesRoute;
