<template>
  <section
    v-if="showListView || !isMobile"
    class="default-layout__info"
  >
    <h1>{{ $t('buildings') }}</h1>
    <ul>
      <li v-for="building in buildings" :key="building.slug">
        <nuxt-link
          :to="
            localePath({
              name: 'buildings-buildingSlug',
              params: { buildingSlug: building.slug }
            })
          "
        >
          {{ building.name }}
        </nuxt-link>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import loadData from '~/lib/load-data'

export default {
  async asyncData({ app }) {
    const buildings = await loadData(`${app.i18n.locale}/buildings.json`)
    return { buildings }
  },
  computed: mapState(['showListView', 'isMobile']),
  mounted() {
    this.$store.dispatch('zoomToCampus')
  }
}
</script>
