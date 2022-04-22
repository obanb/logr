import { Ws } from "./ws.ts";
import { channel } from "./channel.ts";
import { ActiveEndpoint, BroadcastWorker } from "./domainTypes.ts";
import { reflection } from "./reflection.ts";
import { storage } from "./storage.ts";

const persistence = (wsPersistance: Ws["socketPersistence"] | null) =>
  (persist: { endpoints: ActiveEndpoint["ActiveEndpoint"][] }) => {
    const findById = (id: string) =>
      persist.endpoints.find((pe) => pe.id === id);

    const add = (ep: ActiveEndpoint["ActiveEndpointRequest"], storageId?: string) => {
      const clone = structuredClone(ep.options.request);

      const reflectionPattern = reflection.reflectJson(clone);

      const broadcastWorker = channel.spawnBroadcastWorker();

      const { operationSenderPort, operationReceiverPort } = channel
        .spawnOperationChannel();

      operationReceiverPort.onmessage = async (e) => {
        console.log(
          "data from operation channel after add command: ",
          e.data,
        );
      };

      const msg: BroadcastWorker["Set"] = {
        command: "Set",
        options: {
          ...ep.options,
          pattern: reflectionPattern,
        },
      };

      broadcastWorker.postMessage(msg, [operationSenderPort]);

      const endpoint: ActiveEndpoint["ActiveEndpoint"] = {
        // when the endpoint is found in the storage, id already exists
        id: storageId ? storageId: crypto.randomUUID(),
        status: "Initialized",
        options: {
          ...ep.options,
          pattern: reflectionPattern,
        },
        worker: broadcastWorker,
      };

      persist.endpoints = [...persist.endpoints, endpoint];

      storage.saveActiveEndpoint(endpoint);

      return endpoint.id;
    };

    return ({
      findById,
      reloadFromStorage: async () => {
        const store = await storage.loadStorage();
        store.activeEndpoints.forEach((ep) => {
          add(ep, ep.id);
        });
      },
      add,
      execCommand: <Command extends BroadcastWorker["Receive"]>(
        id: string,
        command: Command,
      ) => {
        const activeEndpoint = findById(id);

        if (activeEndpoint) {
          const { operationSenderPort, operationReceiverPort } = channel
            .spawnOperationChannel();

          operationReceiverPort.onmessage = async (e) => {
            console.log(
              "data from operation channel after exec command: ",
              e.data,
            );
          };

          if (command.command === "Run" || command.command === "Modify") {
            const { broadcastSenderPort, broadcastReceiverPort } = channel
              .spawnBroadcastChannel();

            broadcastReceiverPort.onmessage = async (e) => {
              console.log(
                "data from operation channel after exec command: ",
                e.data,
              );
            };

            activeEndpoint.worker.postMessage(command, [
              operationSenderPort,
              broadcastSenderPort,
            ]);
          } else {
            activeEndpoint.worker.postMessage(command, [
              operationSenderPort,
            ]);
          }

          console.log("possilam 2");
        }
      },
    });
  };

export const activeEndpoint = {
  persistence,
};
