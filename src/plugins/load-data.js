import loadData from '~/lib/load-data'

export default ({ store }) => {
  loadData(`buildings.json`)
    .then((buildings) => {
      store.commit('setBuildings', { buildings })
    })

  loadData(`spaces.json`)
    .then((spaces) => {
      store.commit('setSpaces', { spaces })
    })
}