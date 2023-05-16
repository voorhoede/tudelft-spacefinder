<template>
  <div>
    <div
      ref="mapContainer"
      class="mapbox-map"
    />
    <div
      v-if="!mapLoaded"
      class="mapbox-map__placeholder"
    >
      <span class="mapbox-map__loading-message">{{ $t("mapLoading") }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import {Feature, Point} from "geojson";
import { useRoute } from "vue-router";

import campusBounds from "~/lib/campus-bounds";
import zoomLevels from "~/lib/zoom-levels";
import { useMapStore } from "~/stores/map";
import {AssociatedSpace, useSpacesStore} from "~/stores/spaces";
import "mapbox-gl/dist/mapbox-gl.css";
import { OCCUPANCY_RATES } from "~/types/Filters";
const mapboxgl = (await import("mapbox-gl")).default;

const runtimeConfig = useRuntimeConfig();
const { $localePath } = useNuxtApp();
const router = useRouter();     
const route = useRoute();
const mapStore = useMapStore();
const spacesStore = useSpacesStore();
const { mapLoaded } = storeToRefs(mapStore);

const mapContainer = ref(null as null | HTMLDivElement);
const currentSpace = ref(spacesStore.currentSpace ?? null);
const previousHighlightedMarker = ref(null as null | mapboxgl.Marker);
const selectedSpaceSlug = ref<string | string[] | null>(null);

const onResizeDebounce = useDebounceFn(onResize, 200);

const CLUSTERS_LAYER_ID = "clusters";
const UNCLUSTERED_LAYER_ID = "unclustered-point";
const VISIBILITY_PROPERTY = "visibility";
const POINT_RADIUS = 1;

onMounted(() => {
  initMap(runtimeConfig.public.mapboxToken);
  mapStore.updateMarkers();
  window.addEventListener("resize", onResizeDebounce, true);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", onResizeDebounce, true);
});
function onResize() {
  mapStore.resizeMap();
}
function saveMapState() {
  mapStore.saveMapState();
}
function restoreMapState() {
  mapStore.restoreMapState();
}
function setAssociatedSpaces(spaces: Feature[]) {
  const newSpaces = spaces.map(space => ({
    id: space.id,
    spaceSlug: space.properties!.spaceSlug,
    buildingSlug: space.properties!.buildingSlug,
    long: space.geometry.coordinates[0],
    lat: space.geometry.coordinates[1]
  }));

  spacesStore.setAssociatedSpaces(newSpaces as AssociatedSpace[]);
}

/**
 * Mapbox renders insecure external links.
 * To fix these `[rel="noreferrer"]` is added when the links are rendered.
 * @see https://developers.google.com/web/tools/lighthouse/audits/noopener
 */
function fixInsecureLinks() {
  //TODO: this doesn't work:
  // - The leftmost "mapbox" link doesn't get selected to be fixed.
  // - The last link gets fixed but immediately restores its previous "rel" value
  // - Upon initial map render nothing happens (this seems to be fixed now)
  // - In production (on Nuxt 2) nothing works at all
  if (!("MutationObserver" in window)) {
    return;
  }
  const selector = `a:not([href^="${window.location.origin}"]):not([rel*="noreferrer"])`;
  const observer = new MutationObserver(() => {
    const element = mapContainer.value!.querySelector(".mapboxgl-ctrl-attrib");
    if (element) {
      observer.disconnect();
      Array.from(element.querySelectorAll(selector)).forEach((insecureLink) => {
        const rel = insecureLink.getAttribute("rel") || "";
        insecureLink.setAttribute("rel", `${rel} noreferrer`);
      });
    }
  });
  observer.observe(mapContainer.value!, {
    attributes: false,
    childList: true,
    subtree: true,
  });
}


function initMap(accessToken: string) {
  mapboxgl.accessToken = accessToken;
  const map = new mapboxgl.Map({
    container: mapContainer.value!,
    center: [
      (campusBounds.west + campusBounds.east) / 2,
      (campusBounds.north + campusBounds.south) / 2,
    ],
    zoom: zoomLevels.zoom,
    minZoom: zoomLevels.minZoom,
    trackResize: false, // prevent triggering a resize in mapbox, as we do it ourselves now (see store)
    style: "mapbox://styles/voorhoede/clgm5v8zx00bd01pj4hm0hvhn",
    maxBounds: [campusBounds.southWest, campusBounds.northEast],
  });

  // After we settle with nice images we may remove one of the if branches
  function addMarker(map: mapboxgl.Map, markerName: string) {
    return new Promise<void>((resolve) => {
      if (map.hasImage(markerName)) {
        resolve();
        return;
      }

      const img = new Image(40, 40);
      img.onload = () => {
        map.addImage(markerName, img);
        resolve();
      };
      img.src = `/icons/${markerName}.svg`;
    });
  }

  function addBuildingOccupancy(map: mapboxgl.Map, markerName: string) {
    return new Promise<void>((resolve) => {
      if (map.hasImage(markerName)) {
        resolve();
        return;
      }

      const img = new Image(120, 27);
      img.onload = () => {
        map.addImage(markerName, img);
        resolve();
      };
      img.src = `/icons/clusters/${markerName}.svg`;
    });
  }

  function createMarker(iconImage: string, coordinates: mapboxgl.LngLatLike) {
    const img = new Image(42, 42);
    img.src = `/icons/${iconImage}.svg`;

    return new mapboxgl.Marker({
      element: img,
    })
      .setLngLat(coordinates)
      .addTo(map);
  }

  function setHighlightedMarker(
    spaceSlug: string | string[] | null,
    iconImage: string,
    coordinates?: mapboxgl.LngLatLike | undefined
  ) {
    // Remove the previous highlighted marker
    if (previousHighlightedMarker.value) {
      previousHighlightedMarker.value.remove();
      previousHighlightedMarker.value = null;
    }

    let markerCoordinates: mapboxgl.LngLatLike | null = null;

    // If coordinates are supplied, use them directly
    if (coordinates) {
      markerCoordinates = coordinates;
    } else if (spaceSlug) {
      const features = map.querySourceFeatures("clustered-points", {
        filter: ["==", ["get", "spaceSlug"], spaceSlug],
      });

      if (features.length > 0) {
        const feature = features[0];
        markerCoordinates = (feature.geometry as Point)?.coordinates as mapboxgl.LngLatLike;
      }
    }

    if (markerCoordinates) {
      const marker = createMarker(iconImage, markerCoordinates);
      // Set the new highlighted marker
      previousHighlightedMarker.value = marker;
    }
  }
  
  function updateLayerVisibility() {
    const currentZoom = map.getZoom();

    const clustersVisibility = currentZoom >= zoomLevels.minZoom && currentZoom < zoomLevels.unClusterZoom ? "visible" : "none";
    const unclusteredVisibility = currentZoom >= zoomLevels.unClusterZoom ? "visible" : "none";

    map.setLayoutProperty(CLUSTERS_LAYER_ID, VISIBILITY_PROPERTY, clustersVisibility);
    map.setLayoutProperty(UNCLUSTERED_LAYER_ID, VISIBILITY_PROPERTY, unclusteredVisibility);
  }

  watch(route, (newRoute) => {
    const { spaceSlug } = newRoute.params;
    selectedSpaceSlug.value = spaceSlug;
  });

  watch(selectedSpaceSlug, (newSpaceSlug) => {
    setHighlightedMarker(newSpaceSlug, "map-marker-selected");
  });

  map.on("load", async () => {
    const markerNames = [...OCCUPANCY_RATES, "unknown"] as const;
    
    await Promise.all(
      markerNames.flatMap((occupancy) => [
        addMarker(map, `map-marker-${occupancy}`),
        addBuildingOccupancy(map, `pill-${occupancy}`),
      ])
    );

    const occupancyIconNamePairs = OCCUPANCY_RATES.reduce(
      (acc, occupancy) => [...acc, occupancy, `map-marker-${occupancy}`],
      [] as string[]
    );

    map.addSource("clustered-points", {
      type: "geojson",
      data: mapStore.createManualClusters(mapStore.geoJsonSpaces),
      promoteId: "spaceSlug",
    });

    map.addLayer({
      id: CLUSTERS_LAYER_ID,
      type: 'symbol',
      source: 'clustered-points',
      filter: ['all', ['has', 'pointCount']],
      layout: {
        'icon-image': ['concat', 'pill-', ['get', 'buildingOccupancy']],
        'icon-allow-overlap': true,
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-field': [
          'format',
          [
            'case',
            ['<', ['get', 'pointCount'], 10], // get all pointCount that are less than 10
            ['concat', '0', ['to-string', ['get', 'pointCount']]], // add a 0 in front of the number
            ['to-string', ['get', 'pointCount']], // else just return the number
          ],
          {
            'text-color': '#FFF',
          },
          '          ', // this space is being used to align the text with the icon
          {},
          ['get', 'buildingAbbreviation'],
          {
            'text-color': '#000',
          },
        ],
        'text-size': 13,
        'text-anchor': 'left',
        'text-justify': 'left',
        'text-transform': 'uppercase',
        'text-offset': [-4.1, 0],
        'text-allow-overlap': true, // allow text to go over icons else icons will be removed from the map because the text gets collided out
        'text-optional': true, // this is needed for the icons to display when text gets collided out
      },
    });


    map.addLayer({
      id: UNCLUSTERED_LAYER_ID,
      interactive: true,
      type: "symbol",
      source: "clustered-points",
      filter: ["all", ["!", ["has", "pointCount"]], [">=", ["zoom"], zoomLevels.unClusterZoom]],
      layout: {
        "icon-image": [
          "match",// A rule to determine the icon for the point...
          ["get", "buildingOccupancy"], // ... is that if the `buildingOccupancy` property matches...
          ...occupancyIconNamePairs, // ... the first element of the pair from this (flat) sequence, the second element defines the name of the icon
          "map-marker-unknown", //And the final element determines the default icon
        ],
        "icon-allow-overlap": true,
      },
    });

    restoreMapState();
    fixInsecureLinks();
    updateLayerVisibility();

    if (currentSpace.value) {
      // show the marker after the map is zoomed in have to wait 1.5 sec because the markers are being load in after zooming in the map
      // if we don't wait there aren't any features to query...
      setTimeout(() => {
        setHighlightedMarker(
          currentSpace.value!.slug,
          "map-marker-selected",
          [currentSpace.value!.longitude, currentSpace.value!.latitude]);
        
        const screenPoint = map.project([currentSpace.value!.longitude, currentSpace.value!.latitude]);
        const features = map.queryRenderedFeatures(
          [
            [screenPoint.x - POINT_RADIUS, screenPoint.y - POINT_RADIUS],
            [screenPoint.x + POINT_RADIUS, screenPoint.y + POINT_RADIUS],
          ],
          { layers: [UNCLUSTERED_LAYER_ID] }
        );

        if (features.length > 1) {
          setAssociatedSpaces(features);
        } else {
          setAssociatedSpaces([]);
        }
      }, 1500)
    }
    
    mapStore.setMap(map);
  });

  map.on("click", CLUSTERS_LAYER_ID, (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [CLUSTERS_LAYER_ID],
    });

    if (features.length) {
      const properties = features[0].properties;
        const buildingSlug = properties?.buildingSlug ?? null as string | null;
        saveMapState();
        router.push($localePath("/buildings/:buildingSlug", {
          buildingSlug,
        }));
      }
  });

  map.on("click", UNCLUSTERED_LAYER_ID, (e) => {
    let properties;

    const features = map.queryRenderedFeatures(
      [
        [e.point.x - POINT_RADIUS, e.point.y - POINT_RADIUS],
        [e.point.x + POINT_RADIUS, e.point.y + POINT_RADIUS],
      ],
      { layers: [UNCLUSTERED_LAYER_ID] }
    );

    if (features.length > 1) {
      setAssociatedSpaces(features);
      const [ firstFeature ] = features;
      properties = firstFeature.properties || {};
    } else if (features.length === 1) {
      setAssociatedSpaces([]);
      properties = features[0].properties || {};
    }

    if (!properties || !properties.buildingSlug || !properties.spaceSlug) {
      return;
    }

    setHighlightedMarker(properties.spaceSlug, "map-marker-selected");
    saveMapState();

    router.push(
      $localePath("/buildings/:buildingSlug/spaces/:spaceSlug", {
        buildingSlug: properties.buildingSlug as string,
        spaceSlug: properties.spaceSlug as string,
      })
    );
  });

  map.on("moveend", () => {
    saveMapState();
  });

  map.on("zoom", () => {
    updateLayerVisibility();
  });

}
</script>

<style>
@import "../app-core/variables.css";

.mapbox-map {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--mapbox-background-color);
}

.mapbox-map__placeholder {
  position: absolute;
  z-index: var(--layer-overlay);
  flex: 1 1 auto;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mapbox-map__loading-message {
  font-size: var(--font-size-default);
}
</style>
