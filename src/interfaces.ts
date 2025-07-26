import pkg from "pg";
const { Pool } = pkg;

export interface DataBaseServiceInterface {
  checkIfDbConnected(): Promise<
    | {
        dbConnected: boolean;
        poolInstance: pkg.Pool;
      }
    | {
        dbConnected: boolean;
        poolInstance: null;
      }
  >;
  executeDbScripts(): Promise<
    | {
        success: boolean;
        message: string;
      }
    | undefined
  >;
  getUserDetails({
    identifier,
    columnName,
  }: {
    identifier: string;
    columnName: string;
  }): Promise<{
    success: boolean;
    userDetails: {
      user_id: string;
      user_name: string;
      user_email: string;
      user_password: string;
      user_birthdate: string;
      user_zodiac: string;
      created_at: Date;
      updated_at: Date;
    }[];
  }>;
  insertUserDetails(userDetails: {
    userName: string;
    userEmail: string;
    userPassword: string;
    userBirthdate: string;
    userZodiacSign: string;
  }): Promise<{
    success: boolean;
  }>;
  storeRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<{
    success: boolean;
  }>;
}


export interface AuthServiceInterface {
    signup({
      name,
      email,
      password,
      birthdate,
    }: {
      name: string;
      email: string;
      password: string;
      birthdate: string;
    }): Promise<{
      status: number;
      success: boolean;
      message: string;
    }>;
  
    login({ email, password }: { email: string; password: string }): Promise<
      | {
          status: number;
          success: boolean;
          message: string;
          accessToken?: undefined;
          refreshToken?: undefined;
        }
      | {
          status: number;
          success: boolean;
          accessToken: string;
          refreshToken: string;
          message?: undefined;
        }
    >;
  }