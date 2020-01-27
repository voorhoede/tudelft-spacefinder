<template>
  <ul class="space-facility__list flat-list">
    <li
      v-for="(facility, index) in filteredFacilities"
      :key="index"
      class="space-facility__item"
    >
      <img
        v-tooltip="{
          content: $t(getFacilityValue(facility)),
          trigger: 'hover click focus'
        }"
        :src="getIconSrc(facility)"
        class="space-facility__icon"
        :alt="$t(getFacilityValue(facility))"
      >
      <img
        v-tooltip="{
          content: $t(getFacilityValue(facility)),
          trigger: 'hover click focus'
        }"
        :src="getIconSrc(facility, true)"
        class="space-facility__icon space-facility__icon--hover"
        :alt="$t(getFacilityValue(facility))"
      >

      <span class="a11y-sr-only">
        {{ $t(getFacilityValue(facility)) }}
      </span>
    </li>
    <li v-if="seats" class="space-facility__item space-facility__seating">
      <h4 class="a11y-sr-only">
        {{ $t('seating') }}
      </h4>
      <img
        v-tooltip="{
          content: seatsDescription,
          trigger: 'hover click focus'
        }"
        :src="seatsIconSrc"
        class="space-facility__seating-icon"
        :alt="seatsDescription"
      >
      <img
        v-tooltip="{
          content: seatsDescription,
          trigger: 'hover click focus'
        }"
        :src="seatsIconSrcHovered"
        class="space-facility__seating-icon space-facility__seating-icon--hover"
        :alt="seatsDescription"
      >
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    facilities: {
      required: true,
      type: Object,
    },
    seats: {
      required: false,
      type: Number,
      default: null,
    },
  },
  computed: {
    filteredFacilities() {
      return Object.entries(this.facilities)
        .map(([key, value]) => ({ name: key, value }))
        .filter(obj => Boolean(obj.value))
    },
    seatsDescription() {
      return `${this.seats} ${this.$t('seatsDescription')}`
    },
    seatsIconSrc() {
      return require('../../assets/sprite/svg/seat-icon.svg')
    },
    seatsIconSrcHovered() {
      return require('../../assets/sprite/svg/seat-icon--blue.svg')
    },
  },
  methods: {
    getIconName(facility) {
      const iconName = this.getFacilityValue(facility)
      return `facility-${iconName}-icon`
    },
    getIconSrc(facility, hover) {
      try {
        const iconName = this.getFacilityValue(facility)
        // require returns the hashed path webpack resolves to
        const src = require(`../../assets/sprite/svg/facility-${iconName}-icon${hover ? '--blue' : ''}.svg`)

        return src
      } catch (error) {
        console.error(error)
      }
    },
    getFacilityValue(facility) {
      const valueIsName = ['studyType', 'quietness'].includes(facility.name)
      const facilityName = valueIsName ? facility.value : facility.name
      const facilityValue = valueIsName ? `${facility.name}.${facilityName}` : facilityName
      return facilityValue
    },
  },
}
</script>

<style>
.space-facility__list {
  display: flex;
}

.space-facility__item {
  position: relative;
  display: inline-block;
  padding: 0;
}

.space-facility__icon {
  display: block;
  width: 25px;
  height: 25px;
}

.space-facility__seating {
  margin-left: auto;
}

.space-facility__seating-icon {
  margin: 0 1px 0 0;
  display: block;
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

.space-facility__icon--hover,
.space-facility__seating-icon--hover {
  display: none;
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
