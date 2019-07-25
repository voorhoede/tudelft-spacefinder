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
import filterSpaces from '~/lib/filter-spaces'

export default {
  components: { SpaceList },
  computed: {
    ...mapGetters(['spaces']),
    ...mapState(['filters', 'isMobile', 'showListView']),
    filteredSpaces() { 
      return filterSpaces({ 
        filters: this.filters, 
        spaces: this.spaces
      })
    }
  },
  mounted() {
    this.$store.dispatch('zoomToCampus')
  }
}
</script>
