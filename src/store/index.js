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
  buildings: [],
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
  installPromptEvent: undefined,
  isInstallable: false,
  isMobile: false,
  mapLoaded: false,
  selection: {
    building: undefined,
    space: undefined
  },
  isMapMode: false,
  spacesI18n: []
})

export const mutations = {
  clearFilters(state) {
    state.filters = getDefaultFilters()
  },
  clearSelection(state) {
    state.selection = {
      building: undefined,
      space: undefined
    }
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
  setInstallPromptEvent(state, event) {
    state.installPromptEvent = event
    state.isInstallable = true
  },
  setMapLoaded(state, { map }) {
    mapLoaded.resolve(map)
    state.mapLoaded = true
  },
  setSpaces(state, { spaces }) {
    state.spacesI18n = spaces
  },
  toggleMapMode(state) {
    state.isMapMode = !state.isMapMode
  },
  setMobileState(state, value) {
    state.isMobile = value
  },
  unsetInstallEvent(state) {
    state.installPromptEvent = undefined
    state.isInstallable = false
  },
  updateField
}

export const actions = {
  getMap() {
    return mapLoaded.promise
  },

  installApp: ({ commit, state }) => {
    const { installPromptEvent, isInstallable } = state
    if (!isInstallable) {
      return Promise.reject(new Error('Install unavailable'))
    }
    installPromptEvent.prompt()
    return installPromptEvent.userChoice
      .then((result) => {
        if (result.outcome === 'accepted') {
          commit('unsetInstallEvent')
          return result
        }
        return Promise.reject(new Error('User dismissed install'))
      })
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

  zoomAuto({ dispatch, state }) {
    const zoomAction = state.selection.building
      ? 'zoomToSelection'
      : 'zoomToCampus'
    return dispatch(zoomAction)
  },

  async zoomIn({ dispatch }) {
    const map = await dispatch('getMap')
    map.zoomIn()
  },

  async zoomOut({ dispatch }) {
    const map = await dispatch('getMap')
    map.zoomOut()
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
    return state.buildingsI18n.map((buildingI18n) => {
      const i18nProps = buildingI18n.i18n[state.i18n.locale]
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
  isFiltered: (state, getters) => {
    return getters.filteredSpacesCount < getters.spaces.length
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
    const { locale } = state.i18n
    return state.spacesI18n.map((spaceI18n) => {
      const propsI18n = spaceI18n.i18n[locale]
      const building = getters.getBuildingByNumber(spaceI18n.buildingNumber)
      return {
        ...spaceI18n,
        ...propsI18n,
        building
      }
    })
  }
}
