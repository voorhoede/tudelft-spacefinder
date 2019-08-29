<template>
  <section class="default-layout__info default-layout__info--info-page">
    <h1>{{ title }}</h1>

    <div v-html="body"></div>
  </section>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

import loadData from '~/lib/load-data'

export default {
  mounted() {
    this.clearSelection()
    this.zoomToCampus()
    this.getMap().then(() => this.updateMarkers())
  },
  methods: {
    ...mapMutations(['clearSelection']),
    ...mapActions(['zoomToCampus', 'updateMarkers', 'getMap']),
  },
  computed: {
    ...mapGetters(['getInfoPage']),
    title() {
      return this.getInfoPage[this.$i18n.locale].title
    },
    body() {
      return this.getInfoPage[this.$i18n.locale].body
    }
  }
}
</script>
