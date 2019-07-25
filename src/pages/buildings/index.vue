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
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters(['buildings']),
    ...mapState(['showListView', 'isMobile']),
  },
  mounted() {
    this.$store.dispatch('zoomToCampus')
  }
}
</script>
