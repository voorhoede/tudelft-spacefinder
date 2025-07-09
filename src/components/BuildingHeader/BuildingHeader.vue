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
      <div
        class="building-header__remark"
        v-if="building.remark"
      >
        <SvgIcon
          class="building-header__remark-icon"
          name="information-circle"
        />
        <span v-html="building.remark" />
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
    : props.building.totalSpaces,
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
  row-gap: var(--spacing-half);
}

.building-header__spaces {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: var(--spacing-half-negative);
}

.building-header__open-wrapper {
  position: relative;
  width: 100%;
}

.building-header__remark {
  display: flex;
  width: 100%;
  align-items: center;
  padding-inline: var(--spacing-half);
  padding-block: var(--spacing-default);
  column-gap: var(--spacing-half);
  background: var(--brand-primary-color-light);
  font-weight: bold;
  
  span {
    max-width: 60ch;
    text-box-edge: cap alphabetic;
    text-box-trim: trim-both;
  }
}

.building-header__remark-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}
</style>
