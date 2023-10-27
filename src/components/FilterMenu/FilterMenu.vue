<template>
  <ModalDrawer
    :is-open="isOpen"
    :title="$t('filter')"
    @close="$emit('close')"
  >
    <form
      class="filter-menu"
      @submit.prevent
    >
      <div class="filter-menu__filters">
        <fieldset class="filter-menu__filter-group">
          <legend class="h3">
            {{ $t("occupancy") }}
            <span
              v-if="updatedAt"
              class="filter-menu__legend-meta"
            >
              {{ $t('updated') }}:
              {{ updatedAt }}
            </span>
          </legend>
          <FilterMenuItem
            v-for="occupancy in OCCUPANCY_RATES"
            name="buildingOccupancy"
            display-key="occupancy"
            :option="occupancy"
            :icon="`facility-occupancy.${occupancy}-dark-icon`"
            :key="occupancy"
          />
        </fieldset>
        <fieldset class="filter-menu__filter-group">
          <legend class="h3">
            {{ $t("quietness") }}
          </legend>
          <FilterMenuItem
            name="quietness"
            option="silent"
          />
          <FilterMenuItem
            name="quietness"
            option="quiet"
          />
          <FilterMenuItem
            name="quietness"
            option="noisy"
          />
        </fieldset>

        <fieldset class="filter-menu__filter-group">
          <legend class="h3">
            {{ $t("computerFacilities") }}
          </legend>
          <FilterMenuItem name="powerOutlets" />
        </fieldset>

        <fieldset class="filter-menu__filter-group">
          <legend class="h3">
            {{ $t("locationFacilities") }}
          </legend>
          <FilterMenuItem name="adjustableChairs" />
          <FilterMenuItem name="daylit" />
          <FilterMenuItem name="grouptables" />
        </fieldset>

        <fieldset class="filter-menu__filter-group">
          <legend class="h3">
            {{ $t("nearbyFacilities") }}
          </legend>
          <FilterMenuItem name="nearBathroom" />
          <FilterMenuItem name="nearCoffeeMachine" />
          <FilterMenuItem name="nearPrinter" />
        </fieldset>

        <fieldset class="filter-menu__filter-group">
          <legend class="h3">
            {{ $t("collaborationFacilities") }}
          </legend>
          <FilterMenuItem name="whiteBoard" />
          <FilterMenuItem name="presentationScreen" />
        </fieldset>

        <fieldset class="filter-menu__filter-group">
          <legend class="h3">
            {{ $t("buildingTitle") }}
          </legend>
          <FilterMenuItem
            v-for="building in buildings"
            :key="building.number"
            name="buildings"
            :option="building.number"
            :show-icon="false"
            :label="building.abbreviation"
          />
        </fieldset>
      </div>

      <div class="filter-menu__buttons">
        <input
          id="show-open-locations"
          v-model="filters.showOpenLocations"
          :value="filters.showOpenLocations"
          type="checkbox"
          class="filter-menu__checkbox a11y-sr-only"
        >
        <label for="show-open-locations">
          {{ $t("showOpenLocations") }}
        </label>

        <button
          class="button button--secondary"
          @click="clearFilters"
        >
          {{ $t("clearFilters") }}
        </button>

        <button
          class="button button--primary"
          @click="$emit('close')"
        >
          {{ $t("showLocations", spaceCount) }}
        </button>
      </div>
    </form>
  </ModalDrawer>
</template>

<script setup lang="ts">
const { $locale } = useNuxtApp();
import { storeToRefs } from "pinia";
import { useIntervalFn } from "@vueuse/core"
import { useSpacesStore } from "~/stores/spaces";
import { OCCUPANCY_RATES } from "~/types/Filters";

defineProps<{ isOpen?: boolean }>();

const spacesStore = useSpacesStore();

const { filters, buildings } = storeToRefs(spacesStore);

const spaceCount = computed(() =>
  spacesStore.currentSelection?.level == "building"
    ? spacesStore.filteredSpaces.filter(
      (space) => space.buildingNumber === spacesStore.currentBuilding!.number
    ).length
    : spacesStore.filteredSpaces.length
);

function getRelativeTimeString(date: Date): string {
  const deltaSeconds = Math.round((date.getTime() - Date.now()) / 1000);

  const cutoffs = [60, 3600, 86400, Infinity];
  // Array equivalent to the above but in the string representation of the units
  const units: Intl.RelativeTimeFormatUnit[] = ["second", "minute", "hour"];

  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));
  // Get the divisor to divide from the seconds.
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  const rtf = new Intl.RelativeTimeFormat($locale.value, { numeric: "auto" });
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}

const updatedAt = ref();
const { resume, pause } = useIntervalFn(() => {
  if (!spacesStore.updatedAt)
    return;

  updatedAt.value = getRelativeTimeString(spacesStore.updatedAt)
}, 5000);

onMounted(() => { resume(); })
onUnmounted(() => { pause(); })

function clearFilters() {
  spacesStore.clearFilters();
}
</script>

<style>
@import "../app-core/variables.css";

.filter-menu {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

.filter-menu__filter-group {
  margin-bottom: var(--spacing-half);
}

.filter-menu__filter-group:last-child {
  margin-bottom: 0;
}

@media (min-width: 700px) {
  .filter-menu__filter-group {
    margin-bottom: var(--spacing-default);
  }
}

.filter-menu__filters {
  flex: 1 1 0;
  padding: var(--spacing-default);
  overflow: auto;
  background: linear-gradient(
      var(--background-color) 30%,
      rgba(255, 255, 255, 0)
    ),
    linear-gradient(rgba(255, 255, 255, 0), var(--background-color) 70%) 0 100%,
    radial-gradient(
      farthest-side at 50% 0,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0)
    ),
    radial-gradient(
        farthest-side at 50% 100%,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0)
      )
      0 100%;
  background-repeat: no-repeat;
  background-color: var(--background-color);
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 5px;
  background-attachment: local, local, scroll, scroll;
  -webkit-overflow-scrolling: touch;
}

.filter-menu__checkbox + label {
  flex: 0 0 100%;
  position: relative;
  font-size: var(--font-size-smaller);
  cursor: pointer;
  margin-bottom: var(--spacing-default);
}

.filter-menu__checkbox + label:before {
  content: "";
  display: inline-block;
  margin-right: var(--spacing-quarter);
  width: 20px;
  height: 20px;
  border: 2px solid var(--text-color);
  vertical-align: middle;
}

.filter-menu__checkbox:hover + label:before,
.filter-menu__checkbox:focus + label:before {
  border-color: var(--brand-primary-color);
}

.filter-menu__checkbox:checked + label:after {
  content: "";
  position: absolute;
  display: inline-block;
  left: 4px;
  top: 5px;
  width: 12px;
  height: 12px;
  background: url("~/assets/icons/checkmark-icon.svg") center no-repeat;
  background-size: 12px 12px;
}

.filter-menu__buttons {
  flex: 0 0 auto;
  display: flex;
  flex-wrap: wrap;
  padding: var(--spacing-default);
}

.filter-menu__buttons > * {
  flex: 1 1 auto;
}

.filter-menu__buttons .button--secondary {
  margin: 0 var(--spacing-half) 0 0;
}

.filter-menu__buttons .button--primary {
  margin: 0 0 0 var(--spacing-half);
}

.filter-menu__legend-meta {
  display: block;
  font-family: var(--font-body);
  margin-bottom: var(--spacing-quarter);
}
</style>
