import Deferred from '~/lib/deferred'
import mapboxgl from '~/lib/mapboxgl'

const mapLoaded = new Deferred()
const campusBounds = {
  north: 52.006471,
  west: 4.366779,
  south: 51.988050,
  east: 4.388487
}

export const state = () => ({
  buildings: [],
  isMobile: false,
  mapLoaded: false,
  selection: {
    building: undefined,
    space: undefined
  },
  showListView: true,
  spaces: []
})

export const mutations = {
  selectBuilding(state, building) {
    state.selection = {
      building,
      space: undefined
    }
  },
  setMapLoaded(state, { map }) {
    mapLoaded.resolve(map)
    state.mapLoaded = true
  },
  toggleListView(state) {
    state.showListView = !state.showListView
  },
  setMobileState(state, value) {
    state.isMobile = value
  }
}

export const actions = {
  getMap() {
    return mapLoaded.promise
  },

  mountMap({ commit }, { container }) {
    const map = new mapboxgl.Map({
      container,
      center: [
        (campusBounds.west + campusBounds.east) / 2,
        (campusBounds.north + campusBounds.south) / 2
      ],
      zoom: 13,
      style: 'mapbox://styles/mapbox/streets-v10'
    })
    map.on('load', () => commit('setMapLoaded', { map }))
  },

  async zoomToBounds({ dispatch }, { bounds, padding }) {
    const map = await dispatch('getMap')
    const defaultPadding = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    }
    map.fitBounds([
      [bounds.west, bounds.south],
      [bounds.east, bounds.north]
    ], {
      padding: { ...defaultPadding, ...padding }
    })
  },

  zoomToCampus({ dispatch }) {
    dispatch('zoomToBounds', { bounds: campusBounds })
  },

  zoomToSelection({ dispatch, state }, { padding } = {}) {
    const bounds = state.selection.building.bounds
    dispatch('zoomToBounds', { bounds, padding })
  }
}
