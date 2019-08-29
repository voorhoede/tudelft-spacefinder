<template>
  <section
    v-if="dataIsLoaded"
    class="default-layout__info default-layout__info--info-page"
  >
    <h1>{{ title }}</h1>

    <div v-html="body"></div>
  </section>
  <section
    v-else
    class="default-layout__info default-layout__info--info-page"
  >
    ...
  </section>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import loadData from '~/lib/load-data'

export default {
  data() {
    return {
      content: {},
      dataIsLoaded: false
    }
  },
  mounted() {
    loadData(`infopage.json`)
      .then((infoPage) => {
        this.content = infoPage
        this.dataIsLoaded = true
      })
    this.clearSelection()
    this.zoomToCampus()
    this.getMap().then(() => this.updateMarkers())
  },
  methods: {
    ...mapMutations(['clearSelection']),
    ...mapActions(['zoomToCampus', 'updateMarkers', 'getMap']),
  },
  computed: {
    title() {
      if(this.dataIsLoaded) {
        return this.content[this.$i18n.locale].title
      }
    },
    body() {
      if(this.dataIsLoaded) {
        return this.content[this.$i18n.locale].body
      }
    }
  }
}
</script>
