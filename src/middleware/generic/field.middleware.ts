import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { STATUS_CODE } from "src/enums";
import { FieldValidationError } from "src/types";

export const validateFields = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const uniqueErrors: FieldValidationError[] = [];
  errors.array().forEach((error) => {
    if (!uniqueErrors.some((uniqueError) => uniqueError.field === error.param)) {
      uniqueErrors.push({
        field: error.param,
        message: error.msg,
      });
    }
  });

  return res.status(STATUS_CODE.UNPROCESSABLE).json({
    errors: uniqueErrors,
  });
};
