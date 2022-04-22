// import { Ws } from "./ws.ts";
// import { channel } from "./channel/channel.ts";
// import { ActiveEndpoint, BroadcastWorker } from "./domainTypes.ts";
// import { reflection } from "./reflection.ts";

// const persistence = (wsPersistance: Ws["socketPersistence"]) =>
//   (persist: { endpoints: ActiveEndpoint["ActiveEndpoint"][] }) => {
//     const findByUri = (uri: string) =>
//       persist.endpoints.find((pe) => pe.options.url === uri);

//     return ({
//       add: (ep: ActiveEndpoint["ActiveEndpointRequest"]) => {
//         const reflectionPattern = reflection.reflectJson(ep.options.pattern);
//         const { worker, senderPort, receiverPort } = channel.spawnLinkedChannel(
//           ep.options.url,
//         );

//         const msg: BroadcastWorker["Set"] = {
//           command: "Set",
//           options: {
//             ...ep.options,
//             pattern: reflectionPattern,
//           },
//         };

//         worker.postMessage(msg, [senderPort]);

//         const endpoint: ActiveEndpoint["ActiveEndpoint"] = {
//           status: "Initialized",
//           options: {
//             ...ep.options,
//             pattern: reflectionPattern,
//           },
//           linkedChannel: {
//             worker,
//             senderPort,
//             receiverPort,
//           },
//         };

//         persist.endpoints = [...persist.endpoints, endpoint];
//       },
//       execCommand: (
//         uri: string,
//         command:
//           | BroadcastWorker["Receive"]
//           | BroadcastWorker["Set"]
//           | BroadcastWorker["Modify"],
//       ) => {
//         const activeEndpoint = findByUri(uri);
//         if (activeEndpoint) {
//           activeEndpoint.linkedChannel.worker.postMessage(command, [
//             activeEndpoint.linkedChannel.senderPort,
//           ]);
//         }
//       },
//     });
//   };

// export const activeEndpoint = {
//   persistence,
// };
