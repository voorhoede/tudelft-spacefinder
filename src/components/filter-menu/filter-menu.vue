<template>
  <modal-drawer
    :isOpen="isOpen"
    :title="$t('filter')"
    @close="$emit('close')"
  >
    <form
      @submit.prevent
      class="filter-menu"
    >
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
              <silent-icon v-if="option === 'silent'" class="filter-menu__filter-icon" />
              <quiet-icon v-else-if="option === 'quiet'" class="filter-menu__filter-icon" />
              <noisy-icon v-else class="filter-menu__filter-icon" />
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
              <group-icon v-if="option === 'group'" class="filter-menu__filter-icon" />
              <self-icon v-else class="filter-menu__filter-icon" />
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
            <bookable-icon class="filter-menu__filter-icon" />
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
            <power-outlets-icon class="filter-menu__filter-icon" />
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
            <ethernet-icon class="filter-menu__filter-icon" />
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
            <stationary-pc-icon class="filter-menu__filter-icon" />
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
            <near-printer-icon class="filter-menu__filter-icon" />
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
            <adjustable-chairs-icon class="filter-menu__filter-icon" />
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
            <near-coffee-machine-icon class="filter-menu__filter-icon" />
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
            <daylit-icon class="filter-menu__filter-icon" />
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
            <near-bathroom-icon class="filter-menu__filter-icon" />
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
            <smartboard-icon class="filter-menu__filter-icon" />
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
            <whiteboard-icon class="filter-menu__filter-icon" />
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
            <presentation-screen-icon class="filter-menu__filter-icon" />
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

        <button
          class="button button--secondary"
          @click="resetFilters"
        >
          {{ $t('resetFilters') }}
        </button>

        <button
          class="button button--primary"
          @click="$emit('close')"
        >
          {{ $t('showLocations') }}
        </button>
      </div>
    </form>
  </modal-drawer>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import ModalDrawer from '../modal-drawer'

import AdjustableChairsIcon from '../../static/icons/facility-adjustableChairs-icon.svg'
import BookableIcon from '../../static/icons/facility-bookable-icon.svg'
import DaylitIcon from '../../static/icons/facility-daylit-icon.svg'
import EthernetIcon from '../../static/icons/facility-ethernet-icon.svg'
import GroupIcon from '../../static/icons/facility-group-icon.svg'
import NearBathroomIcon from '../../static/icons/facility-nearBathroom-icon.svg'
import NearCoffeeMachineIcon from '../../static/icons/facility-nearCoffeeMachine-icon.svg'
import NearPrinterIcon from '../../static/icons/facility-nearPrinter-icon.svg'
import NoisyIcon from '../../static/icons/facility-noisy-icon.svg'
import SelfIcon from '../../static/icons/facility-self-icon.svg'
import SilentIcon from '../../static/icons/facility-silent-icon.svg'
import PowerOutletsIcon from '../../static/icons/facility-powerOutlets-icon.svg'
import PresentationScreenIcon from '../../static/icons/facility-presentationScreen-icon.svg'
import QuietIcon from '../../static/icons/facility-quiet-icon.svg'
import SmartboardIcon from '../../static/icons/facility-smartboard-icon.svg'
import StationaryPcIcon from '../../static/icons/facility-stationaryPC-icon.svg'
import WhiteboardIcon from '../../static/icons/facility-whiteboard-icon.svg'

const optionsPerFilter = Object.freeze({
  quietness: ['silent', 'quiet', 'noisy'],
  studyType: ['self', 'group']
})

export default {
  components: { AdjustableChairsIcon, BookableIcon, DaylitIcon, EthernetIcon, GroupIcon, ModalDrawer, NearBathroomIcon, NearCoffeeMachineIcon, NearPrinterIcon, NoisyIcon, QuietIcon, PowerOutletsIcon, PresentationScreenIcon, SelfIcon, SilentIcon, SmartboardIcon, StationaryPcIcon, WhiteboardIcon },
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
  },
  methods: {
    resetFilters() {
      this.$store.commit('resetFilters')
    }
  }
}
</script>

<style>
@import '../app-core/variables.css';

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
	background:
		linear-gradient(var(--background-color) 30%, rgba(255, 255, 255, 0)),
		linear-gradient(rgba(255,255,255,0), var(--background-color) 70%) 0 100%,
		radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)),
		radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;
	background-repeat: no-repeat;
	background-color: var(--background-color);
	background-size: 100% 40px, 100% 40px, 100% 14px, 100% 5px;
	background-attachment: local, local, scroll, scroll;
}

.filter-menu__filter + label {
  display: inline-block;
  margin: 0 var(--spacing-quarter) var(--spacing-half) 0;
  padding: 0 var(--spacing-default) 0 var(--spacing-half);
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
  flex: 1 1 0;
  margin: var(--spacing-default) var(--spacing-half) 0 0;
}

.filter-menu__buttons .button--primary {
  flex: 1 1 0;
  margin: var(--spacing-default) 0 0 var(--spacing-half);
}
</style>
