<template>
  <div class="filter-menu-item-range">
    <SvgIcon
      v-if="showIcon"
      :name="iconName"
      class="filter-menu-item-range__icon"
    />

    <input
      :id="inputId"
      v-model.number="spacesStore.filters[name]"
      type="range"
      min="0"
      :max="maxValue"
      class="filter-menu-item-range__input"
    >

    <label :for="inputId">
      {{ labelValue ?? $t('noSeatsFilterLabel') }}
      <span class="a11y-sr-only">
        {{ label ?? $t(i18nKey) }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { useSpacesStore } from "~/stores/spaces";
import type { Filters } from "~/types/Filters";

const props = withDefaults(
  defineProps<{
    /** The name of the property to bind to in the global filter object */
    name: keyof Filters;
    /** Used to determine the i18n key for the labe and the icon name. If not specified, name is used */
    displayKey?: string;
    /** Allows to override the label text */
    label?: string;
    /** False if you do not want to display an icon */
    showIcon?: boolean;
    /** The maximum input value of the range slider */
    maxValue?: number;
  }>(),
  {
    displayKey: undefined,
    label: undefined,
    showIcon: true,
    maxValue: 10,
  }
);

const inputId = computed(() =>
  `filter-item-${props.name}`
);

const i18nKey = computed(() =>
  [props.displayKey ?? props.name].filter(Boolean).join(".")
);

const iconName = computed(() => `facility-${i18nKey.value}-icon`);

const labelValue = computed(() => {
  if (spacesStore.filters[props.name] == 0) {
    return null
  } else if (spacesStore.filters[props.name] == 10) {
    return `${spacesStore.filters[props.name]}+`
  } else {
    return spacesStore.filters[props.name]
  }
});

const spacesStore = useSpacesStore();
</script>

<style>
@import "../app-core/variables.css";

.filter-menu-item-range {
  display: inline-flex;
  align-items: center;
  margin: 0 var(--spacing-quarter) var(--spacing-half) 0;
  padding-right: var(--spacing-three-quarter);
  padding-left: var(--spacing-default);
  font-size: var(--font-size-smaller);
  background: var(--highlight-color);
  border: 1px solid transparent;
  border-radius: 1rem;
  line-height: 2rem;
}

.filter-menu-item-range__icon {
  margin-left: var(--spacing-half-negative);
  margin-bottom: -11px;
  width: 25px;
  height: 25px;
}

.filter-menu-item-range__input {
  appearance: none;
  margin-right: var(--spacing-half);
  width: 125px;
  cursor: pointer;
  background: transparent;
}

.filter-menu-item-range__input::-webkit-slider-runnable-track {
  background: var(--text-color);
  height: 2px;
  border-radius: 2px;
}

.filter-menu-item-range__input::-moz-range-track {
  background: var(--text-color);
  height: 2px;
  border-radius: 2px;
}

.filter-menu-item-range__input::-webkit-slider-thumb {
  appearance: none;
  margin-top: -7px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: var(--brand-primary-color);
}

.filter-menu-item-range__input::-moz-range-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: var(--brand-primary-color);
}
</style>
