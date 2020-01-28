<template>
  <section class="default-layout__info default-layout__info--info-page">
    <h1>{{ title }}</h1>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="body" />
  </section>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import metaHead from '~/lib/meta-head'

export default {
  head() {
    return metaHead({
      title: this.title,
      description: '',
    })
  },
  computed: {
    ...mapGetters(['getFeedbackPage']),
    title() {
      return this.getFeedbackPage[this.$i18n.locale].title
    },
    body() {
      return this.getFeedbackPage[this.$i18n.locale].body
    },
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
