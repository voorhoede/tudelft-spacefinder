<template>
  <section class="default-layout__info default-layout__info--space-detail">
    <h1>{{ $t('space') }}: {{ space.room.id }}: {{ space.name }}</h1>
  </section>
</template>

<script>
import loadData from '~/lib/load-data'

export default {
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
