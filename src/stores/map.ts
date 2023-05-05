import { defineStore, storeToRefs } from "pinia";
import { deferred } from "~/lib/deferred";
import { spaceIsOpen } from "~/lib/filter-spaces";
import { Bounds } from "~/types/Bounds";
import campusBounds from "~/lib/campus-bounds";
import { useSpacesStore } from "./spaces";
import { GeoJSONSource, Map } from "mapbox-gl";
import type { Occupancy } from "../types/Filters";
import {Feature, FeatureCollection, Point} from "geojson";

export const useMapStore = defineStore("map", () => {
  const spacesStore = useSpacesStore();
  const { currentBuilding, spaces, filters } =
    storeToRefs(spacesStore);

  const mapDeferred = deferred<Map>();

  const mapLoaded = ref(false);

  const nuxtApp = useNuxtApp();
  const locale = nuxtApp.$locale;

  const lastZoomLevel = ref<number | null>(null);
  const lastMapCenter = ref<[number, number] | null>(null);

  const geoJsonSpaces = computed(() => {
    const now = new Date();
    const featuresPerSpace = spaces.value.map((space) => {
      //TODO: use the raw spacesI18n?
      return {
        type: "Feature" as const,
        properties: {
          spaceSlug: space.slug,
          buildingSlug: space.building.slug,
          buildingAbbreviation: space.building.abbreviation,
          buildingNumber: space.building.number,
          buildingOccupancy: space.building.occupancy,
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
    if (currentBuilding.value) zoomToSelection();
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
    const bounds = currentBuilding.value!.bounds;
    zoomToBounds(bounds, padding);
  }

  async function resizeMap() {
    const map = await getMap();
    map.resize();
  }

  async function saveMapState() {
    const map = await getMap();
    lastZoomLevel.value = map.getZoom();
    lastMapCenter.value = map.getCenter().toArray() as [number, number];

  }

  async function restoreMapState() {
    if (lastZoomLevel.value !== null && lastMapCenter.value !== null) {
      const map = await getMap();
      map.setZoom(lastZoomLevel.value);
      map.setCenter(lastMapCenter.value);
    } else {
      zoomToCampus();
    }
  }

  /**
   * Create manual clusters for a given set of geographic spaces.
   * @param {FeatureCollection} geoJsonSpaces - A GeoJSON FeatureCollection of spaces.
   * @returns {FeatureCollection} - A new FeatureCollection containing clustered and original features.
   */
  function createManualClusters(geoJsonSpaces: FeatureCollection): FeatureCollection {
    // Group the features by building slug
    const groupedSpaces = geoJsonSpaces.features.reduce<{ [key: string]: Feature[] }>(
      (acc, space) => {
        const buildingSlug = space.properties?.buildingSlug;
        if (!acc[buildingSlug]) {
          acc[buildingSlug] = [];
        }
        acc[buildingSlug].push(space);
        return acc;
      }, {});

    const clusters = Object.entries(groupedSpaces).map(([buildingSlug, spaces]): Feature => {
      // Calculate the cluster center by averaging the coordinates of all spaces in the cluster
      const clusterCoordinates = spaces.reduce<[number, number]>(
        ([sumLon, sumLat], space) => {
          const coordinates = (space.geometry as Point).coordinates;
          return [sumLon + coordinates[0], sumLat + coordinates[1]];
        },
        [0, 0]
      );

      const count = spaces.length;
      const { buildingOccupancy, buildingAbbreviation } = spaces[0].properties ?? {};

      // Create a cluster feature with the calculated center and properties
      return {
        type: "Feature",
        properties: {
          buildingAbbreviation,
          buildingSlug,
          buildingOccupancy,
          point_count: count,
          point_count_abbreviated: count,
        },
        geometry: {
          type: "Point",
          coordinates: [
            clusterCoordinates[0] / count,
            clusterCoordinates[1] / count,
          ],
        },
      };
    });

    // Return a new FeatureCollection containing the clusters and original features
    return {
      type: "FeatureCollection",
      features: clusters.concat(geoJsonSpaces.features),
    };
  }

  type EqualsFilter = ["==", string, any];
  type InFilter = ["in", string, ...Array<{}>];
  type AnyFilter = ["any", ...Array<EqualsFilter>];
  type Filter = EqualsFilter | InFilter | AnyFilter;

  const activeMarkerFilters = computed(() => {
    const featureFilters = Object.entries(filters.value).reduce(
      (filters, [key, value]) => {
        if (typeof value === "boolean" && value) {
          const filter = key === "showOpenLocations" ? "isOpen" : key;
          return [...filters, ["==", filter, value] as EqualsFilter];
        }

        if (Array.isArray(value) && value.length > 0) {
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

    return featureFilters;
  });

  // This could be used instead of updateData to set data of individual points, but it does not work atm
  async function setBuildingOccupancy(
    spaceId: string,
    buildingOccupancy: Occupancy
  ) {
    const map = await getMap();
    map.setFeatureState(
      { source: "clustered-points", id: spaceId },
      { buildingOccupancy }
    );
  }

  // Updates all data for all points
  async function updateData() {
    const map = await getMap();
    const source = map.getSource("clustered-points") as GeoJSONSource;
    const updatedData = createManualClusters(geoJsonSpaces.value);
    source.setData(updatedData);
  }

  async function updateMarkers() {
    const map = await getMap();

    if (activeMarkerFilters.value.length) {
      map.setFilter("unclustered-point", ["all", ["none", ["has", "point_count"]], ...activeMarkerFilters.value]);
    } else {
      map.setFilter("unclustered-point", ["all", ["none", ["has", "point_count"]]]);
    }
  }
  
  watch(activeMarkerFilters, () => {
    updateMarkers();
    updateData();
  });

  watch(locale, () => {
    updateData();
  });

  return {
    createManualClusters,
    mapLoaded,
    setMap,
    zoomToCampus,
    zoomToSelection,
    zoomAuto,
    resizeMap,
    saveMapState,
    restoreMapState,
    updateMarkers,
    geoJsonSpaces,
    setBuildingOccupancy,
    updateData,
  };
});
