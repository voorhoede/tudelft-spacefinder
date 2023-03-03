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
import spaceMapImage from "~/lib/space-map-image";
import { useStore } from "~/stores/store";
import { useMapStore } from "~/stores/map";
import { storeToRefs } from "pinia";
import SpaceDetailCard from "~/components/SpaceDetailCard.vue";

definePageMeta({ alias: "/:locale/gebouwen/:buildingSlug/ruimtes/:spaceSlug" });

const { $t } = useNuxtApp();
const store = useStore();
const mapStore = useMapStore();
const route = useRoute();

const card = ref<InstanceType<typeof SpaceDetailCard> | null>(null);

const {
  currentBuilding: building,
  currentSpace: space,
  isMobile,
} = storeToRefs(store);

const runtimeConfig = useRuntimeConfig();

const shareUrl = computed(
  () => `${runtimeConfig.public.baseUrl}${route.fullPath}`
);

onMounted(() => {
  const padding = isMobile.value
    ? { bottom: card.value!.getClientHeight()! + 2 * 20 }
    : {};
  mapStore.zoomToSelection(padding);
});

useSpacefinderHead(
  computed(() =>
    building.value && space.value
      ? {
          title: `${space.value.name} (${space.value.roomId}) @ ${building.value.name} (${building.value.abbreviation})`,
          description: `${space.value.seats} ${$t("seatsDescription")}`,
          image: spaceMapImage(space.value, runtimeConfig.public.maxboxToken),
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
