/// <reference lib="deno.worker" />

import { BroadcastWorker, Channel } from "./domainTypes.ts";
import { DeepNonNullable, NonNullableObject } from "./utilityTypes.ts";
import { config } from "./config.ts";
import { generators } from "./generators.ts";

console.log("broadcast worker started");

let state: ReturnType<typeof initWorkerState> | null = null;

const initWorkerState = (status: BroadcastWorker["Status"] = {
  state: "Initialized",
  options: {
    request: {},
    pattern: {},
    exact: false,
    schemaHash: null,
    url: "",
    perSec: 5,
    useProxy: false,
    errorize: {
      freq: 0,
      status: 500,
    },
    timeout: {
      freq: 0,
      status: 408,
    },
  },
  interval: null,
}) => {
  console.log("worker state initialized");

  return ({
    status,
    postMessage: (event: BroadcastWorker["ReceiveEvent"]) => {
      if (!refinements.isWorkerReady(status)) {
        if (refinements.isSet(event)) {
          status.options = {
            ...event.data.options,
            schemaHash: "",
          };
          status.state = "Ready";
          event.ports[0];
        } else {
          console.log("worker not ready");
        }
      } else {
        if (refinements.isModify(event)) {
          clearInterval(status.interval());

          const { options } = event.data;

          status.options = {
            ...status.options,
            url: options.url || status.options.url,
            perSec: options.perSec || status.options.perSec,
            useProxy: options.useProxy || status.options.useProxy,
            errorize: options.errorize
              ? {
                freq: options.errorize.freq || status.options.errorize.freq,
                status: options.errorize.status ||
                  status.options.errorize.status,
              }
              : status.options.errorize,
            timeout: options.timeout
              ? {
                freq: options.timeout.freq || status.options.timeout.freq,
                status: options.timeout.status || status.options.timeout.status,
              }
              : status.options.timeout,
          };

          const operationPort = event.ports[0];
          const broadcastPort = event.ports[1];

          operationPort.postMessage("bradcast worker command: modify");

          status.interval = applyInterval(broadcastPort, status.options);
          status.interval();
        } else if (isRun(event)) {
          const operationPort = event.ports[0];
          const broadcastPort = event.ports[1];

          operationPort.postMessage("broadcast worker command: run");

          status.interval = applyInterval(broadcastPort, status.options);

          status.interval();
        } else if (event.data.command === "Pause") {
          clearInterval(status.interval());
        } else {
          console.log("unknown command");
        }
      }
    },
  });
};

const applyInterval = (
  broadcastPort: Channel["BroadcastChannel"]["broadcastSenderPort"],
  options: NonNullableObject<BroadcastWorker["Status"]["options"]>,
) =>
  () =>
    setInterval(async () => {
      const response = await post(options);
      broadcastPort.postMessage("MESSAGE INTERVAL");
      broadcastPort.postMessage(response.status);
    }, 1000 / options.perSec);

const post = async (
  options: NonNullableObject<BroadcastWorker["Status"]["options"]>,
) => {
  const response = await fetch(
    options.useProxy
      ? `${config.PROXY_SERVER_URL}:${config.PROXY_SERVER_PORT}${config.PROXY_SERVER_MIRROR_PATH}`
      : options.url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    },
  );
  console.log(options.request);
  console.log(JSON.stringify(generators.generateJson(options.request)));
  return response;
};

self.onmessage = async <Command extends BroadcastWorker["Receive"]>(
  e: MessageEvent<Command>,
) => {
  if (isSet(e)) {
    state = initWorkerState({
      state: "Ready",
      options: { ...e.data.options, schemaHash: "" },
      interval: null,
    });
    state.postMessage(e);
  } else {
    if (state && refinements.isWorkerReady(state.status)) {
      state.postMessage(e);
    } else {
      console.log(
        `unsupported command "${e.data.command}" for uninitialized worker`,
      );
    }
  }
};

const isSet = (
  e: BroadcastWorker["ReceiveEvent"],
): e is BroadcastWorker["SetEvent"] => {
  return e.data.command === "Set";
};

const isModify = (
  e: BroadcastWorker["ReceiveEvent"],
): e is BroadcastWorker["ModifyEvent"] => {
  return e.data.command === "Modify";
};

const isRun = (
  e: BroadcastWorker["ReceiveEvent"],
): e is BroadcastWorker["RunEvent"] => {
  return e.data.command === "Run";
};

const isWorkerReady = (
  status: BroadcastWorker["Status"],
): status is DeepNonNullable<BroadcastWorker["Status"]> => {
  return status.state === "Ready";
};

const refinements = {
  isSet,
  isModify,
  isRun,
  isWorkerReady,
};
