import { Router } from "express";
import { getValoraciones, getAks, createValoracion } from "src/controller";

export class ValoracionRouter {
  static get routes(): Router {
    const router = Router();
    router.post("/", createValoracion);

    router.get("/", getValoraciones);
    router.get("/asks", getAks);

    return router;
  }
}
