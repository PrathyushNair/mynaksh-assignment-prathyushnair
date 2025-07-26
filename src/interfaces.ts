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
}