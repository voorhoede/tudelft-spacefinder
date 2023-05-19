<template>
  <NuxtLink
    :to="$localePath('/buildings/:buildingSlug', { building })"
    class="building-card card"
  >
    <BuildingImage
      :building="building"
      :is-header="isHeader"
      class="building-card__image"
    />

    <div class="building-card__meta">
      <BuildingMeta
        :spaces="totalSpaces"
        :seats="building.totalSeats"
      />

      <CardStatus
        :opening-hours="building.openingHours"
        class="building-card__status"
      />

      <div class="building-card__occupancy">
        <OccupancyIndicator
          :active-devices="building.activeDevices"
          :total-seats="building.totalSeats"
          :occupancy="building.occupancy"
        />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Building } from "~/types/Building";
const props = defineProps<{ building: Building, isHeader?: boolean }>();
const runtimeConfig = useRuntimeConfig();
const totalSpaces = computed(() =>
  runtimeConfig.public.spacesMode == "rooms"
    ? props.building.totalRooms
    : props.building.totalSpaces
);
</script>

<style>
@import "../app-core/variables.css";

.building-card:hover svg,
.building-card:focus svg {
  fill: var(--brand-primary-color-dark);
}

.building-card__image {
  margin: var(--spacing-half-negative) var(--spacing-half-negative)
    var(--spacing-half) var(--spacing-half-negative);
}

.building-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-smaller);
}

.building-card__status {
  flex: 0 0 auto;
  margin-left: auto;
}

.building-card__occupancy {
  flex: 0 0 14px;
  margin-top: var(--spacing-quarter);
  margin-left: var(--spacing-three-quarter);
  height: 24px;
}
</style>
