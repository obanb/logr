import { Channel } from "./domainTypes.ts";
import { config } from "./config.ts";

const spawnLinkedChannel = (url: string): Channel["LinkedChannel"] => {
  const worker = new Worker(new URL(url, import.meta.url).href, {
    type: "module",
  });
  const { port1: broadcastSenderPort, port2: broadcastReceiverPort } =
    new MessageChannel();
  const { port1: operationSenderPort, port2: operationReceiverPort } =
    new MessageChannel();
  return {
    worker,
    broadcastSenderPort,
    broadcastReceiverPort,
    operationSenderPort,
    operationReceiverPort,
  };
};

const spawnOperationChannel = (): Channel["OperationChannel"] => {
  const { port1: operationSenderPort, port2: operationReceiverPort } =
    new MessageChannel();
  return { operationSenderPort, operationReceiverPort };
};

const spawnBroadcastChannel = (): Channel["BroadcastChannel"] => {
  const { port1: broadcastSenderPort, port2: broadcastReceiverPort } =
    new MessageChannel();
  return { broadcastSenderPort, broadcastReceiverPort };
};

const spawnBroadcastWorker = (
  url: string = config.BROADCAST_WORKER_URL,
): Worker => {
  const worker = new Worker(new URL(url, import.meta.url).href, {
    type: "module",
  });

  return worker;
};

const applyChannelEvents = <Receive, Broadcast>(
  channel: Channel["LinkedChannel"],
  options: {
    receiverCallback: (e: MessageEvent<unknown>) => Receive;
    broadcastCallback: (e: MessageEvent<unknown>) => Broadcast;
  },
) => {
  channel.broadcastReceiverPort.onmessage = (e) => {
    options.receiverCallback(e);
  };
  channel.worker.onmessage = (e) => {
    options.broadcastCallback(e);
  };
};

export const channel = {
  spawnLinkedChannel,
  applyChannelEvents,
  spawnBroadcastWorker,
  spawnOperationChannel,
  spawnBroadcastChannel,
};
