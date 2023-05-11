<template>
  <section v-if="space">
    <BackButton
      :to="$localePath('/buildings/:buildingSlug', { space })"
      class="button--back"
    />

    <RouteButton
      v-if="routeUrl"
      :to="routeUrl"
      class="button--route"
    />

    <div class="default-layout__info default-layout__info--space-detail">
      <SpaceDetailCard
        ref="card"
        :space="space"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import spaceMapImage from "~/lib/space-map-image";
import { useSpacesStore } from "~/stores/spaces";
import { useMapStore } from "~/stores/map";
import { storeToRefs } from "pinia";
import SpaceDetailCard from "~/components/SpaceDetailCard/SpaceDetailCard.vue";

definePageMeta({ alias: "/:locale/gebouwen/:buildingSlug/ruimtes/:spaceSlug" });

const { $t } = useNuxtApp();
const spacesStore = useSpacesStore();
const mapStore = useMapStore();

const card = ref<InstanceType<typeof SpaceDetailCard> | null>(null);

const { currentSpace: space } = storeToRefs(spacesStore);

const runtimeConfig = useRuntimeConfig();

const routeUrl = computed(
  () => space.value
        ? `https://www.google.com/maps/place/${space.value.latitude},${space.value.longitude}`
        : ''
);

onMounted(() => {
  mapStore.zoomToSpace([space.value!.longitude, space.value!.latitude], 19);
});

useSpacefinderHead(
  computed(() =>
    space.value
      ? {
          title: `${space.value.name} (${space.value.roomId}) @ ${space.value.building.name} (${space.value.building.abbreviation})`,
          description: `${space.value.seats} ${$t("seatsDescription")}`,
          image: spaceMapImage(space.value, runtimeConfig.public.mapboxToken),
        }
      : { title: "" }
  )
);
</script>

<style>
@import "@/components/app-core/variables.css";

@media (max-width: 699px) {
  .default-layout__info--space-detail
    ~ .default-layout__map
    .mapbox-map__zoom-controls {
    display: none;
  }
}
</style>
