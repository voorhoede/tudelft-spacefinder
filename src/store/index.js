import { getField, updateField } from 'vuex-map-fields'
import Deferred from '~/lib/deferred'
import filterSpaces from '~/lib/filter-spaces'
import loadMapboxgl from '~/lib/mapboxgl/load-async'

const mapLoaded = new Deferred()
const campusBounds = {
  north: 52.006471,
  west: 4.366779,
  south: 51.988050,
  east: 4.388487
}

const getDefaultFilters = () => ({
  adjustableChairs: false,
  bookable: false,
  daylit: false,
  ethernet: false,
  studyType: [],
  nearBathroom: false,
  nearCoffeeMachine: false,
  nearPrinter: false,
  powerOutlets: false,
  presentationScreen: false,
  quietness: [],
  showNearbyLocations: false,
  showOpenLocations: false,
  smartBoard: false,
  stationaryPC: false,
  whiteBoard: false
})

export const state = () => ({
  buildingsI18n: [],
  filters: getDefaultFilters(),
  isMobile: false,
  mapLoaded: false,
  selection: {
    building: undefined,
    space: undefined
  },
  showListView: true,
  spacesI18n: []
})

export const mutations = {
  clearFilters(state) {
    state.filters = getDefaultFilters()
  },
  selectBuilding(state, building) {
    state.selection = {
      building,
      space: undefined
    }
  },
  setBuildings(state, { buildings }) {
    state.buildingsI18n = buildings
  },
  setMapLoaded(state, { map }) {
    mapLoaded.resolve(map)
    state.mapLoaded = true
  },
  setSpaces(state, { spaces }) {
    state.spacesI18n = spaces
  },
  toggleListView(state) {
    state.showListView = !state.showListView
  },
  setMobileState(state, value) {
    state.isMobile = value
  },
  updateField
}

export const actions = {
  getMap() {
    return mapLoaded.promise
  },

  mountMap({ commit }, { container }) {
    loadMapboxgl().then((mapboxgl) => {
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
    })
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

export const getters = {
  buildings: (state) => {
    const { locale } = state.i18n
    return state.buildingsI18n.map((buildingI18n) => {
      const i18nProps = buildingI18n.i18n[locale]
      return {
        ...buildingI18n,
        ...i18nProps
      }
    })
  },
  filteredSpaces: (state, getters) => {
    return filterSpaces({
      filters: state.filters,
      spaces: getters.spaces
    })
  },
  filteredSpacesCount: (state, getters) => {
    return getters.filteredSpaces.length
  },
  getBuildingByNumber: (state, getters) => {
    return (number) => {
      return getters.buildings.find((building) => {
        return building.number === number
      })
    }
  },
  getBuildingBySlug: (state, getters) => {
    return (slug) => {
      return getters.buildings.find((building) => {
        return building.slug === slug
      })
    }
  },
  getField,
  getSpaceBySlug: (state, getters) => {
    return (slug) => {
      return getters.spaces.find((space) => {
        return space.slug === slug
      })
    }
  },
  spaces: (state, getters) => {
    const noBuilding = {} // spaces must have a building, but until they do, this prevents the app from crashing
    return state.spacesI18n.map((spaceI18n) => {
      const building = getters.getBuildingByNumber(spaceI18n.buildingNumber) || noBuilding
      return {
        ...spaceI18n,
        building
      }
    })
  }
}
