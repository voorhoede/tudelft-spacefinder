<template>
  <section
    v-if="!isMapMode || !isMobile"
    class="default-layout__info"
  >
    <h2 class="a11y-sr-only">
      {{ $t('allSpaces') }}
    </h2>
    <space-list :spaces="filteredSpaces" />
  </section>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { SpaceList } from '~/components'

export default {
  components: { SpaceList },
  head() {
    const i18nSeo = this.$nuxtI18nSeo()
    return {
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('spacesTitle'),
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.$t('spacesTitle'),
        },
        ...i18nSeo.meta,
      ],
    }
  },
  computed: {
    ...mapGetters(['filteredSpaces']),
    ...mapState(['isMobile', 'isMapMode']),
  },
  mounted() {
    this.clearSelection()
    this.zoomToCampus()
    this.getMap().then(() => this.updateMarkers())
  },
  methods: {
    ...mapMutations(['clearSelection']),
    ...mapActions(['zoomToCampus', 'updateMarkers', 'getMap']),
  },
}
</script>
