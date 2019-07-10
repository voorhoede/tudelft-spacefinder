<template>
  <div class="mapbox-map">
    <div class="mapbox-map__placeholder">
      <span>(map)</span>
    </div>
  </div>
</template>

<style>
@import '../app-core/variables.css';

.mapbox-map {
  width: 100%;
  height: 100%;
  background-color: var(--highlight-color);
}

.mapbox-map__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
