<template>
  <NuxtLink
    :to="buildingRoute({ buildingSlug: building.slug })"
    class="building-card card"
  >
    <BuildingImage :building="building" class="building-card__image" />

    <div class="building-card__meta">
      <ul class="flat-list building-card__seating">
        <li>{{ building.totalSpaces }} {{ $t("locations") }}</li>
        <li>{{ building.totalSeats }} {{ $t("seats") }}</li>
      </ul>

      <CardStatus
        :opening-hours="building.openingHours"
        class="building-card__status"
      />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Building } from "~/types/Building";
defineProps<{ building: Building }>();
const { buildingRoute } = useLocaleRoute();
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
</style>