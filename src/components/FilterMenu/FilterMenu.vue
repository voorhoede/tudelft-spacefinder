<template>
  <ModalDrawer :is-open="isOpen" :title="$t('filter')" @close="$emit('close')">
    <form class="filter-menu" @submit.prevent>
      <div class="filter-menu__filters">
        <fieldset class="filter-menu__filter-group">
          <legend class="h3">
            {{ $t("quietness") }}
          </legend>

          <span v-for="option in optionsPerFilter.quietness" :key="option">
            <input
              :id="`quietness-${option}`"
              v-model="filters.quietness"
              :value="option"
              type="checkbox"
              class="a11y-sr-only filter-menu__filter"
            />
            <label :for="`quietness-${option}`">
              <SvgIcon
                :name="`facility-quietness.${option}-icon`"
                class="filter-menu__filter-icon"
              />
              {{ $t(`quietness.${option}`) }}
            </label>
          </span>
        </fieldset>

        <fieldset class="filter-menu__filter-group">
          <legend class="h3">
            {{ $t("studyType") }}
          </legend>

          <span v-for="option in optionsPerFilter.studyType" :key="option">
            <input
              :id="`study-type-${option}`"
              v-model="filters.studyType"
              :value="option"
              type="checkbox"
              class="a11y-sr-only filter-menu__filter"
            />
            <label :for="`study-type-${option}`">
              <SvgIcon
                :name="`facility-studyType.${option}-icon`"
                class="filter-menu__filter-icon"
              />
              {{ $t(`studyType.${option}`) }}
            </label>
          </span>
        </fieldset>

        <fieldset class="filter-menu__filter-group">
          <legend class="h3">
            {{ $t("computerFacilities") }}
          </legend>

          <input
            id="power-outlets"
            v-model="filters.powerOutlets"
            :value="filters.powerOutlets"
            type="checkbox"
            class="a11y-sr-only filter-menu__filter"
          />
          <label for="power-outlets">
            <SvgIcon
              name="facility-powerOutlets-icon"
              class="filter-menu__filter-icon"
            />
            {{ $t("powerOutlets") }}
          </label>

          <input
            id="ethernet"
            v-model="filters.ethernet"
            :value="filters.ethernet"
            type="checkbox"
            class="a11y-sr-only filter-menu__filter"
          />
          <label for="ethernet">
            <SvgIcon
              name="facility-ethernet-icon"
              class="filter-menu__filter-icon"
            />
            {{ $t("ethernet") }}
          </label>

          <input
            id="stationary-pc"
            v-model="filters.stationaryPC"
            :value="filters.stationaryPC"
            type="checkbox"
            class="a11y-sr-only filter-menu__filter"
          />
          <label for="stationary-pc">
            <SvgIcon
              name="facility-stationaryPC-icon"
              class="filter-menu__filter-icon"
            />
            {{ $t("stationaryPC") }}
          </label>

          <input
            id="near-printer"
            v-model="filters.nearPrinter"
            :value="filters.nearPrinter"
            type="checkbox"
            class="a11y-sr-only filter-menu__filter"
          />
          <label for="near-printer">
            <SvgIcon
              name="facility-nearPrinter-icon"
              class="filter-menu__filter-icon"
            />
            {{ $t("nearPrinter") }}
          </label>
        </fieldset>

        <fieldset class="filter-menu__filter-group">
          <legend class="h3">
            {{ $t("locationFacilities") }}
          </legend>

          <input
            id="adjustable-chairs"
            v-model="filters.adjustableChairs"
            :value="filters.adjustableChairs"
            type="checkbox"
            class="a11y-sr-only filter-menu__filter"
          />
          <label for="adjustable-chairs">
            <SvgIcon
              name="facility-adjustableChairs-icon"
              class="filter-menu__filter-icon"
            />
            {{ $t("adjustableChairs") }}
          </label>

          <input
            id="daylit"
            v-model="filters.daylit"
            :value="filters.daylit"
            type="checkbox"
            class="a11y-sr-only filter-menu__filter"
          />
          <label for="daylit">
            <SvgIcon
              name="facility-daylit-icon"
              class="filter-menu__filter-icon"
            />
            {{ $t("daylit") }}
          </label>
        </fieldset>

        <fieldset class="filter-menu__filter-group">
          <legend class="h3">
            {{ $t("nearbyFacilities") }}
          </legend>

          <input
            id="near-bathroom"
            v-model="filters.nearBathroom"
            :value="filters.nearBathroom"
            type="checkbox"
            class="a11y-sr-only filter-menu__filter"
          />
          <label for="near-bathroom">
            <SvgIcon
              name="facility-nearBathroom-icon"
              class="filter-menu__filter-icon"
            />
            {{ $t("nearBathroom") }}
          </label>

          <input
            id="near-coffee-machine"
            v-model="filters.nearCoffeeMachine"
            :value="filters.nearCoffeeMachine"
            type="checkbox"
            class="a11y-sr-only filter-menu__filter"
          />
          <label for="near-coffee-machine">
            <SvgIcon
              name="facility-nearCoffeeMachine-icon"
              class="filter-menu__filter-icon"
            />
            {{ $t("nearCoffeeMachine") }}
          </label>
        </fieldset>

        <fieldset class="filter-menu__filter-group">
          <legend class="h3">
            {{ $t("collaborationFacilities") }}
          </legend>

          <input
            id="smart-board"
            v-model="filters.smartBoard"
            :value="filters.smartBoard"
            type="checkbox"
            class="a11y-sr-only filter-menu__filter"
          />
          <label for="smart-board">
            <SvgIcon
              name="facility-smartBoard-icon"
              class="filter-menu__filter-icon"
            />
            {{ $t("smartBoard") }}
          </label>

          <input
            id="white-board"
            v-model="filters.whiteBoard"
            :value="filters.whiteBoard"
            type="checkbox"
            class="a11y-sr-only filter-menu__filter"
          />
          <label for="white-board">
            <SvgIcon
              name="facility-whiteBoard-icon"
              class="filter-menu__filter-icon"
            />
            {{ $t("whiteBoard") }}
          </label>

          <input
            id="presentation-screen"
            v-model="filters.presentationScreen"
            :value="filters.presentationScreen"
            type="checkbox"
            class="a11y-sr-only filter-menu__filter"
          />

          <label for="presentation-screen">
            <SvgIcon
              name="facility-presentationScreen-icon"
              class="filter-menu__filter-icon"
            />
            {{ $t("presentationScreen") }}
          </label>
        </fieldset>

        <fieldset class="filter-menu__filter-group">
          <legend class="h3">
            {{ $t("buildingTitle") }}
          </legend>

          <span v-for="option in optionsPerFilter.buildings" :key="option">
            <input
              :id="`buildings-${option}`"
              v-model="filters.buildings"
              :value="option"
              type="checkbox"
              class="a11y-sr-only filter-menu__filter"
            />
            <label :for="`buildings-${option}`">
              {{ $t(`buildings.${option}`) }}
            </label>
          </span>
        </fieldset>
      </div>

      <div class="filter-menu__buttons">
        <input
          id="show-open-locations"
          v-model="filters.showOpenLocations"
          :value="filters.showOpenLocations"
          type="checkbox"
          class="filter-menu__checkbox a11y-sr-only"
        />
        <label for="show-open-locations">
          {{ $t("showOpenLocations") }}
        </label>

        <button class="button button--secondary" @click="clearFilters">
          {{ $t("clearFilters") }}
        </button>

        <button class="button button--primary" @click="$emit('close')">
          {{ $t("showLocations", spaceCount) }}
        </button>
      </div>
    </form>
  </ModalDrawer>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSpacesStore } from "~/stores/spaces";

//TODO: no need to freeze it and what's that anyway?
const optionsPerFilter = Object.freeze({
  buildings: [8, 20, 21, 22, 23, 28, 31, 32, 33, 34, 35, 36, 58, 62, 66],
  quietness: ["silent", "quiet", "noisy"],
  studyType: ["self", "group"],
});

defineProps<{ isOpen?: boolean }>();

const spacesStore = useSpacesStore();

const spaceCount = computed(() =>
  spacesStore.currentSelection?.level == "building"
    ? spacesStore.filteredSpaces.filter(
        (space) => space.buildingNumber === spacesStore.currentBuilding!.number
      ).length
    : spacesStore.filteredSpaces.length
);

const { filters } = storeToRefs(spacesStore);

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

.filter-menu__checkbox + label {
  flex: 0 0 100%;
  position: relative;
  font-size: var(--font-size-smaller);
  cursor: pointer;
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
  margin: var(--spacing-default) var(--spacing-half) 0 0;
}

.filter-menu__buttons .button--primary {
  margin: var(--spacing-default) 0 0 var(--spacing-half);
}
</style>
