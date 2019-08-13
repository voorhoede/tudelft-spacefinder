<template>
  <section
    v-if="!isMapMode || !isMobile"
    class="default-layout__info"
  >
    <h2 class="a11y-sr-only">{{ $t('allSpaces') }}</h2>
    <space-list :spaces="filteredSpaces" />
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { SpaceList } from '~/components'

export default {
  components: { SpaceList },
  computed: {
    ...mapGetters(['filteredSpaces']),
    ...mapState(['isMobile', 'isMapMode']),
  },
  mounted() {
    this.$store.commit('clearSelection')
    this.$store.dispatch('zoomToCampus')
  }
}
</script>
