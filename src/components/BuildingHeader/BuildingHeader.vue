<template>
  <div class="building-header">
    <BuildingImage :building="building" />

    <h3 class="a11y-sr-only">
      {{ $t("seating") }}
    </h3>

    <div class="building-header__meta">
      <div class="building-header__spaces">
        <ul class="flat-list building-header__seating">
          <li>
            <SvgIcon
              name="seat-icon"
              class="building-header__seating-icon"
            />
            {{ building.totalSeats }}
          </li>
          <li>
            <SvgIcon
              name="door-icon"
              class="building-header__seating-icon"
            />
            {{ totalSpaces }}
          </li>
        </ul>
        <div class="building-header__occupancy">
          <OccupancyIndicator
            :active-devices="building.activeDevices"
            :total-seats="building.totalSeats"
            :occupancy="building.occupancy"
          />
        </div>
      </div>

      <CardStatus
        :opening-hours="building.openingHours"
        class="building-header__open-status"
      />
      <OpeningHours
        :opening-hours-building="building.openingHours"
        :opening-hours-space="building.openingHours"
        class="building-header__opening-hours"
      />
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

.building-header__seating {
  font-size: var(--font-size-smaller);
  font-weight: bold;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-default);
}

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
  margin-bottom: var(--spacing-half);
}

.building-header__seating li {
  display: flex;
  align-items: center;
}

.building-header__seating-icon {
  margin-right: var(--spacing-half);
  width: 15px;
  height: 15px;
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
