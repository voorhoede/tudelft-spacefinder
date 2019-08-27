<template>
  <section v-if="building">
    <back-button
      :use-history="false"
      :to="localePath({ name: 'buildings' })"
    />
    <div class="default-layout__info building-layout">
      <building-header
        class="building-layout__header"
        :building="building"
      />
      <space-list
        class="building-layout__spaces"
        :spaces="spaces"
      />
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { BackButton, BuildingHeader, SpaceList } from '~/components'
import metaHead from '~/lib/meta-head'

export default {
  components: { BackButton, BuildingHeader, SpaceList },
  computed: {
    ...mapGetters(['filteredSpaces', 'getBuildingBySlug']),
    building() {
      return this.getBuildingBySlug(this.$route.params.buildingSlug)
    },
    spaces() {
      return this.filteredSpaces
        .filter(space => space.building === this.building)
    },
  },
  head() {
    const { building } = this
    if (!building) return {}
    return metaHead({
      title: `${building.name} (${building.abbreviation})`,
      image: {
        url: `${building.image.url}?auto=format&fm=jpg&auto=quality`,
      },
    })
  },
  mounted() {
    this.clearSelection()
    this.$store.commit('selectBuilding', this.building)
    this.zoomToSelection()
    this.getMap().then(() => this.updateMarkers())
  },
  methods: {
    ...mapActions(['zoomToSelection', 'updateMarkers', 'getMap']),
    ...mapMutations(['clearSelection']),
  },
}
</script>

<style>
.building-layout {
  display: flex;
  flex-direction: column;
}

.building-layout__header {
  flex: 0 0 1;
}

.building-layout__spaces {
  flex: 1 1 auto;
  padding-top: 0;
}
</style>
