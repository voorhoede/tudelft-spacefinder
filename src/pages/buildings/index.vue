<template>
  <section
    v-if="showListView || !isMobile"
    class="default-layout__info building-overview"
  >
    <h2 class="a11y-sr-only">{{ title }}</h2>

    <building-card
      v-for="building in buildings" :key="building.slug"
      :building="building"
    />
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { BuildingCard } from '~/components'
import metaHead from '~/lib/meta-head'

export default {
  components: { BuildingCard },
  computed: {
    ...mapGetters(['buildings']),
    ...mapState(['showListView', 'isMobile']),
    title() { return this.$i18n.t('buildingTitle') }
  },
  head() {
    return metaHead({
      title: this.title
    })
  },
  mounted() {
    this.$store.commit('clearSelection')
    this.$store.dispatch('zoomToCampus')
  }
}
</script>

<style>
.building-overview {
  padding: var(--spacing-default);
  -webkit-overflow-scrolling: touch;
}

.building-overview .building-card:not(:last-child) {
  margin-bottom: var(--spacing-default);
}
</style>
