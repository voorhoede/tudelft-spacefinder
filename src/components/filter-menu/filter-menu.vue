<template>
  <form>
    <modal-drawer
      :isOpen="isOpen"
      :title="$t('filter')"
      @close="$emit('close')"
    >
      <div class="filter-menu">
        <div class="filter-menu__filters">
          <fieldset class="filter-menu__filter-group">
            <legend class="h3">{{ $t('quietness') }}</legend>

            <span 
              v-for="option in optionsPerFilter.quietness"
              :key="option"
            >
              <input
                v-model="quietness"
                :value="option"
                type="checkbox"
                :id="`quietness-${option}`"
                class="a11y-sr-only filter-menu__filter"
              >
              <label :for="`quietness-${option}`">
                {{ $t(`quietness.${option}`) }}
              </label>
            </span>
          </fieldset>

          <fieldset class="filter-menu__filter-group">
            <legend class="h3">{{ $t('studyType') }}</legend>

            <span 
              v-for="option in optionsPerFilter.studyType"
              :key="option"
            >
              <input
                v-model="studyType"
                :value="option"
                type="checkbox"
                :id="`study-type-${option}`"
                class="a11y-sr-only filter-menu__filter"
              >
              <label :for="`study-type-${option}`">
                {{ $t(`studyType.${option}`) }}
              </label>
            </span>

            <input
              v-model="bookable"
              :value="bookable"
              type="checkbox"
              id="bookable"
              class="a11y-sr-only filter-menu__filter"
            >
            <label for="bookable">
              {{ $t('bookable') }}
            </label>
          </fieldset>

          <fieldset class="filter-menu__filter-group">
            <legend class="h3">{{ $t('computerFacilities') }}</legend>

            <input
              v-model="powerOutlets"
              :value="powerOutlets"
              type="checkbox"
              id="power-outlets"
              class="a11y-sr-only filter-menu__filter"
            >
            <label for="power-outlets">
              {{ $t('powerOutlets') }}
            </label>

            <input
              v-model="ethernet"
              :value="ethernet"
              type="checkbox"
              id="ethernet"
              class="a11y-sr-only filter-menu__filter"
            >
            <label for="ethernet">
              {{ $t('ethernet') }}
            </label>

            <input
              v-model="stationaryPC"
              :value="stationaryPC"
              type="checkbox"
              id="stationary-pc"
              class="a11y-sr-only filter-menu__filter"
            >
            <label for="stationary-pc">
              {{ $t('stationaryPC') }}
            </label>

            <input
              v-model="nearPrinter"
              :value="nearPrinter"
              type="checkbox"
              id="near-printer"
              class="a11y-sr-only filter-menu__filter"
            >
            <label for="near-printer">
              {{ $t('nearPrinter') }}
            </label>
          </fieldset>

          <fieldset class="filter-menu__filter-group">
            <legend class="h3">{{ $t('locationFacilities') }}</legend>

            <input
              v-model="adjustableChairs"
              :value="adjustableChairs"
              type="checkbox"
              id="adjustable-chairs"
              class="a11y-sr-only filter-menu__filter"
            >
            <label for="adjustable-chairs">
              {{ $t('adjustableChairs') }}
            </label>

            <input
              v-model="nearCoffeeMachine"
              :value="nearCoffeeMachine"
              type="checkbox"
              id="near-coffee-machine"
              class="a11y-sr-only filter-menu__filter"
            >
            <label for="near-coffee-machine">
              {{ $t('nearCoffeeMachine') }}
            </label>

            <input
              v-model="daylit"
              :value="daylit"
              type="checkbox"
              id="daylit"
              class="a11y-sr-only filter-menu__filter"
            >
            <label for="daylit">
              {{ $t('daylit') }}
            </label>

            <input
              v-model="nearBathroom"
              :value="nearBathroom"
              type="checkbox"
              id="near-bathroom"
              class="a11y-sr-only filter-menu__filter"
            >
            <label for="near-bathroom">
              {{ $t('nearBathroom') }}
            </label>
          </fieldset>

          <fieldset class="filter-menu__filter-group">
            <legend class="h3">{{ $t('collaborationFacilities') }}</legend>

            <input
              v-model="smartBoard"
              :value="smartBoard"
              type="checkbox"
              id="smart-board"
              class="a11y-sr-only filter-menu__filter"
            >
            <label for="smart-board">
              {{ $t('smartBoard') }}
            </label>

            <input
              v-model="whiteBoard"
              :value="whiteBoard"
              type="checkbox"
              id="white-board"
              class="a11y-sr-only filter-menu__filter"
            >
            <label for="white-board">
              {{ $t('whiteBoard') }}
            </label>

            <input
              v-model="presentationScreen"
              :value="presentationScreen"
              type="checkbox"
              id="presentation-screen"
              class="a11y-sr-only filter-menu__filter"
            >
            <label for="presentation-screen">
              {{ $t('presentationScreen') }}
            </label>
          </fieldset>

          <fieldset class="filter-menu__filter-group">
            <legend class="h3">{{ $t('buildings') }}</legend>
            [...]
          </fieldset>
        </div>

        <div class="filter-menu__buttons">
          <input
            v-model="showOpenLocations"
            :value="showOpenLocations"
            type="checkbox"
            id="show-open-locations"
            class="filter-menu__checkbox a11y-sr-only"
          >
          <label for="show-open-locations">
            {{ $t('showOpenLocations') }}
          </label>

          <button class="button button--secondary">
            {{ $t('resetFilters') }}
          </button>

          <button class="button button--primary">
            {{ $t('showLocations') }}
          </button>
        </div>
      </div>
    </modal-drawer>
  </form>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import ModalDrawer from '../modal-drawer'

