<template>
  <NuxtLink
    :to="$localePath('/buildings/:buildingSlug/spaces/:spaceSlug', { space })"
    class="space-card card"
  >
    <div class="space-card__header">
      <h3>{{ space.name }}</h3>
      <div v-if="showBuildingOccupancy">
        <OccupancyIndicator
          :active-devices="space.building.activeDevices ?? 0"
          :total-seats="space.building.totalSeats"
          :occupancy="space.building.occupancy ?? 'quiet'"
        />
      </div>
    </div>
    <div class="space-card__info">
      <div class="space-card__location">
        <em>{{ space.building.abbreviation }}</em> - {{ space.roomId }}
      </div>
      <CardStatus
        :opening-hours="space.openingHours"
        class="space-card__status"
      />
    </div>

    <h4 class="a11y-sr-only">
      {{ $t("facilities") }}
    </h4>

    <SpaceFacilities
      :facilities="space.facilities"
      :seats="space.seats"
      class="space-card__facilities"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
import { type Space } from "~/types/Space";
import { type Room } from "~/types/Room";
defineProps<{ space: Space | Room; showBuildingOccupancy: boolean }>();
</script>

<style>
@import "../app-core/variables.css";

@media (min-width: 700px) {
  .space-card {
    padding: var(--spacing-default);
  }
}

.space-card svg {
  fill: var(--text-color);
}

.space-card:hover svg,
.space-card:focus svg {
  fill: var(--brand-primary-color-dark);
}

.space-card__header {
  display: flex;
  justify-content: space-between;
}

.space-card__info {
  display: flex;
  margin-bottom: var(--spacing-default);
}

.space-card__location {
  flex: 1 1 auto;
  line-height: 1.3;
  font-size: var(--font-size-smaller);
}

.space-card__location em {
  font-weight: bold;
  font-style: normal;
}

.space-card__status {
  flex: 0 0 auto;
}

.space-card__facilities {
  margin-left: -0.2rem;
}
</style>
