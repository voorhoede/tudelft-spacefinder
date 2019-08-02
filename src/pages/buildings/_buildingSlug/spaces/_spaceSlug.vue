<template>
  <section class="default-layout__info default-layout__info--space-detail">
    <back-button
      :to="
        localePath({
          name: 'buildings-buildingSlug',
          params: { buildingSlug: building.slug }
        })
      "
    />
    <space-detail-card
      ref="card"
      :building="space.building.name"
      :facilities="space.facilities"
      :floor="space.floor"
      :location="space.roomId"
      :seats="space.seats"
      :tables="space.tables"
      :title="space.name"
    />
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { BackButton, SpaceDetailCard } from '~/components'
import metaHead from '~/lib/meta-head'

export default {
  components: { BackButton, SpaceDetailCard },
  computed: {
    ...mapGetters(['getSpaceBySlug']),
    ...mapState(['isMobile']),
    building() { return this.space.building },
    space() { return this.getSpaceBySlug(this.$route.params.spaceSlug) }
  },
  head() {
    const { building, space } = this
    return metaHead({ 
      title: `${space.name} (${space.roomId}) @ ${building.name} (${building.abbreviation})`
    })
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

<style>
@media (max-width: 699px) {
  .default-layout__info--space-detail ~ .default-layout__map .mapbox-map__zoom-controls {
    display: none;
  }
}
</style>
