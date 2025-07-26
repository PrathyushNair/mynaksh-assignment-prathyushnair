import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: envPath });

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "2d" });
}
export function generateAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
}
export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}
export function verifyAccessToken(token: string): {
  isValid: boolean;
  decodedToken: string | jwt.JwtPayload | null;
  error: string | Error;
} {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return {
      isValid: true,
      decodedToken: decoded,
      error: "",
    };
  } catch (error) {
    return {
      isValid: false,
      decodedToken: null,
      error: (error as Error).name,
    };
  }
}
