import { Router, Request, Response } from "express";
import { DatabaseService } from "../Services/databaseService";
import { authMiddleware, RequesWithuserId } from "../Middlewares/authMiddleware";
import { HoroscopeService } from "../Services/horoscopeService";
import { HoroscopeController } from "../Controller/horoscopeController";
const databaseService = new DatabaseService();
const horroscopeService = new HoroscopeService(databaseService);
const horoscopeController = new HoroscopeController(horroscopeService);
export const horoScopeRouter = Router();
horoScopeRouter.get(
  "/today",
  authMiddleware,
  async (req: Request, res: Response) => {
    const extendedReq = req as  RequesWithuserId;
    await horoscopeController.getPastHoroscope(extendedReq, res, 0);
  }
);
horoScopeRouter.get(
  "/history",
  authMiddleware,
  async (req: Request, res: Response) => {
    const extendedReq = req as RequesWithuserId;
    await horoscopeController.getPastHoroscope(extendedReq, res, 7);
  }
);
