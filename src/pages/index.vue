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
