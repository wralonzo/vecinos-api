import morgan from "morgan";
import { Application, NextFunction, Request, Response } from "express";

import { LoggerClient } from "src/logger";
import { IMiddleware } from "src/interface";

export class LoggerMiddleware implements IMiddleware {
  private readonly _logger: LoggerClient;

  constructor(
    private readonly _app: Application,
    private readonly _log: LoggerClient,
  ) {
    this._logger = _log;
    _app.use(this.morgan());
    _app.use(this.intercept.bind(this));
  }

  public intercept(request: Request, response: Response, next: NextFunction) {
    next();
  }

  private morgan() {
    return morgan(
      (tokens, req: Request, res: Response) => {
        return JSON.stringify({
          method: tokens.method(req, res),
          url: tokens.url(req, res),
          status: Number.parseFloat(`${tokens.status(req, res)}`),
          content_length: tokens.res(req, res, "content-length"),
          response_time: Number.parseFloat(`${tokens["response-time"](req, res)}`),
          body: JSON.stringify(req.body),
        });
      },
      {
        stream: {
          write: (message) => {
            const data = JSON.parse(message);
            this._logger.http(`[HTTP] [INCOMING REQUEST] [${data?.url || ""}]`, data);
          },
        },
      },
    );
  }
}
