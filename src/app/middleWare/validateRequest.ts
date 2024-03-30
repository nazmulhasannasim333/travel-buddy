import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import httpStatus from "http-status";

const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorDetails = {
          issues: err.errors.map((error) => {
            let message = error.message;
            let requiredField = null;
            if (error.code === "invalid_type") {
              requiredField = error.path[error.path.length - 1];
              message = `${requiredField} field is required.`;
            }
            return {
              field: error.path.join("."),
              message,
            };
          }),
        };
        return res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: errorDetails.issues.map((issue) => issue.message).join(". "),
          errorDetails,
        });
      } else {
        return next(err);
      }
    }
  };
export default validateRequest;
