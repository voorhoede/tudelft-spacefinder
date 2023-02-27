import { defineStore, storeToRefs } from "pinia";
import { deferred } from "~/lib/deferred";
import delay from "~/lib/delay";
import { spaceIsOpen } from "~/lib/filter-spaces";
import { Bounds } from "~/types/Bounds";
import campusBounds from "~/lib/campus-bounds";
import { useStore } from "./store";
import { Map } from "mapbox-gl";

export const useMapStore = defineStore("map", () => {
  const store = useStore();
  const { selection, spaces, filters } = storeToRefs(store);

  const mapDeferred = deferred<Map>();

  const mapLoaded = ref(false);

  const activeMarkerFilters = ref([] as Filter[]);

  const geoJsonSpaces = computed(() => {
    const now = new Date();
    const featuresPerSpace = spaces.value.map((space) => {
      return {
        type: "Feature" as const,
        properties: {
          spaceId: space.spaceId,
          buildingNumber: space.building.number,
          isOpen: spaceIsOpen(now, space.openingHours),
          ...space.facilities,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [space.longitude, space.latitude],
        },
      };
    });

    return {
      type: "FeatureCollection" as const,
      features: featuresPerSpace,
    };
  });

  function setMap(map: Map) {
    mapDeferred.resolve(map);
    mapLoaded.value = true;
  }

  function getMap() {
    return mapDeferred.promise;
  }

  function zoomAuto() {
    if (selection.value.building) zoomToSelection();
    else zoomToCampus();
  }

  interface Padding {
    top: number;
    bottom: number;
    left: number;
    right: number;
  }

  async function zoomToBounds(bounds: Bounds, padding: Partial<Padding>) {
    const map = await getMap();
    const defaultPadding: Padding = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20,
    };
    map.fitBounds(
      [
        [bounds.west, bounds.south],
        [bounds.east, bounds.north],
      ],
      {
        padding: { ...defaultPadding, ...padding },
      }
    );
  }

  function zoomToCampus() {
    zoomToBounds(campusBounds, {});
  }

  function zoomToSelection(padding: Partial<Padding> = {}) {
    const bounds = selection.value.building!.bounds;
    zoomToBounds(bounds, padding);
  }

  async function zoomIn() {
    const map = await getMap();
    map.zoomIn();
  }

  async function zoomOut() {
    const map = await getMap();
    map.zoomOut();
  }

  async function resizeMap() {
    const map = await getMap();

    // Wait for the next paint of the browser before resizing the map
    // This prevents grey areas when resizing the browser
    await delay(0);
    map.resize();
  }

  type EqualsFilter = ["==", string, any];
  type InFilter = ["in", string, ...Array<{}>];
  type AnyFilter = ["any", ...Array<EqualsFilter>];
  type Filter = EqualsFilter | InFilter | AnyFilter;

  function updateMarkers() {
    const {
      building: { number: buildingNumber } = {},
      space: { spaceId } = {},
    } = selection.value;

    let newValue: Filter[] = [];
    let hasSelectedBuilding = false;

    if (spaceId) {
      // All filters are off if a space is selected
      activeMarkerFilters.value = [["==", "spaceId", spaceId]];
      return;
    }
    if (buildingNumber) {
      // If a building is selected, filtering by building should be disabled
      newValue = [["==", "buildingNumber", buildingNumber]];
      hasSelectedBuilding = true;
    }

    // Go through the enabled filters
    const featureFilters = Object.entries(filters.value).reduce(
      (filters, [key, value]) => {
        if (typeof value === "boolean" && value) {
          const filter = key === "showOpenLocations" ? "isOpen" : key;
          return [...filters, ["==", filter, value] as EqualsFilter];
        }
        if (Array.isArray(value) && value.length > 0) {
          if (key === "buildings" && hasSelectedBuilding) {
            return filters;
          }

          if (key === "buildings") {
            const buildingFilters = value.map(
              (v) => ["==", "buildingNumber", v] as EqualsFilter
            );
            return [...filters, ["any", ...buildingFilters] as AnyFilter];
          }

          return [...filters, ["in", key, ...value] as InFilter];
        }
        return filters;
      },
      [] as Filter[]
    );
    activeMarkerFilters.value = [...newValue, ...featureFilters];
  }

  return {
    mapLoaded,
    setMap,
    getMap,
    zoomToCampus,
    zoomToSelection,
    zoomIn,
    zoomOut,
    zoomAuto,
    resizeMap,
    activeMarkerFilters,
    updateMarkers,
    geoJsonSpaces,
  };
});