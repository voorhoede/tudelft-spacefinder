<template>
  <section
    v-if="showListView || !isMobile"
    class="default-layout__info"
  >
    <h1 class="a11y-sr-only">{{ $t('allSpaces') }}</h1>
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
    ...mapState(['isMobile', 'showListView']),
  },
  mounted() {
    this.$store.dispatch('zoomToCampus')
  }
}
</script>
