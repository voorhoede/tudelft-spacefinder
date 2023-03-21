import { defineStore, skipHydrate } from "pinia";
import { spaceFilter } from "~/lib/filter-spaces";
import type { BuildingI18n } from "~/types/Building";
import type { Filters } from "~/types/filters";
import type { Space, SpaceI18n } from "~/types/Space";
import calculateOccupancy from "../lib/calculate-occupancy";
import { Room, RoomI18n } from "~/types/Room";
import { useMapStore } from "./map";

export type Selection =
  | {
      level: "building";
      buildingSlug: string;
    }
  | {
      level: "space";
      spaceSlug: string;
    }
  | undefined;

export const useSpacesStore = defineStore("spaces", () => {
  const currentSelection = ref<Selection>(undefined);

  const currentSpace = computed(() =>
    currentSelection.value && currentSelection.value.level == "space"
      ? getSpaceBySlug(currentSelection.value.spaceSlug)
      : undefined
  );

  const currentBuilding = computed(() =>
    currentSelection.value
      ? currentSelection.value.level == "building"
        ? getBuildingBySlug(currentSelection.value.buildingSlug)
        : currentSpace.value?.building
      : undefined
  );

  const defaultFilters: Filters = {
    buildingOccupancy: [],
    adjustableChairs: false,
    buildings: [],
    daylit: false,
    ethernet: false,
    studyType: [],
    nearBathroom: false,
    nearCoffeeMachine: false,
    nearPrinter: false,
    powerOutlets: false,
    presentationScreen: false,
    quietness: [],
    showOpenLocations: false,
    smartBoard: false,
    stationaryPC: false,
    whiteBoard: false,
  };

  const filters = useLocalStorage("filters", defaultFilters, {
    mergeDefaults: true,
  });
  const runtimeConfig = useRuntimeConfig();
  // To not get a filter applied without the user knowing
  if (!runtimeConfig.public.isOpeningHoursEnabled)
    filters.value.showOpenLocations = false;

  function clearFilters() {
    filters.value = defaultFilters; //TODO: check if Vue3 reactivity works like that
  }

  const buildingsI18n = ref([] as BuildingI18n[]);

  function setBuildings(buildings: BuildingI18n[]) {
    function compareByNumber(a: BuildingI18n, b: BuildingI18n) {
      if (a.number > b.number) return 1;
      if (a.number < b.number) return -1;
      return 0;
    }
    buildingsI18n.value = [...buildings].sort(compareByNumber);
  }

  function bulkSetBuildingOccupancy(data: Record<number, number>) {
    const mapStore = useMapStore();
    buildingsI18n.value = buildingsI18n.value.map((building) => {
      const activeDevices = data[building.number];
      const occupancy = calculateOccupancy(activeDevices, building.totalSeats);
      return { ...building, activeDevices, occupancy };
    });
    mapStore.updateData();
  }

  function setBuildingOccupancy(buildingNumber: number, activeDevices: number) {
    const building = getBuildingI18nByNumber(buildingNumber);
    if (building) {
      building.activeDevices = activeDevices;
      building.occupancy = calculateOccupancy(
        activeDevices,
        building.totalSeats
      );
      const mapStore = useMapStore();
      mapStore.updateData();
    }
  }

  const buildings = computed(() => {
    const { $locale } = useNuxtApp();
    return buildingsI18n.value.map((buildingI18n) => {
      const i18nProps = buildingI18n.i18n[$locale.value];
      return {
        ...buildingI18n,
        ...i18nProps,
      };
    });
  });

  const roomsI18n = ref([] as RoomI18n[]);

  function setRooms(rooms: RoomI18n[]) {
    roomsI18n.value = rooms;
  }

  function bulkSetRoomsOccupancy(data: Record<number, Record<string, number>>) {
    roomsI18n.value = roomsI18n.value.map((room) => {
      return {
        ...room,
        activeDevices: data[room.buildingNumber]?.[room.realEstateNumber],
      };
    });
  }

  function setRoomOccupancy(realEstateNumber: string, activeDevices: number) {
    const room = getSpaceBySlug(realEstateNumber); //TODO
    if (room) room.activeDevices = activeDevices;
  }

  const spacesI18n = ref([] as SpaceI18n[]);

  function setSpaces(spaces: SpaceI18n[]) {
    spacesI18n.value = spaces;
  }

  function bulkSetSpaceOccupancy(data: Record<number, Record<string, number>>) {
    spacesI18n.value = spacesI18n.value.map((space) => {
      return {
        ...space,
        activeDevices: data[space.buildingNumber]?.[space.roomId],
      };
    });
  }

  function setSpaceOccupancy(
    buildingNumber: number,
    roomId: string,
    activeDevices: number
  ) {
    const space = getSpaceI18nByBuildingAndRoom(buildingNumber, roomId);
    if (space) space.activeDevices = activeDevices;
  }

  const spaces = computed(() => {
    const { $locale } = useNuxtApp();
    if (runtimeConfig.public.spacesMode == "rooms")
      return roomsI18n.value.map((roomI18n) => {
        const propsI18n = roomI18n.i18n[$locale.value];
        const building = getBuildingByNumber(roomI18n.buildingNumber);
        return {
          ...roomI18n,
          ...propsI18n,
          slug: roomI18n.realEstateNumber,
          building,
        } as Room;
      }) as (Room | Space)[];
    else
      return spacesI18n.value.map((spaceI18n) => {
        const propsI18n = spaceI18n.i18n[$locale.value];
        const building = getBuildingByNumber(spaceI18n.buildingNumber);
        return {
          ...spaceI18n,
          ...propsI18n,
          building,
        } as Space;
      }) as (Room | Space)[];
  });

  const filteredSpaces = computed(() =>
    spaceFilter(spaces.value, filters.value)
  );

  const isFiltered = computed(
    () => filteredSpaces.value.length < spaces.value.length
  );

  function getBuildingByNumber(number: number) {
    return buildings.value.find((building) => building.number === number);
  }

  function getBuildingI18nByNumber(number: number) {
    return buildingsI18n.value.find((building) => building.number === number);
  }

  function getBuildingBySlug(slug: string) {
    return buildings.value.find((building) => building.slug === slug);
  }

  function getSpaceBySlug(slug: string) {
    return spaces.value.find((space) => space.slug === slug);
  }

  function getSpaceI18nByBuildingAndRoom(
    buildingNumber: number,
    roomId: string
  ) {
    return spacesI18n.value.find(
      (space) =>
        space.buildingNumber === buildingNumber && space.roomId === roomId
    );
  }

  return {
    currentSelection,
    currentBuilding,
    currentSpace,
    filters: skipHydrate(filters),
    setBuildings,
    bulkSetBuildingOccupancy,
    setBuildingOccupancy,
    buildings,
    setRooms,
    bulkSetRoomsOccupancy,
    setRoomOccupancy,
    setSpaces,
    bulkSetSpaceOccupancy,
    setSpaceOccupancy,
    spaces,
    filteredSpaces,
    clearFilters,
    isFiltered,
    getSpaceBySlug,
    buildingsI18n, //These need to be exported to be passed as payload from server to client
    roomsI18n,
    spacesI18n,
  };
});
