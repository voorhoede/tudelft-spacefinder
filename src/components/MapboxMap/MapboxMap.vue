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
import debounce from "lodash.debounce";
import { storeToRefs } from "pinia";
import { useStore } from "~/stores/store";

//TODO: https://github.com/nuxt/nuxt/issues/14131
import mapMarker from "~/assets/icons/map-marker.png";
import campusBounds from "~/lib/campus-bounds";
import { i18nSlug } from "~/lib/i18n-slug";
import { useMapStore } from "~/stores/map";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

const runtimeConfig = useRuntimeConfig();
const { $locale, $localePath } = useNuxtApp();
const router = useRouter();
const store = useStore();
const mapStore = useMapStore();
const { mapLoaded } = storeToRefs(mapStore);

const mapContainer = ref(null as null | HTMLDivElement);

const onResizeDebounce = useDebounceFn(onResize, 200);

onMounted(() => {
  initMap(runtimeConfig.public.maxboxToken);
  mapStore.updateMarkers();
  window.addEventListener("resize", onResizeDebounce, true);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", onResizeDebounce, true);
});

//TODO: move to store
watch(
  () => store.filteredSpaces,
  () => mapStore.updateMarkers()
);

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
  const observer = new MutationObserver((mutations) => {
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
  let l: Partial<mapboxgl.LngLatBoundsLike> = {};

  map.on("load", () => {
    map.loadImage(mapMarker, (error: any, image: any) => {
      if (error) {
        console.error("a mapbox error occurred");
        return;
      }
      map.addImage("marker-icon", image);
      map.addLayer({
        id: "points",
        interactive: true,
        type: "symbol",
        source: {
          type: "geojson",
          data: mapStore.geoJsonSpaces,
        },
        layout: {
          "icon-image": "marker-icon",
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
      if (!properties.buildingNumber || !properties.spaceId) {
        return;
      }
      const buildingSlug =
        i18nSlug(
          $locale.value,
          store.getBuildingByNumber(properties.buildingNumber as number)
        ) ?? "";
      const spaceSlug =
        i18nSlug(
          $locale.value,
          store.getSpaceById(properties.spaceId as string)
        ) ?? "";
      const url = $localePath("/buildings/:buildingSlug/spaces/:spaceSlug", {
        buildingSlug,
        spaceSlug,
      });
      router.push(url);
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
