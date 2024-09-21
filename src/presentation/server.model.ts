import express, { Application, Router } from "express";

import { PORT } from "src/configuration";

import { LoggerClient } from "src/logger";
import { MySQLDataSource } from "src/database";
import { ServerOptions } from "src/presentation";
import { SwaggerConfig, SwaggerOptions } from "src/documentation";
import {
  CorsMiddleware,
  LoggerMiddleware,
  BodyParseMiddleware,
  ExceptionHandlerMiddleware,
  CookieParserMiddleware,
} from "src/middleware";
import {
  AuthService,
  ForumService,
  ReplyService,
  EventService,
  EvidenceService,
  IncidentService,
  NotificationService,
} from "src/service";

export class Server {
  private readonly _port: string;
  private readonly _routes: Router;
  private readonly _app: Application;
  private readonly _docs: SwaggerConfig;
  private _datasource: MySQLDataSource;

  constructor(options: ServerOptions) {
    this._port = PORT;
    this._app = express();
    this._routes = options.routes;
    this._docs = new SwaggerConfig(SwaggerOptions);
    this._datasource = new MySQLDataSource();

    this._initMiddlewares();
    this._initDatabase();
    this._registerLocal();
    this._initRoutes();
  }

  private _initMiddlewares(): void {
    new CorsMiddleware(this._app);
    new BodyParseMiddleware(this._app);
    new CookieParserMiddleware(this._app);
    new LoggerMiddleware(this._app, new LoggerClient());
  }

  private _initRoutes(): void {
    this._app.use(this._routes);
    this._app.use("/uploads", express.static("data"));
    this._app.use("/api/docs", this._docs.serve(), this._docs.setup());
    this._app.use(ExceptionHandlerMiddleware);
  }

  private async _initDatabase(): Promise<void> {
    try {
      await this._datasource.connect();
      this._app.locals.datasource = this._datasource;
    } catch (error) {
      console.error(`${(error as Error).message}`);
    }
  }

  private async _registerLocal(): Promise<void> {
    this._app.locals.authService = await new AuthService(this._datasource.client);
    this._app.locals.forumService = await new ForumService(this._datasource.client);
    this._app.locals.replyService = await new ReplyService(this._datasource.client);
    this._app.locals.eventService = await new EventService(this._datasource.client);
    this._app.locals.evidenceService = await new EvidenceService(this._datasource.client);
    this._app.locals.incidentService = await new IncidentService(this._datasource.client);
    this._app.locals.notificationService = await new NotificationService(this._datasource.client);
  }

  public async start(): Promise<void> {
    this._app.listen(this._port, () => {});
  }
}
