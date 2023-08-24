import { Router } from "express";
import AuthController from "@controllers/auth.controller";
import { CreateUserDto } from "@dtos/users.dto";
import { Routes } from "@interfaces/routes.interface";
import authMiddleware from "@middlewares/auth.middleware";
import validationMiddleware from "@middlewares/validation.middleware";
import { LoginDto, SignUpDto } from "@/dtos/auth.dto";

class AuthRoute implements Routes {
  public path = "/";
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}auth`, authMiddleware, this.authController.checkAuth);

    this.router.post(`${this.path}signup`, validationMiddleware(SignUpDto, "body"), this.authController.signUp);
    this.router.post(`${this.path}login`, validationMiddleware(LoginDto, "body"), this.authController.logIn);
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);
  }
}

export default AuthRoute;
