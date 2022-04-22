import { NullableObject } from "./utilityTypes.ts";

export type Channel = {
  LinkedChannel: {
    worker: Worker;
    broadcastSenderPort: MessagePort;
    broadcastReceiverPort: MessagePort;
    operationSenderPort: MessagePort;
    operationReceiverPort: MessagePort;
  };
  OperationChannel: {
    operationSenderPort: MessagePort;
    operationReceiverPort: MessagePort;
  };
  BroadcastChannel: {
    broadcastSenderPort: MessagePort;
    broadcastReceiverPort: MessagePort;
  };
};

export type BroadcastWorker = {
  // commands applicable for interaction with the web worker
  Command: "Set" | "Modify" | "Run" | "Pause" | "Kill" | "Info";

  Status: {
    state: "Initialized" | "Ready" | "Running" | "Paused" | "Killed";
    interval: (() => ReturnType<typeof setInterval>) | null;
    options: BroadcastWorker["Options"];
  };

  Options: {
    request: Record<string, unknown>;
    pattern: Record<string, Reflect["ReflectionPattern"]>;
    exact: boolean;
    schemaHash: string | null;
    url: string;
    perSec: number;
    useProxy: boolean;
    errorize: {
      status: number;
      freq: number;
    } | null;
    timeout: {
      status: number;
      freq: number;
    } | null;
  };

  // common command type
  Receive: { command: BroadcastWorker["Command"] };

  // set command, used to initialize the worker and apply the options
  Set: BroadcastWorker["Receive"] & {
    command: "Set";
    options: Omit<BroadcastWorker["Options"], "schemaHash">;
  };

  Run: BroadcastWorker["Receive"] & {
    command: "Run";
    ports: readonly [
      Channel["OperationChannel"]["operationSenderPort"],
      Channel["BroadcastChannel"]["broadcastSenderPort"],
    ];
  };

  // modify command, used to modify the options of the worker
  Modify: BroadcastWorker["Receive"] & {
    command: "Modify";
    options: NullableObject<
      Omit<BroadcastWorker["Options"], "schemaHash" | "pattern" | "request">
    >;
  };

  ReceiveEvent: Omit<MessageEvent<BroadcastWorker["Receive"]>, "ports"> & {
    ports: readonly MessagePort[];
  };
  SetEvent: Omit<MessageEvent<BroadcastWorker["Set"]>, "ports"> & {
    ports: readonly [Channel["OperationChannel"]["operationSenderPort"]];
  };
  RunEvent: Omit<MessageEvent<BroadcastWorker["Run"]>, "ports"> & {
    ports: readonly [
      Channel["OperationChannel"]["operationSenderPort"],
      Channel["BroadcastChannel"]["broadcastSenderPort"],
    ];
  };
  ModifyEvent: Omit<MessageEvent<BroadcastWorker["Modify"]>, "ports"> & {
    ports: readonly [
      Channel["OperationChannel"]["operationSenderPort"],
      Channel["BroadcastChannel"]["broadcastSenderPort"],
    ];
  };
};

export type ActiveEndpoint = {
  EndpointStatus: "RUNNING" | "IDLE" | "ERROR";

  ActiveEndpointRequest: {
    options: BroadcastWorker["Options"];
  };

  ActiveEndpoint: {
    id: string;
    status: BroadcastWorker["Status"]["state"];
    worker: Worker;
    options: BroadcastWorker["Options"];
  };
};

export type Reflect = {
  ReflectionPattern:
    | "string"
    | "dateString"
    | "numberString"
    | "number"
    | "object"
    | "array"
    | "unknown"
    | "null"
    | "boolean";
  JsonReflection: Record<string, Reflect["ReflectionPattern"]>;
};

export type Storage = {
  Storage: { activeEndpoints: ActiveEndpoint["ActiveEndpoint"][] };
};
