<template>
  <div ref="mapContainer" class="mapbox-map">
    <div v-if="!mapLoaded" class="mapbox-map__placeholder">
      <span class="mapbox-map__loading-message">{{ $t("mapLoading") }}</span>
    </div>
    <ZoomControls
      v-if="mapLoaded"
      class="mapbox-map__zoom-controls"
      @auto-focus="autoFocus"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
    />
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

onMounted(() => {
  initMap(runtimeConfig.public.mapboxToken);
  mapStore.updateMarkers();
  window.addEventListener("resize", onResizeDebounce, true);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", onResizeDebounce, true);
});

function autoFocus() {
  mapStore.zoomAuto();
}
function zoomIn() {
  mapStore.zoomIn();
}
function zoomOut() {
  mapStore.zoomOut();
}
function onResize() {
  mapStore.resizeMap();
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
    style: "mapbox://styles/mapbox/streets-v10",
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

  map.on("load", () => {
    const markerNames = [...OCCUPANCY_RATES, "default"] as const;
    Promise.all(
      markerNames.map((occupancy) => addMarker(map, `map-marker-${occupancy}`))
    ).then(() => {
      const occupancyIconNamePairs = OCCUPANCY_RATES.reduce(
        (acc, occupancy) => [...acc, occupancy, `map-marker-${occupancy}`],
        [] as string[]
      );
      map.addLayer({
        id: "points",
        interactive: true,
        type: "symbol",
        source: {
          type: "geojson",
          data: mapStore.geoJsonSpaces,
          promoteId: "spaceSlug",
        },
        layout: {
          "icon-image": [
            "match", // A rule to determine the icon for the point...
            ["get", "buildingOccupancy"], // ... is that if the `buildingOccupancy` property matches...
            ...occupancyIconNamePairs, // ... the first element of the pair from this (flat) sequence, the second element defines the name of the icon
            "map-marker-default", //And the final element determines the default icon
          ],
          "icon-allow-overlap": true,
        },
      });
      fixInsecureLinks();
      mapStore.setMap(map);
    });
  });
  map.on("click", (e: any) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["points"],
    });
    if (features.length) {
      const properties = features[0].properties || {};
      if (!properties.buildingSlug || !properties.spaceSlug) {
        return;
      }
      router.push(
        $localePath("/buildings/:buildingSlug/spaces/:spaceSlug", {
          buildingSlug: properties.buildingSlug as string,
          spaceSlug: properties.spaceSlug as string,
        })
      );
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
