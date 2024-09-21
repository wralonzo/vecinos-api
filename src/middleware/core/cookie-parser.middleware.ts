import cookieParser from "cookie-parser";
import { Application, NextFunction, Request, Response } from "express";
import { IMiddleware } from "src/interface";

export class CookieParserMiddleware implements IMiddleware {
  constructor(private readonly _app: Application) {
    _app.use(cookieParser());
  }

  public intercept(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void | Response<unknown, Record<string, unknown>> {
    next();
  }
}
