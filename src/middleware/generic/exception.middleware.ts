import { Application, NextFunction, Request, Response } from "express";
import { CustomError } from "src/model";

export const ExceptionHandlerMiddleware = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({ statusCode, message });
  next();
};
