import { Server } from "src/presentation";
import { MainRouter } from "src/routes";

(() => {
  main();
})();

async function main(): Promise<void> {
  new Server({
    routes: MainRouter.routes,
  }).start();
}
