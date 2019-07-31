const copyObject = (object) => { return JSON.parse(JSON.stringify(object)) }

export const state = () => ({
  routes: []
})

export const mutations = {
  addRoute(state, route) {
    state.routes = [...state.routes, copyObject(route)]
  },
  goBack(state) {
    state.routes = state.routes.slice(0, -1)
    window.history.back()
  }
}

export const getters = {
  hasHistory: (state) => {
    return state.routes.length > 1
  },
  previousPageUrl: (state, getters) => {
    if (!getters.hasHistory) return
    const previousRoute = state.routes[state.routes.length - 2]
    return previousRoute.fullPath
  }
}
