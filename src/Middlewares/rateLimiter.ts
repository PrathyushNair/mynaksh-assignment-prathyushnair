import { Request, Response, NextFunction } from "express";
export class RateLimiter {
  private totalAllowedAttempts: number;
  private thresholdTime: number;
  private userMap = new Map<
    string,
    {
      userAttempts: number;
      startTime: number;
    }
  >();
  constructor(totalAllowedAttempts: number, thresholdTime: number) {
    this.totalAllowedAttempts = totalAllowedAttempts;
    this.thresholdTime = thresholdTime;
  }

  isAllowed =(req: Request, res: Response, next: NextFunction)=>{
    try {
      const userKey = req.body.email;
      const userData = this.userMap.get(userKey);
      if (!userData) {
        this.userMap.set(userKey, { userAttempts: 1, startTime: Date.now() });
         setTimeout(() => this.userMap.delete(userKey), this.thresholdTime);
        return next();
      }
      const { userAttempts, startTime } = userData;
      let lastAttemptTime = Date.now() - startTime;
      if (lastAttemptTime > this.thresholdTime) {
        this.userMap.set(userKey, { userAttempts: 1, startTime: Date.now() });
        return next();
      }
      if (userAttempts < this.totalAllowedAttempts) {
        this.userMap.set(userKey, {
          userAttempts: userAttempts + 1,
          startTime,
        });
        return next();
      }
      const tryAgainTime = this.thresholdTime - lastAttemptTime;
      return res.status(429).json({
        success: false,
        message: `Rate limit exceeded. Try again in ${Math.ceil(
          tryAgainTime / 1000
        )} seconds.`,
      });
    } catch (error) {}
  }
  getMetaData=(userKey: string)=>{
    const userData = this.userMap.get(userKey);
    if (!userData) {
      throw new Error("No user data found from ratelimiting cache");
    }
    const attemptsRemaining = Math.max(
      this.totalAllowedAttempts - userData.userAttempts,
      0
    );
    const elapsedTime = Date.now() - userData.startTime;
    const tryAgainAfter = Math.max(this.thresholdTime - elapsedTime, 0);
    return {
      attemptsRemaining,
      tryAgainAfter,
    };
  }
}
