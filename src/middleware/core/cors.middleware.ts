import cors from "cors";
import { Application, Request, Response, NextFunction } from "express";

import { IMiddleware } from "src/interface";
import { ALLOWED_ORIGINS } from "src/configuration";
import { CustomError } from "src/model";

export class CorsMiddleware implements IMiddleware {
  constructor(private readonly _app: Application) {
    _app.use(this.intercept.bind(this));
  }

  public intercept(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void | Response<unknown, Record<string, unknown>> {
    const corsOptions = {
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void,
      ) => {
        if (!origin || ALLOWED_ORIGINS.includes("*") || ALLOWED_ORIGINS.includes(origin)) {
          return callback(null, true);
        }

        return callback(new CustomError(403, "Forbidden"));
      },
    };

    cors(corsOptions)(request, response, next);
  }
}
