<template>
  <div class="default-layout">
    <app-header />
    <main class="default-layout__main">
      <section class="default-layout__info">
        <nuxt />
      </section>
      <mapbox-map class="default-layout__map"/>
    </main>
  </div>
</template>

<script>
import { AppHeader, MapboxMap } from '../components'

export default {
  components: { AppHeader, MapboxMap }
}
</script>

<style>
.default-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.default-layout__main {
  overflow-y: scroll;
  display: flex;
  flex: 1;
}

.default-layout__info {
  width: 20rem;
  background-color: #F7F7F7;
}

.default-layout__map {
  flex: 1;
}
</style>
