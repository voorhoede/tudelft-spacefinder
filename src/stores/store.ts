import { defineStore, skipHydrate } from "pinia";
import { spaceFilter } from "~/lib/filter-spaces";
import type { Building, BuildingI18n } from "~/types/Building";
import type { Filters } from "~/types/filters";
import type { Space, SpaceI18n } from "~/types/Space";

export const useStore = defineStore("index", () => {
  const isMapMode = ref(false);
  const isMobile = ref(false);

  const currentBuildingSlug = ref(undefined as undefined | string);
  const currentSpaceSlug = ref(undefined as undefined | string);

  function clearSelection() {
    currentSpaceSlug.value = undefined;
    currentBuildingSlug.value = undefined;
  }

  function selectBuilding(buildingSlug: string) {
    currentSpaceSlug.value = undefined;
    currentBuildingSlug.value = buildingSlug;
  }

  function selectSpace(spaceSlug: string) {
    currentSpaceSlug.value = spaceSlug;
    currentBuildingSlug.value = undefined;
  }

  const currentBuilding = computed(() =>
    currentBuildingSlug.value
      ? getBuildingBySlug(currentBuildingSlug.value)
      : currentSpace.value
      ? currentSpace.value.building
      : undefined
  );

  const currentSpace = computed(() =>
    currentSpaceSlug.value ? getSpaceBySlug(currentSpaceSlug.value) : undefined
  );

  const defaultFilters: Filters = {
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

  const filters = useLocalStorage("filters", defaultFilters);

  function clearFilters() {
    filters.value = defaultFilters; //TODO: check if Vue3 reactivity works like that
  }

  const buildingsI18n = ref([] as BuildingI18n[]);

  function setBuildings(buildings: BuildingI18n[]) {
    buildingsI18n.value = buildings;
  }

  function bulkSetBuildingOccupancy(data: Record<number, number>) {
    buildingsI18n.value = buildingsI18n.value.map((building) => {
      return { ...building, activeDevices: data[building.number] };
    });
  }

  function setBuildingOccupancy(buildingNumber: number, activeDevices: number) {
    const building = buildingsI18n.value.find(
      (building) => building.number === buildingNumber
    ); //TODO: extract function back
    if (building) building.activeDevices = activeDevices;
  }

  //const locale = ref("en");

  function compareBuildingsByName(a: Building, b: Building) {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  }

  const buildings = computed(() => {
    const { $locale } = useNuxtApp();
    // TODO: is it really a good idea to have a computed localized buildings and especially spaces?
    return buildingsI18n.value
      .map((buildingI18n) => {
        const i18nProps = buildingI18n.i18n[$locale.value];
        return {
          ...buildingI18n,
          ...i18nProps,
        } as Building;
      })
      .sort(compareBuildingsByName);
  });

  const spacesI18n = ref([] as SpaceI18n[]);

  function setSpaces(spaces: SpaceI18n[]) {
    spacesI18n.value = spaces;
  }

  const spaces = computed(() => {
    const { $locale } = useNuxtApp();
    return spacesI18n.value.map((spaceI18n) => {
      const propsI18n = spaceI18n.i18n[$locale.value];
      const building = getBuildingByNumber(spaceI18n.buildingNumber);
      return {
        ...spaceI18n,
        ...propsI18n,
        building,
      } as Space;
    });
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

  function getBuildingBySlug(slug: string) {
    return buildings.value.find((building) => building.slug === slug);
  }

  function getSpaceById(id: string) {
    return spaces.value.find((space) => space.spaceId === id);
  }

  function getSpaceBySlug(slug: string) {
    return spaces.value.find((space) => space.slug === slug);
  }

  return {
    isMapMode,
    isMobile,
    currentBuildingSlug, //TODO: it sucks to expose them, but otherwise they don't come from the server
    currentSpaceSlug,
    currentBuilding,
    currentSpace,
    clearSelection,
    selectBuilding,
    selectSpace,
    filters: skipHydrate(filters),
    setBuildings,
    bulkSetBuildingOccupancy,
    setBuildingOccupancy,
    buildings,
    setSpaces,
    spaces,
    filteredSpaces,
    clearFilters,
    isFiltered,
    getBuildingBySlug,
    getSpaceById,
    getSpaceBySlug,
    buildingsI18n,
    spacesI18n,
  };
});
