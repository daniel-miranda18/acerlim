import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { unauthorized } from "../utils/response";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err) {
        console.log("Auth Error:", err);
        return next(err);
      }

      if (!user) {
        return unauthorized(res, info?.message || "No autorizado");
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};
