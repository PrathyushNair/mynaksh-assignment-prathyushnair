import { Router } from "express";

import { DatabaseService } from "../Services/databaseService";
import { AuthService } from "../Services/authService";
import { AuthController } from "../Controller/authController";

export const authRouter = Router();
const dataBaseService=new DatabaseService()
const authService=new AuthService(dataBaseService)
const authController = new AuthController(authService);
authRouter.post("/signup", authController.signup.bind(authController));
authRouter.post("/login",authController.login.bind(authController));
