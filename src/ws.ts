/** In memory persistence function with socket storage
 * ```ts
 * const persist = socketPersistance()
 * persist.add({..})
 * ```
 */
const socketPersistence = () => {
  let sockets: Record<string, WebSocket>[] = [];
  return ({
    add: (uuid: string, ws: WebSocket) => {
      sockets = [...sockets, { [uuid]: ws }];
    },
    delete: (uuid: string) => {
      const index = sockets.findIndex((obj) => obj[uuid]);
      if (index > -1) {
        sockets.splice(index, 1);
      }
    },
  });
};

export const ws = {
  socketPersistence,
};

export type Ws = typeof ws;
