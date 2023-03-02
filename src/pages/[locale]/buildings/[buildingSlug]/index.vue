<template>
  <section v-if="building">
    <BackButton :use-history="false" :to="$localePath('/buildings')" />
    <div class="default-layout__info building-layout">
      <BuildingHeader class="building-layout__header" :building="building" />
      <SpaceList class="building-layout__spaces" :spaces="spaces" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useStore } from "~/stores/store";
import { useMapStore } from "~/stores/map";
import { storeToRefs } from "pinia";

definePageMeta({ alias: "/:locale/gebouwen/:buildingSlug" });

const { $t } = useNuxtApp();
const store = useStore();
const mapStore = useMapStore();

const { currentBuilding: building } = storeToRefs(store);

const spaces = computed(() =>
  store.filteredSpaces.filter((space) => space.building === building.value)
); //TODO: rly?

useSpacefinderHead(
  computed(() =>
    building.value
      ? {
          title: `${building.value.name} (${building.value.abbreviation})`,
          description: `${building.value.totalSpaces} ${$t("spaces")}`,
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
}

.building-layout__header {
  flex: 0 0 1;
}

.building-layout__spaces {
  flex: 1 1 auto;
  padding-top: 0;
}
</style>
