import pkg from "pg";
const { Pool } = pkg;
import fs from "fs";
import path from "path";
import { DataBaseServiceInterface } from "../interfaces";

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
}


