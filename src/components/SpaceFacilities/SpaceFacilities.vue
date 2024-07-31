<template>
  <ul class="space-facility__list flat-list">
    <li
      v-for="(facility, index) in facilitiesPresent"
      :key="index"
      class="space-facility__item"
    >
      <Tooltip
        :delay="0"
        :overflow-padding="4"
        :instant-move="true"
        :triggers="['hover', 'click']"
      >
        <SvgIcon
          :name="getIconName(facility)"
          class="space-facility__icon"
          :class="{ 'space-facility__icon--new': iconMapping[facility] }"
        />
        <template #popper>
          {{ $t(facility) }}
        </template>
      </Tooltip>

      <span class="a11y-sr-only">
        {{ $t(facility) }}
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { SpaceFeatures } from "~/types/Filters";
import { Tooltip } from "floating-vue";
import "floating-vue/dist/style.css";

const props = defineProps<{ facilities: SpaceFeatures }>();
//TODO: inpredictable order?
//TODO: these should come as props
const facilitiesPresent = computed(() =>
  Object.entries(props.facilities)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) =>
      ["quietness"].includes(key) ? `${key}.${value}` : key
    )
);

const iconMapping = {
  computer: "computer-desktop--mini",
  dockingStation: "computer-desktop--mini",
  grouptables: "group-table--mini",
};

function getIconName(facilityValue: string) {
  if (iconMapping[facilityValue]) {
    return iconMapping[facilityValue];
  }

  return `facility-${facilityValue}-icon`;
}
</script>

<style>
@import "../app-core/variables.css";

.space-facility__list {
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.1rem;
}

.space-facility__item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
}

.space-facility__icon {
  display: block;
  width: 25px;
  height: 25px;
}

.space-facility__icon--new {
  width: 20px;
  height: 20px;
}

.space-facility__seating {
  margin-left: auto;
}

.space-facility__seating-icon {
  margin: 0 1px 0 0;
  display: block;
  width: 16px;
  height: 16px;
}

.v-popper--theme-tooltip .v-popper__inner {
  padding: var(--spacing-quarter) var(--spacing-half);
  background: var(--brand-secondary-color) !important;
  font-size: var(--font-size-smaller);
  color: var(--background-color);
  border-radius: 0;
}

.v-popper--theme-tooltip .v-popper__arrow-outer {
  border-color: var(--brand-secondary-color) !important;
}

.tooltip {
  display: block;
  z-index: var(--layer--popup);
}

.tooltip-inner {
  padding: var(--spacing-quarter) var(--spacing-half);
  background: var(--brand-secondary-color);
  font-size: var(--font-size-smaller);
  color: var(--background-color);
}

.tooltip-arrow {
  position: absolute;
  z-index: 1;
  margin: 5px;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: var(--brand-secondary-color);
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  margin-top: 0;
  margin-bottom: 0;
  bottom: -5px;
  left: calc(50% - 5px);
  border-width: 5px 5px 0 5px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
}
</style>
