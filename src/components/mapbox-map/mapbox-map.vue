<template>
  <div class="mapbox-map" ref="map">
    <div v-if="!map" class="mapbox-map__placeholder">
      <span>(map)</span>
    </div>
  </div>
</template>

<script>
import mapboxgl from '~/lib/mapboxgl'

export default {
  data() {
    return {
      map: undefined,
    }
  },
  mounted() {
    this.map = new mapboxgl.Map({
      container: this.$refs.map,
      center: [4.3732876, 51.9997502],
      zoom: 13,
      style: 'mapbox://styles/mapbox/streets-v10',
    })
  }
}
</script>

<style>
.mapbox-map {
  width: 100%;
  height: 100%;
  background-color: #EEEEEE;
}

.mapbox-map__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
