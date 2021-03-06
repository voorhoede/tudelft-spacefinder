<template>
  <div ref="map" class="mapbox-map">
    <div v-if="!mapLoaded" class="mapbox-map__placeholder">
      <span class="mapbox-map__loading-message">{{ $t('mapLoading') }}</span>
    </div>
    <zoom-controls
      v-if="mapLoaded"
      class="mapbox-map__zoom-controls"
      @auto-focus="autoFocus"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import ZoomControls from '../zoom-controls'
import mapMarker from '~/assets/icons/map-marker.png'
import loadMapboxgl from '~/lib/mapboxgl/load-async'
import campusBounds from '~/lib/campus-bounds'
import i18nSlug from '~/lib/i18n-slug'

export default {
  components: { ZoomControls },
  data() {
    return {
      onResizeDebounce: debounce(this.onResize, 200),
    }
  },
  computed: {
    ...mapState(['mapLoaded', 'activeMarkerFilters']),
    ...mapGetters(['filteredSpaces', 'geoJsonSpaces', 'getSpaceById', 'getBuildingByNumber']),
  },
  watch: {
    activeMarkerFilters(filters, oldValue) {
      this.setMarkers(filters)
    },
    filteredSpaces(newValue, oldValue) {
      this.updateMarkers()
    },
  },
  mounted() {
    this.initMap()
    this.getMap()
      .then(this.fixInsecureLinks)
      .then(this.updateMarkers)
    window.addEventListener('resize', this.onResizeDebounce, true)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResizeDebounce, true)
  },
  methods: {
    ...mapActions(['getMap', 'updateMarkers']),
    ...mapMutations(['setMapLoaded']),
    async setMarkers(filters = []) {
      const map = await this.getMap()
      if (filters.length) {
        map.setFilter('points', ['all', ...filters])
      } else {
        map.setFilter('points')
      }
    },
    autoFocus() {
      this.$store.dispatch('zoomAuto')
    },
    zoomIn() {
      this.$store.dispatch('zoomIn')
    },
    zoomOut() {
      this.$store.dispatch('zoomOut')
    },
    onResize() {
      this.$store.dispatch('resizeMap')
    },
    /**
     * Mapbox renders insecure external links.
     * To fix these `[rel="noreferrer"]` is added when the links are rendered.
     * @see https://developers.google.com/web/tools/lighthouse/audits/noopener
     */
    fixInsecureLinks() {
      if (!('MutationObserver' in window)) { return }
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
    },
    initMap() {
      loadMapboxgl().then((mapboxgl) => {
        const map = new mapboxgl.Map({
          container: this.$refs.map,
          center: [
            (campusBounds.west + campusBounds.east) / 2,
            (campusBounds.north + campusBounds.south) / 2,
          ],
          zoom: 13,
          trackResize: false, // prevent triggering a resize in mapbox, as we do it ourselves now (see store)
          style: 'mapbox://styles/mapbox/streets-v10',
          maxBounds: [
            campusBounds.southWest,
            campusBounds.northEast,
          ],
        })
        map.on('load', () => {
          map.loadImage(mapMarker, (error, image) => {
            if (error) {
              console.error('a mapbox error occurred')
              return
            }
            map.addImage('marker-icon', image)
            map.addLayer({
              id: 'points',
              interactive: true,
              type: 'symbol',
              source: {
                type: 'geojson',
                data: this.geoJsonSpaces,
              },
              layout: {
                'icon-image': 'marker-icon',
                'icon-allow-overlap': true,
              },
            })
            this.setMapLoaded({ map })
          })
        })
        map.on('click', (e) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ['points'] })
          const { app } = this.$store
          if (features.length) {
            const [{ properties: { buildingNumber, spaceId } = {} } = {}] = features
            if (!buildingNumber || !spaceId) { return }
            const locale = app.i18n.locale
            const buildingSlug = i18nSlug(locale, this.getBuildingByNumber(buildingNumber))
            const spaceSlug = i18nSlug(locale, this.getSpaceById(spaceId))
            const url = app.localePath({
              name: 'buildings-buildingSlug-spaces-spaceSlug',
              params: { buildingSlug, spaceSlug },
            })
            app.router.push(url)
          }
        })
      })
    },
  },
}
</script>

<style>
@import '../app-core/variables.css';

.mapbox-map {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--mapbox-background-color);
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

.mapbox-map__zoom-controls {
  position: absolute;
  bottom: var(--spacing-default);
  right: var(--spacing-default);
  z-index: var(--layer--raised);
}
</style>
