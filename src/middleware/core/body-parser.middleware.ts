import { Application, Request, Response, NextFunction, json, urlencoded } from "express";
import { IMiddleware } from "src/interface";

export class BodyParseMiddleware implements IMiddleware {
  constructor(private readonly _app: Application) {
    _app.use(json());
    _app.use(urlencoded({ extended: false }));
  }

  public intercept(_request: Request, _response: Response, next: NextFunction): void {
    next();
  }
}
