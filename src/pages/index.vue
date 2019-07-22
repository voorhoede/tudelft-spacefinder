<template>
  <section
    v-if="showListView || !isMobile"
    class="default-layout__info"
  >
    <h1 class="a11y-sr-only">{{ $t('allSpaces') }}</h1>
    <space-list :spaces="spaces" />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import loadData from '~/lib/load-data'
import filterSpaces from '~/lib/filter-spaces'
import { SpaceList } from '../components'

export default {
  components: { SpaceList },
  async asyncData({ app }) {
    const allSpaces = await loadData(`${app.i18n.locale}/spaces.json`)
    return { allSpaces }
  },
  computed: {
    ...mapState(['filters', 'isMobile', 'showListView']),
    spaces() { 
      return filterSpaces({ 
        filters: this.filters, 
        spaces: this.allSpaces
      })
    }
  },
  mounted() {
    this.$store.dispatch('zoomToCampus')
  }
}
</script>
