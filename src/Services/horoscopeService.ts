import { horoscopeData } from "../dataStore";
import { DataBaseServiceInterface } from "../interfaces";

export class HoroscopeService {
  private dataBaseService: DataBaseServiceInterface;
  constructor(dataBaseService: DataBaseServiceInterface) {
    this.dataBaseService = dataBaseService;
  }
  async getPastHoroscope(userid: string, numberOfDays: number) {
    try {
      if (!userid) {
        return {
          status: 400,
          success: false,
          message: "User ID is required.",
        };
      }
      const resultFromHistoryTable =
        await this.dataBaseService.getFromHoroscopeHistory(
          userid as string,
          numberOfDays
        );
      if (
        resultFromHistoryTable?.success &&
        resultFromHistoryTable.horoscopeReading.length > 0
      ) {
        return {
          status: 200,
          success: true,
          horoscopeReading: resultFromHistoryTable.horoscopeReading,
        };
      }
      if (numberOfDays == 0) {
        const userDetailsData = await this.dataBaseService.getUserDetails({
          identifier: userid as string,
          columnName: "user_id",
        });
        if (
          !userDetailsData?.success ||
          userDetailsData.userDetails.length === 0
        ) {
          return {
            status: 404,
            success: false,
            message: "User details not found.",
          };
        }
        const usersZodiacSign = userDetailsData.userDetails[0].user_zodiac;
        const todaysReading = horoscopeData[usersZodiacSign];
        const insertToHistory =
          await this.dataBaseService.insertToHoroscopeHistory(
            userid as string,
            todaysReading,
            usersZodiacSign
          );
        if (!insertToHistory?.success) {
          throw new Error("Failed to insert to history table");
        }
        return {
          status: 200,
          success: true,
          horoscopeReading: [
            { date:new Date().toISOString(),
              horoscope: todaysReading,
            },
          ],
        };
      }
      return {
        status: 400,
        success: false,
        horoscopeReading: [],
      };
    } catch (error) {
      console.error("Error in getTodaysHoroscope:", error);
      if ((error as any).statusCode === 400) {
        return {
          status: 400,
          success: false,
          message: `${(error as Error).message}`,
        };
      }
      return {
        status: 500,
        success: false,
        message: "An error occured.Please try later.",
      };
    }
  }
}


