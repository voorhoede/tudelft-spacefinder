<template>
  <section class="default-layout__info building-layout">
    <back-button
      class="building-layout__back-button"
      :to="localePath({ name: 'buildings' })"
    />

    <building-header
      class="building-layout__header"
      :building="building"
    />

    <space-list
      class="building-layout__spaces"
      :spaces="spaces"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { BackButton, BuildingHeader, SpaceList } from '~/components'

export default {
  components: { BackButton, BuildingHeader, SpaceList },
  computed: {
    ...mapGetters(['filteredSpaces', 'getBuildingBySlug']),
    building() {
      return this.getBuildingBySlug(this.$route.params.buildingSlug)
    },
    spaces() {
      return this.filteredSpaces
        .filter((space) => space.building === this.building)
    },
    title() {
      return `${this.$i18n.t('building')}: ${this.building.name}`
    }
  },
  head() {
    return {
      title: this.title
    }
  },
  mounted() {
    this.$store.commit('selectBuilding', this.building)
    this.$store.dispatch('zoomToSelection')
  }
}
</script>

<style>
.building-layout {
  display: flex;
  flex-direction: column;
}

.building-layout__back-button {
  z-index: var(--layer--overlay);
  position: absolute;
}

.building-layout__header {
  flex: 0 0 1;
}

.building-layout__spaces {
  flex: 1 1 auto;
  padding-top: 0;
}
</style>
