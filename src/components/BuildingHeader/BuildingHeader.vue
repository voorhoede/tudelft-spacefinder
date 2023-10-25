<template>
  <div class="building-header">
    <BuildingImage :building="building" />

    <div class="building-header__meta">
      <div class="building-header__spaces">
        <BuildingMeta
          :spaces="totalSpaces"
          :seats="building.totalSeats"
        />
        <OccupancyIndicator
          :active-devices="building.activeDevices"
          :total-seats="building.totalSeats"
          :occupancy="building.occupancy"
          class="building-header__occupancy"
        />
      </div>

      <CardStatus
        :opening-hours="building.openingHours"
        class="building-header__open-status"
      />
      <ClientOnly>
        <OpeningHours
          v-if="building.openingHours"
          :opening-hours-building="building.openingHours"
          :opening-hours-space="building.openingHours"
          class="building-header__opening-hours"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Building } from "~/types/Building";

const props = defineProps<{ building: Building }>();
const runtimeConfig = useRuntimeConfig();
const totalSpaces = computed(() =>
  runtimeConfig.public.spacesMode == "rooms"
    ? props.building.totalRooms
    : props.building.totalSpaces
);
</script>

<style>
@import "../app-core/variables.css";

.building-header__meta {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: var(--spacing-default);
}

.building-header__spaces {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-quarter);
}

.building-header__occupancy {
  margin-top: var(--spacing-quarter);
}

.building-header__open-status {
  font-size: var(--font-size-smaller);
}

.building-header__opening-hours {
  flex: 0 0 100%;
  margin-top: -1.5rem;
  font-size: var(--font-size-smaller);
}
</style>
