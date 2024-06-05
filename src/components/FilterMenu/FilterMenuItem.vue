<template>
  <input
    :id="inputId"
    v-model="spacesStore.filters[name]"
    :value="option"
    type="checkbox"
    class="a11y-sr-only filter-menu__filter"
  >
  <label :for="inputId">
    <SvgIcon
      v-if="showIcon"
      :name="iconName"
      :class="{
        'filter-menu__filter-icon--legacy': iconStyle === 'legacy',
        'filter-menu__filter-icon--new': iconStyle === 'new',
      }"
    />
    {{ label ?? $t(i18nKey) }}
  </label>
</template>

<script setup lang="ts">
import { useSpacesStore } from "~/stores/spaces";
import type { Filters } from "~/types/Filters";

const props = withDefaults(
  defineProps<{
    /** The name of the property to bind to in the global filter object */
    name: keyof Filters;
    /** The value that will be added to the global filter property with this item selected (if the property is an array) */
    option?: string | number;
    /** Combined with the option, used to determine the i18n key for the labe and the icon name. If not specified, name is used */
    displayKey?: string;
    /** Allows to override the label text */
    label?: string;
    /** Specify a specific icon to display in the item, which overwrites the computed iconName */
    icon?: string;
    /** False if you do not want to display an icon */
    showIcon?: boolean;
    iconStyle: "legacy" | "new";
  }>(),
  {
    option: undefined,
    displayKey: undefined,
    label: undefined,
    icon: undefined,
    showIcon: true,
    iconStyle: "legacy",
  }
);
const inputId = computed(() =>
  ["filter-item", props.name, props.option].filter(Boolean).join("-")
);
const i18nKey = computed(() =>
  [props.displayKey ?? props.name, props.option].filter(Boolean).join(".")
);
const iconName = computed(() => props.icon ?? `facility-${i18nKey.value}-icon`);

const spacesStore = useSpacesStore();
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

.filter-menu__filter-icon--legacy {
  margin-top: -2px;
  margin-left: var(--spacing-half-negative);
  width: 25px;
  height: 25px;
  vertical-align: middle;
}

.filter-menu__filter-icon--new {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-block-start: calc(1ex - 1cap);
  margin-left: var(--spacing-quarter-negative);
}
</style>
