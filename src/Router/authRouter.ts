import { Router } from "express";

import { DatabaseService } from "../Services/databaseService";
import { AuthService } from "../Services/authService";
import { AuthController } from "../Controller/authController";
import { RateLimiter } from "../Middlewares/rateLimiter";

export const authRouter = Router();
const dataBaseService=new DatabaseService()
const authService=new AuthService(dataBaseService)
const authController = new AuthController(authService);
const rateLimiter =new RateLimiter(5,60000) 
authRouter.post("/signup", rateLimiter.isAllowed,authController.signup.bind(authController));
authRouter.post("/login",rateLimiter.isAllowed,authController.login.bind(authController));