const optionsPerFilter = Object.freeze({
  quietness: ['silent', 'quiet', 'noisy'],
  studyType: ['self', 'group']
})

export default {
  components: { ModalDrawer },
  props: {
    isOpen: Boolean,
  },
  computed: {
    ...mapFields([
      'filters.adjustableChairs',
      'filters.bookable',
      'filters.daylit',
      'filters.ethernet',
      'filters.studyType',
      'filters.nearBathroom',
      'filters.nearCoffeeMachine',
      'filters.nearPrinter',
      'filters.powerOutlets',
      'filters.presentationScreen',
      'filters.quietness',
      'filters.showNearbyLocations',
      'filters.showOpenLocations',
      'filters.smartBoard',
      'filters.stationaryPC',
      'filters.whiteBoard'
    ]),
    optionsPerFilter() { return optionsPerFilter }
  }
}
</script>

<style>
@import '../app-core/variables.css';

.filter-menu {
  display: flex;
  flex-direction: column;
  height: calc(100% - var(--header-height-mobile));
}

@media (min-width: 700px) {
  .filter-menu {
    height: calc(100% - var(--header-height-desktop));
  }
}

.filter-menu__filter-group {
  margin-bottom: var(--spacing-half);
}

@media (min-width: 700px) {
  .filter-menu__filter-group {
    margin-bottom: var(--spacing-default);
  }
}

.filter-menu__filters {
  flex: 1 1 auto;
  padding: var(--spacing-default);
  overflow: auto;
}

.filter-menu__filter + label {
  display: inline-block;
  margin: 0 var(--spacing-quarter) var(--spacing-half) 0;
  padding: 0 var(--spacing-default);
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

.filter-menu__checkbox + label {
  flex: 0 0 100%;
  position: relative;
  font-size: var(--font-size-smaller);
  cursor: pointer;
}

.filter-menu__checkbox + label:before {
  content: '';
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
  content: '';
  position: absolute;
  display: inline-block;
  left: 4px;
  top: 5px;
  width: 12px;
  height: 12px;
  background: url('/icons/checkmark-icon.svg') center no-repeat;
}

.filter-menu__buttons {
  flex: 0 0 auto;
  display: flex;
  flex-wrap: wrap;
  padding: var(--spacing-default);
}

.filter-menu__buttons .button--secondary {
  flex: 1 1 auto;
  margin: var(--spacing-default) var(--spacing-half) 0 0;
}

.filter-menu__buttons .button--primary {
  flex: 1 1 auto;
  margin: var(--spacing-default) var(--spacing-half) 0 0;
}
</style>
