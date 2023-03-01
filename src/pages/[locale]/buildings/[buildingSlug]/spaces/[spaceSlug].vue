<template>
  <section v-if="space && building">
    <BackButton
      :to="
        $localePath('/buildings/:buildingSlug', {
          buildingSlug: building.slug,
        })
      "
    />

    <div class="space-detail__share-button">
      <SocialShare :url="shareUrl" />
    </div>

    <div class="default-layout__info default-layout__info--space-detail">
      <SpaceDetailCard ref="card" :space="space" :building="building" />
    </div>
  </section>
</template>

<script setup lang="ts">
import metaHead from "~/lib/meta-head";
import spaceMapImage from "~/lib/space-map-image";
import { useStore } from "~/stores/store";
import { useMapStore } from "~/stores/map";

definePageMeta({
  alias: "/:locale/gebouwen/:buildingSlug/ruimtes/:spaceSlug",
});

const { $t } = useNuxtApp();
const store = useStore();
const mapStore = useMapStore();
const route = useRoute();

//TODO
const card = ref<InstanceType<typeof SpaceDetailCard> | null>(null);

const space = computed(() =>
  store.getSpaceBySlug(route.params.spaceSlug as string)
);

const building = computed(() => space.value?.building);

const runtimeConfig = useRuntimeConfig();

const shareUrl = computed(
  () => `${runtimeConfig.public.baseUrl}${route.fullPath}`
);

onMounted(() => {
  const padding = store.isMobile
    ? { bottom: card.value!.getClientHeight()! + 2 * 20 }
    : {};
  store.selectBuilding(building.value);
  store.selectSpace(space.value);
  mapStore.zoomToSelection(padding);
  mapStore.getMap().then(() => mapStore.updateMarkers());
});

useHead(() => {
  if (!space.value || !building.value) return {};
  return metaHead({
    title: `${space.value.name} (${space.value.roomId}) @ ${building.value.name} (${building.value.abbreviation})`,
    description: `${space.value.seats} ${$t("seatsDescription")}`,
    image: spaceMapImage(space.value, runtimeConfig.public.maxboxToken),
  });
});
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

.space-detail__share-button {
  z-index: var(--layer--popup);
  position: fixed;
  top: calc(var(--header-height-mobile) + var(--spacing-default));
  left: calc(var(--spacing-double) + 50px);
}

@media (min-width: 700px) {
  .space-detail__share-button {
    top: calc(var(--header-height-desktop) + var(--spacing-default));
    left: calc(var(--column-width-desktop) + var(--spacing-double) + 50px);
  }
}
</style>
