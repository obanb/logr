import { ActiveEndpoint, Storage } from "./domainTypes.ts";
import { config } from "./config.ts";

const loadStorage = async (): Promise<Storage["Storage"]> => {
  try {
    return JSON.parse(await Deno.readTextFile(config.STORAGE_JSON));
  } catch (e) {
    throw new Error("error while reading storage", e);
  }
};

const clearStorage = async () => {
    try {
        await Deno.writeTextFile(config.STORAGE_JSON, JSON.stringify({activeEndpoints: [], passiveEndpoints: []}));
    } catch (e) {
        throw new Error("error while clearing storage", e);
    }
}

const saveActiveEndpoint = async (ep: ActiveEndpoint["ActiveEndpoint"]) => {
  const storage = await loadStorage();
  storage.activeEndpoints.push(ep);
  try {
    await Deno.writeTextFile(config.STORAGE_JSON, JSON.stringify(storage));
  } catch (e) {
    throw new Error("error while saving ActiveEndpoint");
  }
};

const deleteActiveEndpoint = async (id: string) => {
  const storage = await loadStorage();
  storage.activeEndpoints = storage.activeEndpoints.filter((ep) =>
    ep.id !== id
  );
  try {
    await Deno.writeTextFile(config.STORAGE_JSON, JSON.stringify(storage));
  } catch (e) {
    throw new Error("error while deleting ActiveEndpoint");
  }
};

export const storage = {
  loadStorage,
  clearStorage,
  saveActiveEndpoint,
  deleteActiveEndpoint,
};
