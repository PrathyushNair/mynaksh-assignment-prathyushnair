import { Request, Response } from "express";
import { AuthServiceInterface } from "../interfaces";

export class AuthController {
  private authService: AuthServiceInterface;
  constructor(authService: AuthServiceInterface) {
    this.authService = authService;
  }
  async signup(req: Request, res: Response) {
    try {
      const { name, email, password, birthdate } = req.body;
      const result = await this.authService.signup({
        name,
        email,
        password,
        birthdate,
      });
      return res.status(result.status).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.log("Error from signup:", (error as Error).message);
      if ((error as any).statusCode === 400) {
        return res.status(400).send({
          status: false,
          message: `${(error as Error).message}`,
        });
      }
      res.status(500).send({
        status: false,
        message: `Signup failed. Try again later`,
      });
    }
  }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login({ email, password });
      if (result.success && result.refreshToken && result.accessToken) {
        res.cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 2 * 24 * 60 * 60 * 1000,
        });
        return res
          .status(200)
          .json({ success: result.success, accessToken: result.accessToken });
      }
      return res.status(result.status).json({
        success: result.success,
        message: result.message,
      });
    } catch (error: any) {
      console.log("Error from login:", (error as Error).message);
      if ((error as any).statusCode === 400) {
        return res.status(400).send({
          status: false,
          message: `${(error as Error).message}`,
        });
      }
      res.status(500).send({
        status: false,
        message: `Login failed. Try again later`,
      });
    }
  }
}
