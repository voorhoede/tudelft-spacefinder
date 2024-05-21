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
        />
      </div>

      <div class="building-header__open-wrapper">
        <ClientOnly>
          <CardStatus
            v-if="building.openingHoursPerDay"
            :opening-hours-per-day="building.openingHoursPerDay"
          />
          <OpeningHours
            v-if="building.openingHoursPerDay"
            :opening-hours-per-day="building.openingHoursPerDay"
          />
        </ClientOnly>
      </div>
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
  flex-wrap: wrap;
  padding: var(--spacing-default);
  font-size: var(--font-size-smaller);
  justify-content: space-between;
}

.building-header__spaces {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: var(--spacing-quarter);
}

.building-header__open-wrapper {
  position: relative;
  width: 100%;
}
</style>
