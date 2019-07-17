<template>
  <div>
    <h1>{{ $t('building') }}: {{ building.name }}</h1>
    
    <ul class="flat-list spaces-list">
      <li
        v-for="space in spaces"
        :key="space.slug"
      >
        <space-card
          :buildingSlug="space.building.slug"
          :spaceSlug="space.slug"
          :facilities="space.facilities"
          :building="space.building.name"
          :location="space.room.id"
          :title="space.name"
          :seats="space.seats"
          :tables="space.tables"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import loadData from '~/lib/load-data'

import { SpaceCard } from '../../../components'

export default {
  components: { SpaceCard },
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
