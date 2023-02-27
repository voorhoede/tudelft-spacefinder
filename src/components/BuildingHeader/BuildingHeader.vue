<template>
  <div class="building-header">
    <building-image :building="building" />

    <h3 class="a11y-sr-only">
      {{ $t("seating") }}
    </h3>

    <div class="building-header__meta">
      <ul class="flat-list building-header__seating">
        <li>
          <svg-icon name="seat-icon" class="building-header__seating-icon" />
          {{ building.totalSeats }}
        </li>
        <li>
          <svg-icon name="door-icon" class="building-header__seating-icon" />
          {{ building.totalSpaces }}
        </li>
      </ul>

      <card-status
        :opening-hours="building.openingHours"
        class="building-header__open-status"
      />
      <opening-hours
        :opening-hours-building="building.openingHours"
        :opening-hours-space="building.openingHours"
        class="building-header__opening-hours"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Building } from "~/types/Building";

defineProps<{ building: Building }>();
</script>

<style>
@import "../app-core/variables.css";

.building-header__seating {
  font-size: var(--font-size-smaller);
  font-weight: bold;
}

.building-header__meta {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: var(--spacing-default);
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

.building-header__open-status {
  font-size: var(--font-size-smaller);
  text-align: right;
}

.building-header__opening-hours {
  flex: 0 0 100%;
  margin-top: -1.2rem;
  font-size: var(--font-size-smaller);
}
</style>
