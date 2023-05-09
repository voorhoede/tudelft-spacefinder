<template>
  <div
    ref="root"
    class="space-detail-card"
  >
    <div class="space-detail-card__left-column">
      <div class="space-detail-card__header">
        <h2 class="space-detail-card__title">
          {{ space.name }}
        </h2>

        <div class="space-detail-card__seating">
          <SvgIcon
            name="seat-icon"
            class="space-detail-card__seating-icon"
          />
          {{ space.seats }}
        </div>
      </div>
      
      <p class="space-detail-card__description">
        {{ space.roomId }} | {{ space.floor }}
      </p>

      <SpaceFacilities
        :facilities="space.facilities"
        class="space-detail-card__facilities"
      />

      <CardStatus
        :opening-hours="space.openingHours"
        class="space-detail-card__open-status"
      />

      <OpeningHours
        :opening-hours-building="space.building.openingHours"
        :opening-hours-space="space.openingHours"
        :show-toggle-on-desktop="false"
      />
    </div>
    <div class="space-detail-card__right-column">
      <div
        v-if="space.image"
        class="space-detail-card__image"
      >
        <img
          :src="space.image.url"
          alt=""
        >
      </div>

      <div class="space-detail-card__occupancy-indicator">
        {{ space.building.abbreviation }}

        <OccupancyIndicator
          :active-devices="space.building.activeDevices"
          :total-seats="space.building.totalSeats"
          :occupancy="space.building.occupancy"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Space } from "~/types/Space";
defineProps<{ space: Space }>();

const root = ref(null as null | HTMLDivElement);

defineExpose({
  getClientHeight: () => root.value?.clientHeight,
});
</script>

<style>
@import "../app-core/variables.css";

.space-detail-card {
  display: flex;
  gap: var(--spacing-default);
  padding: var(--spacing-default);
  max-height: 70vh;
  background: var(--background-color);
  box-shadow: var(--shadow-small);
  overflow: auto;
}

@media (min-width: 700px) {
  .space-detail-card {
    padding: var(--spacing-default);
  }
}

.space-detail-card__left-column {
  flex: 1;
}

.space-detail-card__right-column {
  position: relative;
  flex: 0 0 30%;
}

.space-detail-card__header {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-half);
  font-weight: bold;
}

.space-detail-card__title {
  margin-bottom: .2rem;
  font-size: var(--font-size-default);
  font-weight: bold;
  line-height: 1.1;
}

.space-detail-card__seating {
  margin-top: -.1rem;
  white-space: nowrap;
}

.space-detail-card__seating-icon {
  margin: -2px 1px 0 0;
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

.space-detail-card__description {
  margin-bottom: var(--spacing-half);
  font-size: var(--font-size-smaller);
  font-weight: bold;
}

.space-detail-card__facilities {
  margin-left: -0.2rem;
}

.space-detail-card__open-status {
  margin: var(--spacing-default) 0 -1.4rem 0;
}

@media (min-width: 700px) {
  .space-detail-card__open-status {
    margin-bottom: 0;
  }
}

.space-detail-card__image {
  position: relative;
  height: 100%;
}

.space-detail-card__image img {
  position: absolute;
  margin-top: var(--spacing-default-negative);
  width: calc(100% + var(--spacing-default));
  height: calc(100% + var(--spacing-double));
  object-fit: cover;
}

.space-detail-card__occupancy-indicator {
  position: absolute;
  display: flex;
  align-items: center;
  gap: var(--spacing-half);
  padding: .13rem var(--spacing-three-quarter) 0 var(--spacing-three-quarter);
  top: var(--spacing-half);
  right: var(--spacing-half);
  border-radius: 2rem;
  background: var(--background-color);
  font-weight: bold;
}

.space-detail-card svg {
  fill: var(--text-color);
}

.space-detail-card__occupancy-indicator svg {
  margin-top: .3rem;
}
</style>
