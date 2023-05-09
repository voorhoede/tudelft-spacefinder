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

    <SpaceCard
      ref="card"
      :space="space"
      class="space-detail__card"
    />
  </section>
</template>

<script setup lang="ts">
import spaceMapImage from "~/lib/space-map-image";
import { useSpacesStore } from "~/stores/spaces";
import { useMapStore } from "~/stores/map";
import { storeToRefs } from "pinia";
import SpaceCard from "~/components/SpaceCard/SpaceCard.vue";

definePageMeta({ alias: "/:locale/gebouwen/:buildingSlug/ruimtes/:spaceSlug" });

const { $t, $isMobile } = useNuxtApp();
const spacesStore = useSpacesStore();
const mapStore = useMapStore();

const card = ref<InstanceType<typeof SpaceCard> | null>(null);

const { currentSpace: space } = storeToRefs(spacesStore);

const runtimeConfig = useRuntimeConfig();

const routeUrl = computed(
  () => space.value
        ? `https://www.google.com/maps/place/${space.value.latitude},${space.value.longitude}`
        : ''
);

onMounted(() => {
  const padding = $isMobile.value
    ? { bottom: card.value!.getClientHeight()! + 2 * 20 }
    : {};
  mapStore.zoomToSelection(padding);
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

.space-detail__card {
  z-index: var(--layer--overlay);
  position: absolute;
  left: var(--spacing-default);
  bottom: calc(var(--navigation-height-mobile) + var(--spacing-default));
  width: calc(100% - var(--spacing-double));
}

@media (min-width: 700px) {
  .space-detail__card {
    bottom: calc(var(--navigation-height-desktop) + var(--spacing-default));
    width: 600px;
  }

  /* .default-layout__map.default-layout__map {
    margin-left: 0;
    width: 100%;
  } */
}
</style>
