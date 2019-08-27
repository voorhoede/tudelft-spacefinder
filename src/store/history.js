export const state = () => ({
  routes: [],
})

export const mutations = {
  addRoute(state, route) {
    const { fullPath, name } = route
    state.routes = [...state.routes, { fullPath, name }]
  },
  goBack(state) {
    state.routes = state.routes.slice(0, -1)
    window.history.back()
  },
}

export const getters = {
  currentPageRoute: (state) => {
    const currentRoutePath = state.routes[state.routes.length - 1]
    return currentRoutePath
  },
  hasHistory: (state) => {
    return state.routes.length > 1
  },
  previousPageUrl: (state, getters) => {
    if (!getters.hasHistory) return
    const previousRoutePath = state.routes[state.routes.length - 2]
    return previousRoutePath.fullPath
  },
}
