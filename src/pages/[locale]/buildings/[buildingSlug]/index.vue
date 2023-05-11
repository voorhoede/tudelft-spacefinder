<template>
  <section v-if="building">
    <BackButton
      :use-history="false"
      :to="$localePath('/buildings')"
      class="button--back"
    />
    <div class="default-layout__info building-layout">
      <BuildingHeader
        class="building-layout__header"
        :building="building"
      />
      <SpaceList
        class="building-layout__spaces"
        :spaces="spaces"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSpacesStore } from "~/stores/spaces";
import { useMapStore } from "~/stores/map";
import { storeToRefs } from "pinia";

definePageMeta({ alias: "/:locale/gebouwen/:buildingSlug" });

const runtimeConfig = useRuntimeConfig();
const { spacesMode } = runtimeConfig.public;

const { $t } = useNuxtApp();
const spacesStore = useSpacesStore();
const mapStore = useMapStore();

const { currentBuilding: building } = storeToRefs(spacesStore);

const spaces = computed(() =>
  spacesStore.filteredSpaces.filter(
    (space) => space.buildingNumber === building.value!.number
  )
);

useSpacefinderHead(
  computed(() =>
    building.value
      ? {
          title: `${building.value.name} (${building.value.abbreviation})`,
          description: `${
            spacesMode == "rooms"
              ? building.value.totalRooms
              : building.value.totalSpaces
          } ${$t("spaces")}`,
          image: {
            url: `${building.value.image.url}?auto=format&fm=jpg&auto=quality`,
          },
        }
      : { title: "" }
  )
);

onMounted(() => {
  mapStore.zoomToSelection();
});
</script>

<style>
.building-layout {
  display: flex;
  flex-direction: column;
  height: calc(100% - var(--navigation-height-mobile));
}

@media (min-width: 700px) {
  .building-layout {
    height: calc(100% - var(--navigation-height-desktop));
  }
}

.building-layout__header {
  flex: 0 0 1;
}

.building-layout__spaces {
  flex: 1 1 auto;
  padding-top: 0;
}
</style>
