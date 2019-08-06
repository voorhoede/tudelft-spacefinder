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
      :url="shareUrl"
      class="space-detail-share-button"
    />

    <space-detail-card
      ref="card"
      :space="space"
    />
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { BackButton, SocialShare, SpaceDetailCard } from '~/components'
import metaHead from '~/lib/meta-head'

export default {
  components: { BackButton, SocialShare, SpaceDetailCard },
  computed: {
    ...mapGetters(['getSpaceBySlug']),
    ...mapState(['isMobile']),
    baseUrl() { return process.env.BASE_URL },
    building() { return this.space.building },
    shareUrl() { return `${process.env.BASE_URL}/${this.$route.fullPath}` },
    space() { return this.getSpaceBySlug(this.$route.params.spaceSlug) },
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
