<template>
  <section class="default-layout__info">
    <back-button :to="localePath({ name: 'buildings' })" />
    <h1>{{ $t('building') }}: {{ building.name }}</h1>
    <space-list :spaces="spaces" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { BackButton, SpaceList } from '~/components'

export default {
  components: { BackButton, SpaceList },
  getters: {
    ...mapGetters(['getBuildingBySlug']),
    building() {
      return this.getBuildingBySlug(this.buildingSlug)
    },
  },
  mounted() {
    this.$store.commit('selectBuilding', this.building)
    this.$store.dispatch('zoomToSelection')
  }
}
</script>
