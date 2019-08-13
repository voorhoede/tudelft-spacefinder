export const state = () => ({
  routePaths: []
})

export const mutations = {
  addRoute(state, route) {
    const { fullPath } = route
    state.routePaths = [...state.routePaths, fullPath]
  },
  goBack(state) {
    state.routePaths = state.routePaths.slice(0, -1)
    window.history.back()
  }
}

export const getters = {
  hasHistory: (state) => {
    return state.routePaths.length > 1
  },
  previousPageUrl: (state, getters) => {
    if (!getters.hasHistory) return
    const previousRoutePath = state.routePaths[state.routePaths.length - 2]
    return previousRoutePath
  }
}
