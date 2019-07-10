<template>
  <div class="default-layout">
    <app-header
      @openAppMenu="openAppMenu"
      @openFilterMenu="openFilterMenu"
    />
    <main class="default-layout__main">
      <section class="default-layout__info">
        <nuxt />
      </section>
      <mapbox-map class="default-layout__map"/>
    </main>
    <app-menu v-if="openedMenu === 'app-menu'" @close="closeMenu" />
    <filter-menu v-if="openedMenu === 'filter-menu'" @close="closeMenu" />
  </div>
</template>

<script>
import { AppHeader, AppMenu, FilterMenu, MapboxMap } from '../components'

export default {
  components: { AppHeader, AppMenu, FilterMenu, MapboxMap },
  data() {
    return {
      openedMenu: undefined,
    }
  },
  methods: {
    openAppMenu() {
      this.openedMenu = 'app-menu'
    },
    openFilterMenu() {
      this.openedMenu = 'filter-menu'
    },
    closeMenu() {
      this.openedMenu = undefined
    }
  }
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
  width: var(--column-width-mobile);
  background-color: #F7F7F7;
}

@media (min-width: 700px) {
  .default-layout__info {
    width: var(--column-width-desktop);
  }
}

.default-layout__map {
  flex: 1;
}
</style>
