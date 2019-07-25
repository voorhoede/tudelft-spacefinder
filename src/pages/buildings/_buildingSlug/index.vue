<template>
  <section class="default-layout__info">
    <back-button :to="localePath({ name: 'buildings' })" />
    <h1>{{ title }}</h1>
    <space-list :spaces="[]" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { BackButton, SpaceList } from '~/components'

export default {
  components: { BackButton, SpaceList },
  computed: {
    ...mapGetters(['getBuildingBySlug']),
    building() {
      return this.getBuildingBySlug(this.$route.params.buildingSlug)
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
