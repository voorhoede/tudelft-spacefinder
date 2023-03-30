import fs from "node:fs/promises";
import type { BuildingI18n } from "../types/Building";
import { RoomI18n, SpaceI18n } from "../types/Space";

let buildings: BuildingI18n[] | undefined;
let spaces: SpaceI18n[] | undefined;
let rooms: RoomI18n[] | undefined;

async function readJson(fileName: string) {
  const text = await fs.readFile(fileName, "utf8");
  return JSON.parse(text);
}

export async function loadBuildings(): Promise<BuildingI18n[]> {
  if (!buildings) buildings = await readJson("./src/data/buildings.json");
  return buildings!;
}

export async function loadSpaces(): Promise<SpaceI18n[]> {
  if (!spaces) spaces = await readJson("./src/data/spaces.json");
  return spaces!;
}

export async function loadRooms(): Promise<RoomI18n[]> {
  if (!rooms) rooms = await readJson("./src/data/rooms.json");
  return rooms!;
}
