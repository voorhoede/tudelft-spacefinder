<template>
  <section class="default-layout__info">
    <back-button :to="localePath({ name: 'buildings' })" />
    <h1>{{ $t('building') }}: {{ building.name }}</h1>
    <space-list :spaces="spaces" />
  </section>
</template>

<script>
import { BackButton } from '~/components'
import loadData from '~/lib/load-data'
import { SpaceList } from '../../../components'

export default {
  components: { BackButton, SpaceList },
  async asyncData({ app, params }) {
    const { locale } = app.i18n
    const { buildingSlug } = params

    const [building, spaces] = await Promise.all([
      loadData(`${locale}/buildings.json`).then((buildings) => {
        return buildings.find((building) => {
          return building.slug === buildingSlug
        })
      }),
      loadData(`${locale}/spaces.json`).then((spaces) => {
        return spaces.filter((space) => {
          return space.building.slug === buildingSlug
        })
      })
    ])
    return { building, spaces }
  },

  mounted() {
    this.$store.commit('selectBuilding', this.building)
    this.$store.dispatch('zoomToSelection')
  }
}
</script>
