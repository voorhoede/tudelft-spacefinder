import { defineStore } from "pinia";
import { spaceFilter } from "~/lib/filter-spaces";
import type { Building, BuildingI18n } from "~/types/Building";
import type { Filters } from "~/types/filters";
import type { Space, SpaceI18n } from "~/types/Space";

export const useStore = defineStore("index", () => {
  const showOnboarding = ref(false);
  const hasSeenOnboarding = ref(false);

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

  const filters = ref(defaultFilters);

  function clearFilters() {
    filters.value = defaultFilters; //TODO: check if Vue3 reactivity works like that
  }

  const buildingsI18n = ref([] as BuildingI18n[]);

  function setBuildings(buildings: BuildingI18n[]) {
    buildingsI18n.value = buildings;
  }

  const locale = ref("en");

  const buildings = computed(() => {
    //const { locale } = useI18n();
    return (
      buildingsI18n.value
        .map((buildingI18n) => {
          const i18nProps = buildingI18n.i18n[locale.value];
          return {
            ...buildingI18n,
            ...i18nProps,
          } as Building;
        })
        //TODO: this fixes the behavior from prev version. OK?
        .sort((buildingA, buildingB) =>
          buildingA.name > buildingB.name
            ? 1
            : buildingA.name < buildingB.name
            ? -1
            : 0
        )
    );
  });

  const spacesI18n = ref([] as SpaceI18n[]);

  function setSpaces(spaces: SpaceI18n[]) {
    spacesI18n.value = spaces;
  }

  const spaces = computed(() => {
    //const { locale } = useI18n();
    return spacesI18n.value.map((spaceI18n) => {
      const propsI18n = spaceI18n.i18n[locale.value];
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
    locale,
    showOnboarding,
    hasSeenOnboarding,
    isMapMode,
    isMobile,
    selection,
    clearSelection,
    selectBuilding,
    selectSpace,
    isBuildingPage,
    filters,
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
