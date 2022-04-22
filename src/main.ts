import { log } from "./log.ts";
import { oakApp, OakCtx, oakRouter } from "../deps.ts";
import { config } from "./config.ts";
import { storage } from "./storage.ts";
import { activeEndpoint } from "./activeEndpoint.ts";

type LinkedChannel = {
  worker: Worker;
  senderPort: MessagePort;
  receiverPort: MessagePort;
};

const main = async () => {
  log.info("Lógr started.");

  const connections: Record<string, WebSocket> = {};

  const coreHttpServer = initHttpApp(config.CORE_HTTP_SERVER_PORT);
  const proxyServer = initHttpApp(config.PROXY_SERVER_PORT);

  const activeEndpointPersistence = activeEndpoint.persistence(null)({
    endpoints: [],
  });

  activeEndpointPersistence.reloadFromStorage();

  coreHttpServer.router.get("/", (ctx: OakCtx) => {
    ctx.response.body = "Received a GET HTTP method";
  });

  proxyServer.router.post(config.PROXY_SERVER_MIRROR_PATH, (ctx: OakCtx) => {
    ctx.response.body = "Received a POST HTTP method";
  });

  coreHttpServer.router.post("/registerEndpoint", async (ctx: OakCtx) => {
    // await register.register(coreHttpServer.router)(ctx);
    // console.log("return");
    // const { worker, senderPort, receiverPort } = spawnLinkedChannel(
    //   config.BROADCAST_WORKER_URL,
    // );
    // // const { port1: senderPort, port2: receiverPort } = new MessageChannel()

    // receiverPort.onmessage = async (e) => {
    //   console.log("port2");
    //   console.log(e.data);
    // };
    // worker.onmessage = async (e) => {
    //   console.log("port2");
    //   console.log(e.data);
    // };

    // ///
    // // overload to
    // worker.postMessage({}, [senderPort]);

    // ctx.response.body = "ugh";
  });

  coreHttpServer.router.get(
    "/storage",
    async (ctx: OakCtx) => {
      const store = await storage.loadStorage();

      ctx.response.body = JSON.stringify(store);
    },
  );

  coreHttpServer.router.post(
    "/activeEndpoint/register",
    async (ctx: OakCtx) => {
      const body = ctx.request.body({ type: "json" });
      const bodyValue = await body.value;

      const id = await activeEndpointPersistence.add(bodyValue);

      ctx.response.body = id;
    },
  );

  coreHttpServer.router.post("/activeEndpoint/command", async (ctx: OakCtx) => {
    const body = ctx.request.body({ type: "json" });
    const bodyValue = await body.value;

    const endpoint = activeEndpointPersistence.findById(bodyValue.id);

    if (!endpoint) {
      ctx.response.status = 404;
      ctx.response.body = "Endpoint not found";
      return;
    }

    await activeEndpointPersistence.execCommand(bodyValue.id, bodyValue);

    ctx.response.status = 200;
    ctx.response.body = "Command executed";
    return;
  }),
    coreHttpServer.router.get("/ws", (ctx: OakCtx) => {
      const socket = ctx.upgrade();
      const uid: string = crypto.randomUUID();
      connections[uid] = socket;

      socket.onopen = () => {
        console.log(Object.getOwnPropertyNames(connections));
      };
    });

  coreHttpServer.app.use(coreHttpServer.router.routes());

  coreHttpServer.app.use(coreHttpServer.router.allowedMethods());
  // coreHttpServer.app.use(parseJSON)
  // coreHttpServer.app.use(allowCORS)

  proxyServer.app.use(proxyServer.router.routes());

  proxyServer.app.use(proxyServer.router.allowedMethods());

  proxyServer.listen();

  coreHttpServer.listen();
};

const initHttpApp = (port: number) => {
  const app = new oakApp();
  const router = new oakRouter();
  return {
    port,
    app,
    router,
    listen: () => {
      console.log(`HTTP webserver running at:  http://localhost:${port}/`);
      return app.listen({ port });
    },
  };
};

export default main;
