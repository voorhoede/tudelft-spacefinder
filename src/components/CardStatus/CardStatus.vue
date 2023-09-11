<template>
  <ClientOnly>
    <p
      v-if="openingHours"
      class="card-status"
      :class="{ 'card-status--open': isOpen }"
      v-bind="$attrs"
    >
      <template v-if="isOpen">
        {{ $t("open") }}
        <SvgIcon
          name="location-open-icon"
          class="card-status__icon"
        />
      </template>
      <template v-else>
        {{ $t("closed") }}
        <SvgIcon
          name="location-closed-icon"
          class="card-status__icon"
        />
      </template>
    </p>
  </ClientOnly>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import type { OpeningHours } from "~/types/OpeningHours";

const props = defineProps<{ openingHours?: OpeningHours[] }>();

const isOpen = computed(() => {
  const now = new Date();
  const dayNames = ["su", "mo", "tu", "we", "th", "fr", "sa"];
  const indexToday = dayNames[now.getDay()];
  const openingHoursToday = props.openingHours?.find(({ day }) => day === indexToday)?.time;

  return openingHoursToday?.some(([startTime, endTime]) => {
    return now >= new Date(startTime) && now <= new Date(endTime);
  });
});
</script>

<style>
.card-status {
  font-size: var(--font-size-smaller);
}

.card-status--open {
  color: var(--brand-secondary-color);
}

.card-status__icon {
  width: 11px;
  height: 11px;
  stroke: var(--text-color);
}

.card-status--open .card-status__icon {
  stroke: var(--brand-secondary-color);
}
</style>
