<template>
  <section class="default-layout__info">
    <back-button :to="localePath({ name: 'buildings' })" />
    <h1>{{ title }}</h1>
    <space-list :spaces="spaces" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { BackButton, SpaceList } from '~/components'

export default {
  components: { BackButton, SpaceList },
  computed: {
    ...mapGetters(['filteredSpaces', 'getBuildingBySlug']),
    building() {
      return this.getBuildingBySlug(this.$route.params.buildingSlug)
    },
    spaces() {
      return this.filteredSpaces
        .filter((space) => space.building === this.building)
    },
    title() {
      return `${this.$i18n.t('building')}: ${this.building.name}`
    }
  },
  head() {
    return {
      title: this.title
    }
  },
  mounted() {
    this.$store.commit('selectBuilding', this.building)
    this.$store.dispatch('zoomToSelection')
  }
}
</script>
