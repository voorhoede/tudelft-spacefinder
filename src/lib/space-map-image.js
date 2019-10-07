/**
 * Create a static map of building map with space marker
 *
 * @return image of building map with space marker
 */
export default function ({ space }) {
  const { bounds } = space.building
  // Use invisible markers at the bounds of the building
  // and set zoom to `auto` so map extends exactly to building
  const invisibleMarkerUrl = encodeURIComponent('https://5d4b289a581fb6255e317d9d--assets-jasper.netlify.com/no-marker.png')
  const width = 800
  const height = width
  const primaryColor = '#8B2BA7'
  const url = [
    'https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/',
    `pin-s+${primaryColor.slice(1)}(${space.longitude},${space.latitude}),`,
    `url-${invisibleMarkerUrl}(${bounds.west},${bounds.north}),`,
    `url-${invisibleMarkerUrl}(${bounds.east},${bounds.south})`,
    '/auto',
    `/${width}x${height}@2x`,
    `?access_token=${process.env.MAPBOX_TOKEN}`,
  ].join('')

  return { height, width, url }
}
