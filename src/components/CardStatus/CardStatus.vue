<template>
  <ClientOnly v-if="isOpeningHoursEnabled" placeholder="...">
    <p
      class="card-status"
      :class="{ 'card-status--open': isOpen }"
      v-bind="$attrs"
    >
      <template v-if="isOpen">
        {{ $t("open") }}
        <SvgIcon name="location-open-icon" class="card-status__icon" />
      </template>
      <template v-else>
        {{ $t("closed") }}
        <SvgIcon name="location-closed-icon" class="card-status__icon" />
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

const props = defineProps<{ openingHours: OpeningHours[] }>();
const runtimeConfig = useRuntimeConfig();
const { isOpeningHoursEnabled } = runtimeConfig.public;

const isOpen = computed(() => {
  const indexToday = 0;
  const openingHoursToday = props.openingHours[indexToday].time; //TODO: will we still rely on daily deploys to determine the meaning of "today"?
  const now = new Date();

  return openingHoursToday.some(([startTime, endTime]) => {
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
