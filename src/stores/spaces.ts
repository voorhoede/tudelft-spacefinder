import { defineStore, skipHydrate } from "pinia";
import { spaceFilter } from "~/lib/filter-spaces";
import type { BuildingI18n } from "~/types/Building";
import type { Filters } from "~/types/filters";
import type { Space, SpaceI18n, Room, RoomI18n } from "~/types/Space";
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

  const spacesI18n = ref([] as SpaceI18n[]);

  function setSpaces(spaces: SpaceI18n[]) {
    spacesI18n.value = spaces;
  }

  function bulkSetRoomOccupancy(data: Record<string, number>) {
    roomsI18n.value = roomsI18n.value.map((room) => {
      const activeDevices = data[room.realEstateNumber];
      const occupancy = calculateOccupancy(activeDevices, room.seats);
      return { ...room, activeDevices, occupancy };
    });
    spacesI18n.value = spacesI18n.value.map((space) => {
      const activeDevices = data[space.realEstateNumber];
      const room = getRoomI18nByRealEstateNumber(space.realEstateNumber)!;
      const occupancy = calculateOccupancy(activeDevices, room.seats);
      return { ...space, activeDevices, occupancy };
    });
  }

  function setRoomOccupancy(realEstateNumber: string, activeDevices: number) {
    const room = getRoomI18nByRealEstateNumber(realEstateNumber);
    if (room) {
      room.activeDevices = activeDevices;
      room.occupancy = calculateOccupancy(activeDevices, room.seats);
      const spaces = spacesI18n.value.filter(
        (space) => space.realEstateNumber == realEstateNumber
      );
      for (const space of spaces) {
        space.activeDevices = activeDevices;
        space.occupancy = room.occupancy;
      }
      //const mapStore = useMapStore();
      //mapStore.updateData(); //TODO: DECIDE IF WE NEED TO DO THAT
    }
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

  function getRoomI18nByRealEstateNumber(realEstateNumber: string) {
    return roomsI18n.value.find(
      (room) => room.realEstateNumber === realEstateNumber
    );
  }

  function getSpaceBySlug(slug: string) {
    return spaces.value.find((space) => space.slug === slug);
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
    setSpaces,
    bulkSetRoomOccupancy,
    setRoomOccupancy,
    spaces,
    filteredSpaces,
    clearFilters,
    isFiltered,
    buildingsI18n, //These need to be exported to be passed as payload from server to client
    roomsI18n,
    spacesI18n,
  };
});
