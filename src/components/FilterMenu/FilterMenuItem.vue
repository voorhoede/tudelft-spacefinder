<template>
  <input
    :id="inputId"
    v-model="spacesStore.filters[name]"
    :value="option"
    type="checkbox"
    class="a11y-sr-only filter-menu__filter"
  />
  <label :for="inputId">
    <SvgIcon
      v-if="showIcon"
      :name="iconName"
      class="filter-menu__filter-icon"
    />
    {{ $t(i18nKey) }}
  </label>
</template>

<script setup lang="ts">
import { useSpacesStore } from "~/stores/spaces";
import type { Filters } from "~/types/Filters";

const props = withDefaults(
  defineProps<{
    name: keyof Filters;
    option?: string | number;
    showIcon?: boolean;
  }>(),
  { showIcon: true }
);
const inputId = computed(() =>
  ["filter-item", props.name, props.option].filter(Boolean).join("-")
);
const i18nKey = computed(() =>
  [props.name, props.option].filter(Boolean).join(".")
);
const iconName = computed(() => `facility-${i18nKey.value}-icon`);

const spacesStore = useSpacesStore();
//const { filters } = storeToRefs(spacesStore);
</script>

<style>
@import "../app-core/variables.css";

.filter-menu__filter + label {
  display: inline-block;
  margin: 0 var(--spacing-quarter) var(--spacing-half) 0;
  padding-right: var(--spacing-default);
  padding-left: var(--spacing-default);
  font-size: var(--font-size-smaller);
  background: var(--highlight-color);
  border: 1px solid transparent;
  border-radius: 1rem;
  line-height: 2rem;
  cursor: pointer;
}

.filter-menu__filter:hover + label,
.filter-menu__filter:focus + label {
  color: var(--brand-primary-color-dark);
  border: 1px solid var(--brand-primary-color-dark);
}

.filter-menu__filter:checked + label {
  background: var(--brand-primary-color-light);
}

.filter-menu__filter-icon {
  margin-top: -2px;
  margin-left: var(--spacing-half-negative);
  width: 25px;
  height: 25px;
  vertical-align: middle;
}
</style>
