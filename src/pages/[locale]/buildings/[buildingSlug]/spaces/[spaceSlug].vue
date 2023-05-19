<template>
  <section
    v-if="space"
    class="space-detail"
  >
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
      :associated-spaces="associatedSpaces"
      class="space-detail__card"
      :is-header="true"
    />
  </section>
</template>

<script setup lang="ts">
import spaceMapImage from "~/lib/space-map-image";
import zoomLevels from "~/lib/zoom-levels";
import { useSpacesStore } from "~/stores/spaces";
import { useMapStore } from "~/stores/map";
import { storeToRefs } from "pinia";
import SpaceCard from "~/components/SpaceCard/SpaceCard.vue";

definePageMeta({ alias: "/:locale/gebouwen/:buildingSlug/ruimtes/:spaceSlug" });

const { $t } = useNuxtApp();
const spacesStore = useSpacesStore();
const mapStore = useMapStore();

const card = ref<InstanceType<typeof SpaceCard> | null>(null);

const { currentSpace: space, associatedSpaces } = storeToRefs(spacesStore);

const runtimeConfig = useRuntimeConfig();

const routeUrl = computed(
  () => space.value
        ? `https://www.google.com/maps/dir//${space.value.latitude},${space.value.longitude}` // There is a double // behind dir, that gives you the direction from your current location to the space otherwise it will give you the direction from the space to current location or other place
        : ''
);

onMounted(() => {
  mapStore.zoomToSpace([space.value!.longitude, space.value!.latitude], zoomLevels.spaceZoom);
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
    width: calc(var(--column-width-desktop) - var(--spacing-double));
  }

  .space-detail .button--back {
    left: var(--spacing-default);
  }

  .space-detail .button--route {
    left: calc(5 * var(--spacing-default))
  }
}
</style>
