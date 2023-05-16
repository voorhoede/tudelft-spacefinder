export default {
  zoom: 12, // default mapbox zoom level when initializing the map
  minZoom: 13, // minimum zoom level when zooming out this is the 'lock'
  defaultZoom: 16.8, // default zoom level when no selection is made in zoomToBuilding and zoomToSpace 
  unClusterZoom: 16.8, // zoom level when unclustering so clusters become individual points / spaces
  buildingZoom: 16.8, // zoom level when zooming to a building in zoomToBuilding
  spaceZoom: 18, // zoom level when zooming to a space in zoomToSpace
}
