export default function ({ route, store }) {
  store.commit('history/addRoute', route)
  return true
}
