import { defineStore, skipHydrate } from "pinia";
import { spaceFilter } from "~/lib/filter-spaces";
import type { Building, BuildingI18n } from "~/types/Building";
import type { Filters } from "~/types/filters";
import type { Space, SpaceI18n } from "~/types/Space";

export const useStore = defineStore("index", () => {
  const isMapMode = ref(false);
  const isMobile = ref(false);

  const selection = ref({
    building: undefined as undefined | Building,
    space: undefined as undefined | Space,
  });

  function clearSelection() {
    selection.value = {
      building: undefined,
      space: undefined,
    };
  }

  function selectBuilding(building: Building | undefined) {
    selection.value = {
      building,
      space: undefined,
    };
  }

  function selectSpace(space: Space | undefined) {
    selection.value.space = space;
  }

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
    showNearbyLocations: false,
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

  const isBuildingPage = computed(
    () => !!selection.value.building && !selection.value.space
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
    selection,
    clearSelection,
    selectBuilding,
    selectSpace,
    isBuildingPage,
    filters: skipHydrate(filters),
    setBuildings,
    buildings,
    setSpaces,
    spaces,
    filteredSpaces,
    clearFilters,
    isFiltered,
    getBuildingByNumber,
    getBuildingBySlug,
    getSpaceById,
    getSpaceBySlug,
    buildingsI18n,
    spacesI18n,
  };
});
