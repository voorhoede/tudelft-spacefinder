import loadData from '~/lib/load-data'

export default ({ store }) => {
  const { locale } = store.state.i18n

  loadData(`${locale}/buildings.json`)
    .then((buildings) => {
      store.commit('setBuildings', { buildings })
    })

  loadData(`${locale}/spaces.json`)
    .then((spaces) => {
      store.commit('setSpaces', { spaces })
    })

}
