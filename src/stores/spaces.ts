import { defineStore, skipHydrate } from "pinia";
import { spaceFilter } from "~/lib/filter-spaces";
import { calculateOccupancy } from "../lib/calculate-occupancy";
import { useMapStore } from "./map";
import type { BuildingI18n } from "~/types/Building";
import type { Filters } from "~/types/Filters";
import type { Space, SpaceI18n, Room, RoomI18n } from "~/types/Space";

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

export type AssociatedSpace = {
  id: string,
  spaceSlug: string,
  buildingSlug: string,
  long: number,
  lat: number
}

export const useSpacesStore = defineStore("spaces", () => {
  const runtimeConfig = useRuntimeConfig();
  const currentSelection = ref<Selection>(undefined);
  const currentAssociatedSpaces = ref<AssociatedSpace[]>([]);
  const updatedAt = ref();

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
  
  const associatedSpaces = computed(() => currentAssociatedSpaces.value);

  const defaultFilters: Filters = {
    buildingOccupancy: [],
    adjustableChairs: false,
    buildings: [],
    daylit: false,
    nearBathroom: false,
    nearCoffeeMachine: false,
    nearPrinter: false,
    numberOfSeats: 0,
    powerOutlets: false,
    presentationScreen: false,
    quietness: [],
    showOpenLocations: false,
    whiteBoard: false,
  };

  const filters = useLocalStorage("filters", defaultFilters, {
    mergeDefaults: true,
  });

  function clearFilters() {
    filters.value = { ...defaultFilters };
  }

  type Timer = ReturnType<typeof setTimeout>;
  const invalidationTimers = {
    buildings: {} as Record<number, Timer>,
    rooms: {} as Record<string, Timer>,
  };

  const buildingsI18n = ref([] as BuildingI18n[]);

  function setBuildings(buildings: BuildingI18n[]) {
    function compareByNumber(a: BuildingI18n, b: BuildingI18n) {
      if (a.number > b.number) return 1;
      if (a.number < b.number) return -1;
      return 0;
    }
    buildingsI18n.value = [...buildings].sort(compareByNumber);
  }

  function clearBuildingInvalidationTimer(buildingNumber: number) {
    const existingTimer = invalidationTimers.buildings[buildingNumber];
    if (existingTimer) clearTimeout(existingTimer);
  }

  function setBuildingInvalidationTimer(buildingNumber: number) {
    clearBuildingInvalidationTimer(buildingNumber);
    invalidationTimers.buildings[buildingNumber] = setTimeout(
      () => setBuildingOccupancy(buildingNumber, undefined),
      30 * 60 * 1000
    );
  }

  function bulkSetBuildingOccupancy(data: Record<number, number>) {
    const mapStore = useMapStore();
    buildingsI18n.value = buildingsI18n.value.map((building) => {
      const activeDevices = data[building.number];
      const occupancy = calculateOccupancy(activeDevices, building);
      if (activeDevices != undefined)
        setBuildingInvalidationTimer(building.number);
      else clearBuildingInvalidationTimer(building.number);
      return { ...building, activeDevices, occupancy };
    });
    mapStore.updateData();
    updatedAt.value = new Date();
  }

  function bulkSetBuildingOpeningHours(data: Array<unknown>) {
    buildingsI18n.value = buildingsI18n.value.map((building) => {
      const matchedBuilding = data.find(({ number }) => number === Number(building.number));

      return matchedBuilding
        ? {
          ...building,
          openingHours: matchedBuilding.opening_hours,
        }
        : building;
    });
  }

  function setBuildingOccupancy(
    buildingNumber: number,
    activeDevices: number | undefined
  ) {
    const building = getBuildingI18nByNumber(buildingNumber);
    if (building) {
      building.activeDevices = activeDevices;
      building.occupancy = calculateOccupancy(activeDevices, building);
      if (activeDevices != undefined)
        setBuildingInvalidationTimer(buildingNumber);
      else clearBuildingInvalidationTimer(buildingNumber);
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

  function clearRoomInvalidationTimer(realEstateNumber: string) {
    const existingTimer = invalidationTimers.rooms[realEstateNumber];
    if (existingTimer) clearTimeout(existingTimer);
  }

  function setRoomInvalidationTimer(realEstateNumber: string) {
    clearRoomInvalidationTimer(realEstateNumber);
    invalidationTimers.rooms[realEstateNumber] = setTimeout(
      () => setRoomOccupancy(realEstateNumber, undefined),
      30 * 60 * 1000
    );
  }

  function bulkSetRoomOccupancy(data: Record<string, number>) {
    roomsI18n.value = roomsI18n.value.map((room) => {
      const activeDevices = data[room.realEstateNumber];
      const occupancy = calculateOccupancy(activeDevices, room);
      if (activeDevices != undefined)
        setRoomInvalidationTimer(room.realEstateNumber);
      else clearRoomInvalidationTimer(room.realEstateNumber);
      return { ...room, activeDevices, occupancy };
    });
    spacesI18n.value = spacesI18n.value.map((space) => {
      const activeDevices = data[space.realEstateNumber];
      const room = getRoomI18nByRealEstateNumber(space.realEstateNumber)!;
      const occupancy = calculateOccupancy(activeDevices, room);
      return { ...space, activeDevices, occupancy };
    });
  }

  function setRoomOccupancy(
    realEstateNumber: string,
    activeDevices: number | undefined
  ) {
    const room = getRoomI18nByRealEstateNumber(realEstateNumber);
    if (room) {
      room.activeDevices = activeDevices;
      room.occupancy = calculateOccupancy(activeDevices, room);
      const spaces = spacesI18n.value.filter(
        (space) => space.realEstateNumber == realEstateNumber
      );
      for (const space of spaces) {
        space.activeDevices = activeDevices;
        space.occupancy = room.occupancy;
      }
      if (activeDevices != undefined)
        setRoomInvalidationTimer(realEstateNumber);
      else clearRoomInvalidationTimer(realEstateNumber);
      //const mapStore = useMapStore();
      //mapStore.updateData(); //TODO: DECIDE IF WE NEED TO DO THAT
    }
  }
  
  function setAssociatedSpaces(spaces: AssociatedSpace[]) {
    currentAssociatedSpaces.value = spaces;
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

  const numberOfSelectedFilters = computed(
    () => {
      // Filter out numberOfSeats when that value is 0, i.e. not selected
      const selectedFilters = Object.values(filters.value).filter(item => item !== 0)
      return selectedFilters.reduce((acc, item) => {
        return acc + (item === true || item > 0 ? 1 : item.length > 0 ? item.length : 0)
      }, 0)
    }
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
    bulkSetBuildingOpeningHours,
    setBuildingOccupancy,
    buildings,
    setRooms,
    setSpaces,
    bulkSetRoomOccupancy,
    setRoomOccupancy,
    associatedSpaces,
    setAssociatedSpaces,
    spaces,
    filteredSpaces,
    clearFilters,
    numberOfSelectedFilters,
    buildingsI18n, //These need to be exported to be passed as payload from server to client
    roomsI18n,
    spacesI18n,
    updatedAt,
  };
});
