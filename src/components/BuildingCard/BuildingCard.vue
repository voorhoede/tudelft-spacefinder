<template>
  <NuxtLink
    :to="$localePath('/buildings/:buildingSlug', { building })"
    class="building-card card"
  >
    <BuildingImage :building="building" class="building-card__image" />

    <div class="building-card__meta">
      <ul class="flat-list building-card__seating">
        <li>{{ totalSpaces }} {{ $t("locations") }}</li>
        <li>{{ building.totalSeats }} {{ $t("seats") }}</li>
      </ul>

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

.building-card__image {
  margin: var(--spacing-half-negative) var(--spacing-half-negative)
    var(--spacing-half) var(--spacing-half-negative);
}

.building-card__meta {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-smaller);
}

.building-card__seating {
  display: flex;
}

.building-card__seating li:not(:last-child):after {
  content: "|";
  display: inline-block;
  margin: 0 var(--spacing-quarter);
}

.building-card__status {
  flex: 0 0 auto;
}

.building-card__occupancy {
  flex: 0 0 auto;
  width: 60px;
  height: 24px;
}
</style>
