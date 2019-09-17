<template>
  <ul class="flat-list">
    <li
      v-for="(facility, index) in filteredFacilities"
      :key="index"
      class="space-facility__item"
    >
      <svg-icon
        v-tooltip="{
          content: $t(getFacilityValue(facility)),
          trigger: 'hover click focus'
        }"
        :name="getIconName(facility)"
        class="space-facility__icon"
      />

      <span class="a11y-sr-only">
        {{ $t(getFacilityValue(facility)) }}
      </span>
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
  },
  computed: {
    filteredFacilities() {
      return Object.entries(this.facilities)
        .map(([key, value]) => ({ name: key, value }))
        .filter(obj => Boolean(obj.value))
    },
  },
  methods: {
    getIconName(facility) {
      const iconName = this.getFacilityValue(facility)
      return `facility-${iconName}-icon`
    },
    getFacilityValue(facility) {
      const valueIsName = ['studyType', 'quietness'].includes(facility.name)
      const facilityName = valueIsName ? facility.value : facility.name
      return valueIsName ? `${facility.name}.${facilityName}` : facilityName
    },
  },
}
</script>

<style>
ul > li.space-facility__item {
  position: relative;
  display: inline-block;
  padding: 0;
}

.space-facility__icon {
  width: 25px;
  height: 25px;
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
