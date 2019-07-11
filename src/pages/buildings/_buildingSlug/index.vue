<template>
  <div>
    <back-button :to="localePath({ name: 'buildings' })" />
    <h1>{{ $t('building') }}: {{ building.name }}</h1>
    <nuxt-link
      :to="
        localePath({
          name: 'buildings-buildingSlug-spaces',
          params: { buildingSlug: building.slug }
        })
      "
    >
      {{ $t('spaces') }}
    </nuxt-link>
  </div>
</template>

<script>
import { BackButton } from '~/components'
import loadData from '~/lib/load-data'

export default {
  components: { BackButton },

  async asyncData({ app, params }) {
    const { buildingSlug } = params

    const building = await loadData(`${app.i18n.locale}/buildings.json`)
      .then((buildings) => {
        return buildings.find((building) => {
          return building.slug === buildingSlug
        })
      })

    return { building }
  },

  mounted() {
    this.$store.commit('selectBuilding', this.building)
    this.$store.dispatch('zoomToSelection')
  }
}
</script>
