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
import loadData from '~/lib/load-data'

export default {
  components: { BackButton, SpaceList },
  async asyncData({ app, params }) {
    const { locale } = app.i18n
    const { buildingSlug } = params

    const spaces = await loadData(`${locale}/spaces.json`).then((spaces) => {
      return spaces.filter((space) => {
        return space.building.slug === buildingSlug
      })
    })
    return { buildingSlug, spaces }
  },
  computed: {
    building() {
      return this.getBuildingBySlug(this.buildingSlug)
    },
    ...mapGetters(['getBuildingBySlug'])
  },
  mounted() {
    this.$store.commit('selectBuilding', this.building)
    this.$store.dispatch('zoomToSelection')
  }
}
</script>
