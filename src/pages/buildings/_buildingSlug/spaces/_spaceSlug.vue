<template>
  <section class="default-layout__info default-layout__info--space-detail">
    <space-detail-card
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
import loadData from '~/lib/load-data'

import { SpaceDetailCard } from '../../../../components'

export default {
  components: { SpaceDetailCard },
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
  }
}
</script>
