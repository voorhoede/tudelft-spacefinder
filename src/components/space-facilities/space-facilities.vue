<template>
  <ul class="flat-list">
    <li
      v-for="(facility, index) in filteredFacilities"
      :key="index"
      class="space-facility__item"
    >
      <svg-icon
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
      const facilityValue = valueIsName ? `${facility.name}.${facilityName}` : facilityName
      return facilityValue
    },
  },
}
</script>

<style>
ul > li.space-facility__item {
  display: inline-block;
  padding: 0;
}

.space-facility__icon {
  width: 25px;
  height: 25px;
}
</style>
