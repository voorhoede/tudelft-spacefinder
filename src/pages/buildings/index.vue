<template>
  <section class="default-layout__info building-overview">
    <h2 class="a11y-sr-only">
      {{ title }}
    </h2>

    <building-card
      v-for="building in buildings"
      :key="building.slug"
      :building="building"
    />
  </section>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { BuildingCard } from '~/components'

export default {
  components: { BuildingCard },
  computed: {
    ...mapGetters(['buildings']),
    title() { return this.$i18n.t('buildingTitle') },
  },
  head() {
    const i18nSeo = this.$nuxtI18nSeo()
    return {
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.title,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.title,
        },
        ...i18nSeo.meta,
      ],
    }
  },
  mounted() {
    this.clearSelection()
    this.zoomToCampus()
    this.getMap().then(() => this.updateMarkers())
  },
  methods: {
    ...mapActions(['updateMarkers', 'zoomToCampus', 'getMap']),
    ...mapMutations(['clearSelection']),
  },
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
