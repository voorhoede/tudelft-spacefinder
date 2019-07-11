<template>
  <div class="mapbox-map" ref="map">
    <div v-if="!mapLoaded" class="mapbox-map__placeholder">
      <span>({{ $t('map') }})</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState(['mapLoaded']),
  mounted() {
    this.$store.dispatch('mountMap', { container: this.$refs.map })
  }
}
</script>

<style>
@import '../app-core/variables.css';

.mapbox-map {
  width: 100%;
  height: 100%;
  background-color: #E4E5E0;
}

.mapbox-map__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
