import { getField, updateField } from 'vuex-map-fields'
import Deferred from '~/lib/deferred'
import { spaceFilter, spaceIsOpen } from '~/lib/filter-spaces'
import campusBounds from '~/lib/campus-bounds'
import delay from '~/lib/delay'

const mapLoaded = new Deferred()

const getDefaultFilters = () => ({
  adjustableChairs: false,
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
  whiteBoard: false,
})

export const state = () => ({
  activeMarkerFilters: [],
  buildingsI18n: [],
  filters: getDefaultFilters(),
  installPromptEvent: undefined,
  isInstallable: false,
  isMapMode: false,
  isMobile: false,
  mapLoaded: false,
  selection: {
    building: undefined,
    space: undefined,
  },
  showListView: true,
  spacesI18n: [],
})

export const mutations = {
  clearFilters(state) {
    state.filters = getDefaultFilters()
  },
  clearSelection(state) {
    state.selection = {
      building: undefined,
      space: undefined,
    }
  },
  selectBuilding(state, building) {
    state.selection = {
      building,
      space: undefined,
    }
  },
  selectSpace(state, space) {
    state.selection = {
      ...state.selection,
      space,
    }
  },
  setActiveMarkerFilters(state, filters) {
    state.activeMarkerFilters = filters
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
  updateField,
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

  updateMarkers({ state, commit }) {
    const {
      building: { number: buildingNumber } = {},
      space: { spaceId } = {},
    } = state.selection

    let filters = []
    let hasSelectedBuilding = false

    if (spaceId) {
      // All filters are off if a space is selected
      commit('setActiveMarkerFilters', [ ['==', 'spaceId', spaceId] ])
      return
    } else if (buildingNumber) {
      // If a building is selected, filtering by building should be disabled
      filters = [ ['==', 'buildingNumber', buildingNumber] ]
      hasSelectedBuilding = true
    }

    // Go through the enabled filters
    const featureFilters = Object.entries(state.filters).reduce((filters, [ key, value ]) => {
      if (typeof value === 'boolean' && value) {
        const filter = key === 'showOpenLocations' ? 'isOpen' : key
        return [ ...filters, ['==', filter, value] ]
      } else if (Array.isArray(value) && value.length > 0) {
        if (key === 'buildings' && hasSelectedBuilding) {
          return filters
        }

        if (key === 'buildings') {
          const buildingFilters = value.map(v => ['==', 'buildingNumber', v])
          return [ ...filters, [ 'any', ...buildingFilters ] ]
        }

        return [ ...filters, ['in', key, ...value] ]
      }
      return filters
    }, [])

    commit('setActiveMarkerFilters', [ ...filters, ...featureFilters ])
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

  async resizeMap({ dispatch }) {
    const map = await dispatch('getMap')

    // Wait for the next paint of the browser before resizing the map
    // This prevents grey areas when resizing the browser
    await delay(0)
    map.resize()
  },

  async zoomToBounds({ dispatch }, { bounds, padding }) {
    const map = await dispatch('getMap')
    const defaultPadding = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20,
    }
    map.fitBounds([
      [bounds.west, bounds.south],
      [bounds.east, bounds.north],
    ], {
      padding: { ...defaultPadding, ...padding },
    })
  },

  zoomToCampus({ dispatch }) {
    dispatch('zoomToBounds', { bounds: campusBounds })
  },

  zoomToSelection({ dispatch, state }, { padding } = {}) {
    const bounds = state.selection.building.bounds
    dispatch('zoomToBounds', { bounds, padding })
  },
}

export const getters = {
  buildings: (state) => {
    return state.buildingsI18n
      .map((buildingI18n) => {
        const i18nProps = buildingI18n.i18n[state.i18n.locale]
        return {
          ...buildingI18n,
          ...i18nProps,
        }
      })
      .sort((buildingA, buildingB) => buildingA.name > buildingB.name)
  },
  filteredSpaces: (state, getters) => {
    return spaceFilter({
      filters: state.filters,
      spaces: getters.spaces,
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
  getSpaceById: (state, getters) => {
    return (id) => {
      return getters.spaces.find((space) => {
        return space.spaceId === id
      })
    }
  },
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
        building,
      }
    })
  },
  geoJsonSpaces: (state, getters) => {
    const now = new Date()
    const featuresPerSpace = getters.spaces.map((space) => {
      return {
        type: 'Feature',
        properties: {
          spaceId: space.spaceId,
          buildingNumber: space.building.number,
          isOpen: spaceIsOpen(now, space.openingHours),
          ...space.facilities,
        },
        geometry: {
          type: 'Point',
          coordinates: [space.longitude, space.latitude],
        },
      }
    })

    return {
      type: 'FeatureCollection',
      features: featuresPerSpace,
    }
  },
  isBuildingPage: (state) => {
    return state.selection.building && !state.selection.space
  },
}
