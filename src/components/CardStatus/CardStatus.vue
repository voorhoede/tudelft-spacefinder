<template>
  <ClientOnly>
    <p
      class="card-status"
      :class="{ 'card-status--open': isOpen }"
      v-bind="$attrs"
    >
      <template v-if="isOpen">
        <SvgIcon
          name="location-open-icon"
          class="card-status__icon"
        />
        {{ $t("open") }}
      </template>
      <template v-else>
        <SvgIcon
          name="location-closed-icon"
          class="card-status__icon"
        />
        {{ $t("closed") }}
      </template>
    </p>
  </ClientOnly>
</template>

<script lang="ts"></script>

<script setup lang="ts">
import { spaceIsOpen } from "~/lib/filter-spaces";

const props = defineProps<{
  openingHoursPerDay: unknown;
}>();

const now = new Date();

const isOpen = computed(() => {
  return spaceIsOpen(now, props.openingHoursPerDay);
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
  vertical-align: middle;
  width: 11px;
  height: 11px;
  stroke: var(--text-color);
}

.card-status--open .card-status__icon {
  stroke: var(--brand-secondary-color);
}
</style>
