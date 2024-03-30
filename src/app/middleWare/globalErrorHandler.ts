import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || "something went wrong",
    errorDetails: err,
  });
};

export default globalErrorHandler;
