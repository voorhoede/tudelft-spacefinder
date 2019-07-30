export default () => {
  if (process.browser) {
    return import(/* webpackChunkName:'mapboxgl' */ './index')
      .then((module) => { return module.default })
  }
}
