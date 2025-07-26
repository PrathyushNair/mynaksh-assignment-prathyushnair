import { Response } from "express";

import { HoroscopeServiceInterface } from "../interfaces";
import { RequesWithuserId } from "../Middlewares/authMiddleware";


export class HoroscopeController {
  private horoscopeService: HoroscopeServiceInterface;
  constructor(horoscopeService: HoroscopeServiceInterface) {
    this.horoscopeService = horoscopeService;
  }
  async getPastHoroscope(
    req: RequesWithuserId,
    res: Response,
    numberOfDays: number
  ) {
    try {
      const userId = req.userId as string;
      const result = await this.horoscopeService.getPastHoroscope(
        userId,
        numberOfDays
      );
      res.status(result.status).send({
        success: result.success,
        message: result.message,
        horoscopeReading: result.horoscopeReading,
      });
    } catch (error) {
      console.error("Error in getTodaysHoroscope:", error);
      if ((error as any).statusCode === 400) {
        return res.status(400).send({
          status: false,
          message: `${(error as Error).message}`,
        });
      }
      res.status(500).send({
        success: false,
        message: "An error occured.Please try later.",
      });
    }
  }
}
