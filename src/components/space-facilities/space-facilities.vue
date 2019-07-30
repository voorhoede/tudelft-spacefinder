<template>
  <ul class="flat-list">
    <li
      v-for="(facility, index) in this.filteredFacilities"
      :key="index"
      class="space-facility__item"
    >
      <svg-icon
       :name="getIconName(facility)"
       class="space-facility__icon"
      />
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    facilities: Object,
  },
  computed: {
    filteredFacilities() {
      return Object.entries(this.facilities)
        .map(([key, value]) => ({ name: key, value }))
        .filter(obj => Boolean(obj.value))
    }
  },
  methods: {
    getIconName(facility) {
      const valueIsName = ['studyType', 'quietness'].includes(facility.name)
      const iconName = valueIsName ? facility.value : facility.name
      return `facility-${iconName}-icon`
    }
  }
}
</script>

<style>
.space-facility__item {
  display: inline-block;
}

.space-facility__icon {
  width: 25px;
  height: 25px;
}
</style>
