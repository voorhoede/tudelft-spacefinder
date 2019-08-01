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

    <social-share
      :url="url"
      class="space-detail-share-button"
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
import { BackButton, SocialShare, SpaceDetailCard } from '~/components'

export default {
  components: { BackButton, SocialShare, SpaceDetailCard },
  data() {
    return {
      url: undefined
    }
  },
  computed: {
    ...mapGetters(['getSpaceBySlug']),
    ...mapState(['isMobile']),
    building() { return this.space.building },
    space() {
      return this.getSpaceBySlug(this.$route.params.spaceSlug)
    },
  },
  mounted() {
    this.url = window.location.href

    const padding = this.isMobile
      ? { bottom: this.$refs.card.$el.clientHeight + 2 * 20 }
      : {}

    this.$store.commit('selectBuilding', this.building)
    this.$store.dispatch('zoomToSelection', { padding })
  }
}
</script>

<style>
@import '../../../../components/app-core/variables.css';

@media (max-width: 699px) {
  .default-layout__info--space-detail ~ .default-layout__map .mapbox-map__zoom-controls {
    display: none;
  }
}

.space-detail-share-button {
    position: fixed;
    top: calc(var(--header-height-mobile) + var(--spacing-default));
    right: var(--spacing-default);
  }

@media (min-width: 700px) {
  .space-detail-share-button {
    top: calc(var(--header-height-desktop) + var(--spacing-default));
  }
}
</style>
