<template>
  <form>
    <modal-drawer
      :isOpen="isOpen"
      :title="$t('filter')"
      @close="$emit('close')"
    >
      <fieldset>
        <legend>{{ $t('quietness') }}</legend>
        <label v-for="option in optionsPerFilter.quietness" :key="option">
          <input type="checkbox" :value="option" v-model="quietness">
          {{ $t(`quietness.${option}`) }}
        </label>
      </fieldset>

      <fieldset>
        <legend>{{ $t('locationType') }}</legend>
        <label v-for="option in optionsPerFilter.locationType" :key="option">
          <input type="checkbox" :value="option" v-model="locationType">
          {{ $t(`locationType.${option}`) }}
        </label>
        <label>
          <input type="checkbox" :value="bookable" v-model="bookable">
          {{ $t('bookable') }}
        </label>
      </fieldset>

      <fieldset>
        <legend>{{ $t('computerFacilities') }}</legend>
        <label>
          <input type="checkbox" :value="powerOutlets" v-model="powerOutlets">
          {{ $t('powerOutlets') }}
        </label>
        <label>
          <input type="checkbox" :value="ethernet" v-model="ethernet">
          {{ $t('ethernet') }}
        </label>
        <label>
          <input type="checkbox" :value="stationaryPC" v-model="stationaryPC">
          {{ $t('stationaryPC') }}
        </label>
        <label>
          <input type="checkbox" :value="nearPrinter" v-model="nearPrinter">
          {{ $t('nearPrinter') }}
        </label>
      </fieldset>

      <fieldset>
        <legend>{{ $t('locationFacilities') }}</legend>
        <label>
          <input type="checkbox" :value="adjustableChairs" v-model="adjustableChairs">
          {{ $t('adjustableChairs') }}
        </label>
        <label>
          <input type="checkbox" :value="nearCoffeeMachine" v-model="nearCoffeeMachine">
          {{ $t('nearCoffeeMachine') }}
        </label>
        <label>
          <input type="checkbox" :value="daylit" v-model="daylit">
          {{ $t('daylit') }}
        </label>
        <label>
          <input type="checkbox" :value="nearBathroom" v-model="nearBathroom">
          {{ $t('nearBathroom') }}
        </label>
      </fieldset>

      <fieldset>
        <legend>{{ $t('collaborationFacilities') }}</legend>
        <label>
          <input type="checkbox" :value="smartBoard" v-model="smartBoard">
          {{ $t('smartBoard') }}
        </label>
        <label>
          <input type="checkbox" :value="whiteBoard" v-model="whiteBoard">
          {{ $t('whiteBoard') }}
        </label>
        <label>
          <input type="checkbox" :value="presentationScreen" v-model="presentationScreen">
          {{ $t('presentationScreen') }}
        </label>
      </fieldset>

      <fieldset>
        <legend>{{ $t('buildings') }}</legend>
      </fieldset>

      <label>
        <input type="checkbox" :value="showNearbyLocations" v-model="showNearbyLocations">
        {{ $t('showNearbyLocations') }}
      </label>

      <label>
        <input type="checkbox" :value="showOpenLocations" v-model="showOpenLocations">
        {{ $t('showOpenLocations') }}
      </label>

      <button>{{ $t('resetFilters') }}</button>
      <button>{{ $t('showLocations') }}</button>

      <h2>Active filters</h2>
      <output>
        noise level: {{ quietness }}<br>
        location type: {{ locationType }}<br>
        bookable: {{ bookable }}<br>
        powerOutlets: {{ powerOutlets }}<br>
        ethernet: {{ ethernet }}<br>
        stationaryPC: {{ stationaryPC }}<br>
        nearPrinter: {{ nearPrinter }}<br>
        adjustableChairs: {{ adjustableChairs }}<br>
        nearCoffeeMachine: {{ nearCoffeeMachine }}<br>
        daylit: {{ daylit }}<br>
        nearBathroom: {{ nearBathroom }}<br>
        smartBoard: {{ smartBoard }}<br>
        whiteBoard: {{ whiteBoard }}<br>
        presentationScreen: {{ presentationScreen }}<br>
        showNearbyLocations: {{ showNearbyLocations }}<br>
        showOpenLocations: {{ showOpenLocations }}
      </output>
    </modal-drawer>
  </form>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import ModalDrawer from '../modal-drawer'

const optionsPerFilter = Object.freeze({
  quietness: ['silent', 'quiet', 'noisy'],
  locationType: ['self', 'group']
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
      'filters.locationType',
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
