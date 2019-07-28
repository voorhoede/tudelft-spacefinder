<template>
  <div class="mapbox-map" ref="map">
    <div v-if="!mapLoaded" class="mapbox-map__placeholder">
      <span class="mapbox-map__loading-message">{{ $t('mapLoading') }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState(['mapLoaded']),
  mounted() {
    this.$store.dispatch('mountMap', { container: this.$refs.map })
      .then(() => this.fixInsecureLinks())
  },
  methods: {
    /**
     * Mapbox renders insecure external links.
     * To fix these `[rel="noreferrer"]` is added when the links are rendered.
     * @see https://developers.google.com/web/tools/lighthouse/audits/noopener
     */
    fixInsecureLinks() {
      if (!'MutationObserver' in window) { return }
      const selector = `a:not([href^="${window.location.origin}"]):not([rel*="noreferrer"])`
      const observer = new MutationObserver((mutations) => {
        const element = this.$refs.map.querySelector('.mapboxgl-ctrl-attrib')
        if (element) {
          observer.disconnect()
          Array.from(element.querySelectorAll(selector)).forEach((insecureLink) => {
            const rel = insecureLink.getAttribute('rel') || ''
            insecureLink.setAttribute('rel', `${rel} noreferrer`)
          })
        }
      })
      observer.observe(this.$refs.map, { attributes: false, childList: true, subtree: true })
    }
  }
}
</script>

<style>
@import '../app-core/variables.css';

.mapbox-map {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--highlight-color);
}

.mapbox-map__placeholder {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mapbox-map__loading-message {
  font-size: var(--font-size-default);
}
</style>
