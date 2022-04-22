// import { Reflect } from "./domainTypes.ts";
// import { Reflect } from "./domainTypes.ts";

// enum EndpointStatus {
//   Idle = "IDLE",
//   Active = "ACTIVE",
// }

// type PassiveEndpoint = {
//   status: EndpointStatus;
//   httpStatus: number;
//   uri: string;
//   reflectionPattern: Record<string, Reflect["ReflectionPattern"]>;
// };
// type PassiveEndpointRequest = {
//   uri: string;
//   body: Record<string, unknown>;
// };
// type PersistCtx = {
//   endpoints: PassiveEndpoint[];
// };

// /** In memory persistence function through mutable context:
//  * ```ts
//  * const persist = passiveEndpointPersistance({ endpoints: []})
//  * persist.add({..})
//  * ```
//  */
// const passiveEndpointPersistance = (persist: PersistCtx) => {
//   // internals
//   const findByUri = (uri: string) =>
//     persist.endpoints.find((pe) => pe.uri === uri);

//   // external api
//   return ({
//     add: (ep: PassiveEndpointRequest) => {
//       const reflectionPattern = reflect(ep.body);
//       const newPassiveEndpoint: PassiveEndpoint = {
//         reflectionPattern,
//         status: EndpointStatus.Idle,
//         httpStatus: 200,
//         uri: ep.uri,
//       };
//       persist.endpoints = [...persist.endpoints, newPassiveEndpoint];
//     },
//     setStatus: (uri: string, status: EndpointStatus) => {
//       const passiveEndpoint = findByUri(uri);
//       if (passiveEndpoint) {
//         passiveEndpoint.status = status;
//       }
//     },
//     setTimeout: (uri: string) => true,
//     delete: (ep: PassiveEndpoint) => {
//       const index = persist.endpoints.findIndex((obj) => obj.uri === ep.uri);
//       if (index > -1) {
//         persist.endpoints.splice(index, 1);
//       }
//     },
//     setHttpStatus: (uri: string, httpStatus: number) => {
//       const passiveEndpoint = findByUri(uri);
//       if (passiveEndpoint) {
//         passiveEndpoint.httpStatus = httpStatus;
//       }
//     },
//     rebornHttp: () => true,
//   });
// };

// /** Reflect object properties data types by recursion */
// // export const reflect = (
// //   data: Record<string, unknown>,
// //   reflected: Record<string, Reflect["ReflectionPattern"]> = {},
// // ) => {
// //   Object.entries(data).map(([key, value]) => {
// //     // recrusive calls with objects & arrays
// //     if (refinements.isObject(value)) {
// //       return reflect(value, reflected);
// //     } else if (refinements.isArray(value)) {
// //       return value.forEach((sub) => reflect(sub, reflected));
// //     } // rewrite key values to custom reflection pattern as dateString, numberString..
// //     else if (refinements.isNumber(value)) {
// //       reflected[key] = REFLECTION_PATTERN.NUMBER;
// //     } else if (refinements.isNumberString(value)) {
// //       reflected[key] = REFLECTION_PATTERN.NUMBER_STRING;
// //     } else if (refinements.isDateString(value)) {
// //       reflected[key] = REFLECTION_PATTERN.DATE_STRING;
// //     } else if (refinements.isString(value)) {
// //       reflected[key] = REFLECTION_PATTERN.STRING;
// //     } else {
// //       reflected[key] = REFLECTION_PATTERN.UNKNOWN;
// //     }
// //   });
// //   return reflected;
// // };

// // const toCtxResponse = (data: Record<string, unknown>) =>
// //   (ctx: OakCtx) => {
// //     ctx.response.body = reflect(data);
// //   };

// // const registerEndpoint = (router: oakRouter<Record<string, any>>) =>
// //   async (postCtx: OakCtx) => {
// //     const body = postCtx.request.body({ type: "json" });
// //     const bodyValue = await body.value;
// //     router.get("/pes", toCtxResponse(bodyValue));
// //   };

// // const isNumber = (val: unknown): val is number => typeof val === "number";
// // const isString = (val: unknown): val is string => typeof val === "string";
// // const isObject = (val: unknown): val is Record<string, unknown> =>
// //   typeof val === "object";
// // const isArray = (val: unknown): val is Record<string, unknown>[] =>
// //   Array.isArray(val);
// // const isDateString = (val: unknown) => isString(val) && !isNaN(Date.parse(val));
// // const isNumberString = (val: unknown): val is string =>
// //   isString(val) && parseFloat(val) == val as unknown;

// // const refinements = {
// //   isNumber,
// //   isString,
// //   isObject,
// //   isArray,
// //   isDateString,
// //   isNumberString,
// // };

// export const register = {
//   register: registerEndpoint,
// };
