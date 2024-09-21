import { Router } from "express";

import { AuthRouter } from "src/routes/auth.routing";
import { ForumRouter } from "src/routes/forum.routing";
import { ReplyRouter } from "src/routes/reply.routing";
import { EventRouting } from "src/routes/event.routing";
import { IncidentRouter } from "src/routes/incident.routing";
import { NotificationRouter } from "src/routes/notification.routing";

export class MainRouter {
  static get routes(): Router {
    const router = Router();

    router.use("/api/auth", AuthRouter.routes);
    router.use("/api/forum", ForumRouter.routes);
    router.use("/api/reply", ReplyRouter.routes);
    router.use("/api/event", EventRouting.routes);
    router.use("/api/incident", IncidentRouter.routes);
    router.use("/api/notification", NotificationRouter.routes);

    return router;
  }
}
