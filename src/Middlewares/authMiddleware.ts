import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwtUtils";
import { JwtPayload } from "jsonwebtoken";
export interface RequesWithuserId extends Request {
  userId: string | JwtPayload | undefined;
}
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }
    const token = authHeader.split(" ")[1];
    const {isValid,decodedToken,error} = verifyAccessToken(token);

    if (!isValid) {
        if (error === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            message: "Session expired. Please log in again.",
          });
        }
  
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid token",
        });
      }
    if (isValid && typeof decodedToken === 'object' && decodedToken !== null) {
        (req as RequesWithuserId).userId=decodedToken?.userId
      next();
    }
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "An error occured.Please try later." });
  }
}
