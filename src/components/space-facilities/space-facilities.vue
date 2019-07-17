<template>
  <ul class="flat-list">
    <li
      v-for="(facility, index) in this.filteredFacilities"
      :key="index"
      class="space-facility__item"
    >
      <img
        v-if="facility.name === 'studyType' || facility.name === 'quietness'"
        :src="`/icons/facility-${facility.value}-icon.svg`"
        alt=""
      >
      <img
        v-else
        :src="`/icons/facility-${facility.name}-icon.svg`"
        alt=""
      >
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
      return Object.entries(this.facilities).map(([key, value]) => {
        return { name: key, value }
      })
        .filter(obj => Boolean(obj.value))
    }
  },
}
</script>

<style>
.space-facility__item {
  display: inline-block;
}

.space-facility__item img {
  height: 25px;
}
</style>
