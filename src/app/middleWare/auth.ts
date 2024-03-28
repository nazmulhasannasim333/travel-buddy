import { NextFunction, Request, Response } from "express";

import { JwtPayload, Secret } from "jsonwebtoken";

import httpStatus from "http-status";

import ApiError from "../errors/ApiError";
import Config from "../Config";
import { verifyToken } from "../modules/User/user.utils";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      const verifiedUser = verifyToken(token, Config.jwt.jwt_secret as Secret);

      req.user = verifiedUser as JwtPayload;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
