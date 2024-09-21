import { Request, Response, NextFunction } from "express";
import { CustomError } from "src/model";

export interface IMiddleware {
  intercept(
    request: Request,
    response: Response,
    next: NextFunction,
    exception?: CustomError,
  ): void | Response<unknown, Record<string, unknown>>;
}
