import pkg from "pg";
const { Pool } = pkg;
import fs from "fs";
import path from "path";
import { DataBaseServiceInterface } from "../interfaces";
import { DbTables } from "../enums";
export class DatabaseService implements DataBaseServiceInterface {
  private static pool: pkg.Pool | null = null;
  constructor() {}
  public getDbPool(): pkg.Pool {
    if (!DatabaseService.pool) {
      DatabaseService.pool = new Pool({
        user: "postgres",
        host: "localhost",
        database: "horoscope",
        password: "helloworld",
        port: 5432,
      });
    }
    return DatabaseService.pool;
  }
  public async checkIfDbConnected() {
    try {
      const dbPool = this.getDbPool();
      const result = await dbPool.query("SELECT NOW()");
      if (result.rows[0]) {
        return { dbConnected: true, poolInstance: dbPool };
      } else {
        return { dbConnected: false, poolInstance: null };
      }
    } catch (error) {
      throw new Error(
        `Error when checking DB connection:${(error as Error).message}`
      );
    }
  }
  private async extractAllDbScripts() {
    try {
      const dbScriptsDir = path.join(
        __dirname,
        "..",
        "..",
        "db-scripts"
      );
      const sqlFiles = fs.readdirSync(dbScriptsDir);
      return { sqlFiles, dbScriptsDir };
    } catch (error) {
      throw new Error(
        `Error in DB script extraction: ${(error as Error).message}`
      );
    }
  }
  public async executeDbScripts() {
    try {
      const pool = this.getDbPool();
      const { sqlFiles, dbScriptsDir } = await this.extractAllDbScripts();
      for (let file of sqlFiles) {
        if (file.endsWith(".sql")) {
          const sqlScript = fs.readFileSync(
            path.join(dbScriptsDir, file),
            "utf-8"
          );
          let initResult = await pool.query(sqlScript);
          if (initResult) {
            console.log(`Executed ${file} successfully`);
          } else {
            console.warn(`Execution of ${file} returned no result`);
            return {
              success: false,
              message: `Execution of ${file} returned no result.`,
            };
          }

          return {
            success: true,
            message: "All scripts executed successfully.",
          };
        }
      }
    } catch (error) {
      throw new Error(
        `Error while executing DB scripts: ${(error as Error).message}`
      );
    }
  }
  public async getUserDetails({
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
  }> {
    try {
      const pool = this.getDbPool();
      const userDetails = await pool.query(
        `SELECT * FROM ${DbTables.USER_TABLE} WHERE ${columnName}=$1`,
        [identifier]
      );
      if (userDetails.rowCount) {
        return {
          success: true,
          userDetails: userDetails.rows,
        };
      } else {
        return {
          success: false,
          userDetails: [],
        };
      }
    } catch (error) {
      throw new Error(
        `Error occured when getting userDetails: ${(error as Error).message}`
      );
    }
  }
  public async insertUserDetails(userDetails: {
    userName: string;
    userEmail: string;
    userPassword: string;
    userBirthdate: string;
    userZodiacSign: string;
  }) {
    try {
      const pool = this.getDbPool();
      const {
        userName,
        userEmail,
        userPassword,
        userBirthdate,
        userZodiacSign,
      } = userDetails;
      const insertionResult = await pool.query(
        `INSERT INTO ${DbTables.USER_TABLE} (user_name,user_email,user_password,user_birthdate,user_zodiac) VALUES ($1, $2, $3, $4, $5)`,
        [userName, userEmail, userPassword, userBirthdate, userZodiacSign]
      );
      if (insertionResult.rowCount !== 1) {
        return {
          success: false,
        };
      }
      return {
        success: true,
      };
    } catch (error) {
      throw new Error(
        `Error when inserting userDetails: ${(error as Error).message}`
      );
    }
  }
  public async storeRefreshToken(userId: string, refreshToken: string) {
    try {
      const pool = this.getDbPool();
      const insertionResult = await pool.query(
        `INSERT INTO ${DbTables.REFRESH_TOKEN_TABLE} (user_id,refresh_token) VALUES ($1,$2)`,
        [userId, refreshToken]
      );
      if (insertionResult.rowCount !== 1) {
        return {
          success: false,
        };
      }
      return {
        success: true,
      };
    } catch (error) {
      throw new Error(
        `Error when inserting refresh token table: ${(error as Error).message}`
      );
    }
  }
  public async insertToHoroscopeHistory(
    userId: string,
    todaysReading: string,
    zodiacSign: string
  ) {
    try {
      const pool = this.getDbPool();
      const date = new Date().toISOString();
      const insertionResult = await pool.query(
        `INSERT INTO ${DbTables.HOROSCOPE_HISTORY_TABLE} (user_id,horoscope,horoscope_date,zodiac_sign) VALUES ($1,$2,$3,$4)`,
        [userId, todaysReading, date, zodiacSign]
      );
      if (insertionResult.rowCount !== 1) {
        return {
          success: false,
        };
      }
      return {
        success: true,
      };
    } catch (error) {
      throw new Error(
        `Error when inserting to horoscope history table: ${
          (error as Error).message
        }`
      );
    }
  }
  public async getFromHoroscopeHistory(userId: string, numberOfDays: number) {
    try {
      const pool = this.getDbPool();
      const query = `
  SELECT "horoscope","horoscope_date" as date FROM "user_horoscope_history"
  WHERE "user_id"=$1
  AND "horoscope_date" >= CURRENT_DATE - $2::integer
  ORDER BY "horoscope_date" DESC;
`;

      const values = [userId, numberOfDays];
      const horoscopeReading = await pool.query(query, values);
      if (horoscopeReading.rowCount) {
        return {
          success: true,
          horoscopeReading: horoscopeReading.rows,
        };
      } else {
        return {
          success: false,
          horoscopeReading: [],
        };
      }
    } catch (error) {
      throw new Error(
        `Error when fetching from horoscope history table: ${
          (error as Error).message
        }`
      );
    }
  }
}


