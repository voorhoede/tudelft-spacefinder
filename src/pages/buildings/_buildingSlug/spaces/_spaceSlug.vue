<template>
  <section class="default-layout__info default-layout__info--space-detail">
    <back-button
      :to="
        localePath({
          name: 'buildings-buildingSlug-spaces',
          params: { buildingSlug: building.slug }
        })
      "
    />

    <space-detail-card
      ref="card"
      :building="space.building.name"
      :facilities="space.facilities"
      :floor="space.floor"
      :location="space.room.id"
      :seats="space.seats"
      :tables="space.tables"
      :title="space.name"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { BackButton } from '~/components'
import loadData from '~/lib/load-data'

import { SpaceDetailCard } from '../../../../components'

export default {
  components: { BackButton, SpaceDetailCard },

  computed: mapState(['isMobile']),

  async asyncData({ app, params }) {
    const { locale } = app.i18n
    const { buildingSlug, spaceSlug } = params

    const [building, space] = await Promise.all([
      loadData(`${locale}/buildings.json`).then((buildings) => {
        return buildings.find((building) => {
          return building.slug === buildingSlug
        })
      }),
      loadData(`${locale}/spaces.json`).then((spaces) => {
        return spaces.find((space) => {
          return space.slug === spaceSlug
        })
      })
    ])
    return { building, space }
  },

  mounted() {
    const padding = this.isMobile
      ? { bottom: this.$refs.card.$el.clientHeight + 2 * 20 }
      : {}

    this.$store.commit('selectBuilding', this.building)
    this.$store.dispatch('zoomToSelection', { padding })
  }
}
</script>
