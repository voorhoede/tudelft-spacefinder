import 'mapbox-gl/dist/mapbox-gl.css'

// eslint-disable-next-line import/no-mutable-exports
let mapboxgl

if (process.browser) {
  // use old skool `require` because there is no support for dynamic `import`
  mapboxgl = require('mapbox-gl')
  mapboxgl.accessToken = process.env.MAPBOX_TOKEN
}

export default mapboxgl
