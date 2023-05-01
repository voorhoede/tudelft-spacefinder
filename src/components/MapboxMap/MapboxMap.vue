<template>
  <div
    ref="mapContainer"
    class="mapbox-map"
  >
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

import campusBounds from "~/lib/campus-bounds";
import { useMapStore } from "~/stores/map";
import "mapbox-gl/dist/mapbox-gl.css";
import { OCCUPANCY_RATES } from "~/types/Filters";
const mapboxgl = (await import("mapbox-gl")).default;

const runtimeConfig = useRuntimeConfig();
const { $localePath } = useNuxtApp();
const router = useRouter();
const mapStore = useMapStore();
const { mapLoaded } = storeToRefs(mapStore);

const mapContainer = ref(null as null | HTMLDivElement);

const onResizeDebounce = useDebounceFn(onResize, 200);

const CLUSTERS_LAYER_ID = "clusters";
const UNCLUSTERED_LAYER_ID = "unclustered-point";
const VISIBILITY_PROPERTY = "visibility";

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
    zoom: 13,
    trackResize: false, // prevent triggering a resize in mapbox, as we do it ourselves now (see store)
    style: "mapbox://styles/voorhoede/clgm5v8zx00bd01pj4hm0hvhn",
    maxBounds: [campusBounds.southWest, campusBounds.northEast],
  });

  // After we settle with nice images we may remove one of the if branches
  function addMarker(map: mapboxgl.Map, markerName: string) {
    return new Promise<void>((resolve) => {
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
      const img = new Image(145, 33);
      img.onload = () => {
        map.addImage(markerName, img);
        resolve();
      };
      img.src = `/icons/clusters/${markerName}.svg`;
    });
  }

  map.on("load", () => {
    const markerNames = [...OCCUPANCY_RATES, "unknown"] as const;
    Promise.all([
      markerNames.map((occupancy) => {
        addMarker(map, `map-marker-${occupancy}`)
        addBuildingOccupancy(map, `pill-${occupancy}`);
      }),
    ]).then(() => {
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
        filter: ['all', ['has', 'point_count']],
        layout: {
          'icon-image': ['concat', 'pill-', ['get', 'buildingOccupancy']],
          'icon-allow-overlap': true,
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-field': [
            'format',
            [
              'case',
              ['<', ['get', 'point_count_abbreviated'], 10],
              ['concat', '0', ['to-string', ['get', 'point_count_abbreviated']]],
              ['to-string', ['get', 'point_count_abbreviated']],
            ],
            {
              'text-color': '#FFF',
            },
            '            ',
            {},
            ['get', 'buildingSlugModified'],
            {
              'text-color': '#000',
            },
          ],
          'text-size': 15,
          'text-anchor': 'left',
          'text-justify': 'left',
          'text-transform': 'uppercase',
          'text-offset': [-4.25, 0],
          'text-allow-overlap': true,
          'text-optional': true,
        },
      });



      map.addLayer({
        id: UNCLUSTERED_LAYER_ID,
        interactive: true,
        type: "symbol",
        source: "clustered-points",
        filter: ["all", ["!", ["has", "point_count"]], [">=", ["zoom"], 17]],
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
      mapStore.setMap(map);
    });
  });

  map.on("click", CLUSTERS_LAYER_ID, (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [CLUSTERS_LAYER_ID],
    });

    if (features.length) {
      const geometry = features[0].geometry;

      if (geometry.type === "Point" && geometry.coordinates) {
        const coordinates = geometry.coordinates.slice() as [number, number];
        map.flyTo({
          center: coordinates,
          zoom: 17,
          essential: true,
        });
      }
    }
  });

  // Click event handler for unclustered points
  map.on("click", UNCLUSTERED_LAYER_ID, (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [UNCLUSTERED_LAYER_ID],
    });

    if (features.length) {
      const properties = features[0].properties || {};
      if (!properties.buildingSlug || !features[0].id) {
        return;
      }
      saveMapState();

      router.push(
        $localePath("/buildings/:buildingSlug/spaces/:spaceSlug", {
          buildingSlug: properties.buildingSlug as string,
          spaceSlug: features[0].id as string,
        })
      );
    }
  });

  map.on("moveend", () => {
    saveMapState();
  });

  map.on("zoom", () => {
    const currentZoom = map.getZoom();

    switch (true) {
      case currentZoom >= 17:
        map.setLayoutProperty(CLUSTERS_LAYER_ID, VISIBILITY_PROPERTY, "none");
        map.setLayoutProperty(UNCLUSTERED_LAYER_ID, VISIBILITY_PROPERTY, "visible");
        break;

      case currentZoom < 14:
        map.setLayoutProperty(CLUSTERS_LAYER_ID, VISIBILITY_PROPERTY, "none");
        map.setLayoutProperty(UNCLUSTERED_LAYER_ID, VISIBILITY_PROPERTY, "none");
        break;

      default:
        map.setLayoutProperty(CLUSTERS_LAYER_ID, VISIBILITY_PROPERTY, "visible");
        map.setLayoutProperty(UNCLUSTERED_LAYER_ID, VISIBILITY_PROPERTY, "none");
        break;
    }
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
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mapbox-map__loading-message {
  font-size: var(--font-size-default);
}

.mapbox-map__zoom-controls {
  position: absolute;
  bottom: var(--spacing-default);
  right: var(--spacing-default);
  z-index: var(--layer--raised);
}
</style>
