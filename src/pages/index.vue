<template>
  <nav>
    <h1>Home: {{ $i18n.locale }}</h1>

    <ul class="flat-list">
      <li
        v-for="space in spaces"
        :key="space.slug"
      >
        <space-card
          :buildingSlug="space.building.slug"
          :spaceSlug="space.slug"
          :facilities="space.facilities"
          :faculty="space.building.name"
          :location="space.room.id"
          :title="space.name"
          class="space-card"
        />
      </li>
    </ul>
  </nav>
</template>

<script>
import loadData from '~/lib/load-data'

import { SpaceCard } from '../components'

export default {
  components: { SpaceCard },
  async asyncData({ app }) {
    const spaces = await loadData(`${app.i18n.locale}/spaces.json`)
    return { spaces }
  },
  mounted() {
    this.$store.dispatch('zoomToCampus')
  }
}
</script>

<style>
@import '../components/app-core/variables.css';

.space-card {
  margin-bottom: var(--spacing-default);
}
</style>
