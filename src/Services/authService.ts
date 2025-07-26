import { DataBaseServiceInterface } from "../interfaces";
import {
  validateSignUpDetails,
  validateLoginDeteils,
} from "../utils/joiValidation";

import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtils";
import { getZodiacSign } from "../utils/getZodiacSign";
export class AuthService {
  private databaseService: DataBaseServiceInterface;
  constructor(databaseService: DataBaseServiceInterface) {
    this.databaseService = databaseService;
  }
  async signup({
    name,
    email,
    password,
    birthdate,
  }: {
    name: string;
    email: string;
    password: string;
    birthdate: string;
  }) {
    try {
      await validateSignUpDetails({ name, email, password, birthdate });
      const userDetails = await this.databaseService.getUserDetails({
        identifier: email,
        columnName: "user_email",
      });
      if (userDetails.success) {
        return {
          status: 400,
          success: false,
          message: "User already exists.",
        };
      } else {
        const userZodiacSign = getZodiacSign(birthdate);
        const hashedPassword = await bcrypt.hash(password, 10);
        const insert = await this.databaseService.insertUserDetails({
          userName: name,
          userEmail: email,
          userPassword: hashedPassword,
          userBirthdate: birthdate,
          userZodiacSign,
        });
        if (insert.success) {
          return {
            status: 200,
            success: true,
            message: "User signed up successfully.",
          };
        } else {
          throw new Error("Failed to insert user.");
        }
      }
    } catch (error) {
      console.log("Error from signup:", (error as Error).message);
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
        message: `Signup failed. Try again later`,
      };
    }
  }
  async login({ email, password }: { email: string; password: string }) {
    try {
      await validateLoginDeteils({ email, password });
      const data = await this.databaseService.getUserDetails({
        identifier: email,
        columnName: "user_email",
      });
      if (!data.success) {
        return {
          status: 400,
          success: false,
          message: "Invalid credentials.",
        };
      }
      const storedPassword = data.userDetails[0].user_password;
      const passwordMatch = await bcrypt.compare(password, storedPassword);
      if (!passwordMatch) {
        return { status: 400, success: false, message: "Invalid credentials" };
      }
      const userId = data.userDetails[0].user_id;
      const accessToken = generateAccessToken({ userId: userId });
      const refreshToken = generateRefreshToken({ userId: userId });
      await this.databaseService.storeRefreshToken(userId, refreshToken);
      return {
        status: 200,
        success: true,
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      console.log("Error from login:", (error as Error).message);
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
        message: `Login failed. Try again later`,
      };
    }
  }
}
