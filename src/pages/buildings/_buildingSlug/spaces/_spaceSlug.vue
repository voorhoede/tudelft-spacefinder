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
import { mapGetters } from 'vuex'
import { BackButton, SpaceDetailCard } from '~/components'

const isValidSlug = (slug) => /^\d+[a-z0-9\-]+$/.test(slug)

export default {
  components: { BackButton, SpaceDetailCard },
  validate ({ params }) {
    return [params.buildingSlug, params.spaceSlug].every(isValidSlug)
  },
  computed: {
    ...mapGetters(['getBuildingBySlug', 'getSpaceBySlug']),
    building() {
      return this.getBuildingBySlug(this.$route.params.buildingSlug)
    },
    space() {
      return this.getSpaceBySlug(this.$route.params.spaceSlug)
    }
  },
}
</script>
