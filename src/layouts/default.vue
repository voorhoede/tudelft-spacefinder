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

    <app-menu :isOpen="openedMenu === 'app-menu'" @close="closeMenu" />

    <filter-menu :isOpen="openedMenu === 'filter-menu'" @close="closeMenu" />
  </div>
</template>

<script>
import { AppHeader, AppMenu, FilterMenu, MapboxMap } from '../components'

export default {
  components: { AppHeader, AppMenu, FilterMenu, MapboxMap },
  data() {
    return {
      openedMenu: null,
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
      this.openedMenu = null
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
  flex: 1 1 auto;
}

.default-layout__info {
  flex: 0 0 auto;
  padding: var(--spacing-default);
  width: var(--column-width-mobile);
  background-color: var(--neutral-color);
  overflow: auto;
}

@media (min-width: 700px) {
  .default-layout__info {
    width: var(--column-width-desktop);
  }
}

.default-layout__map {
  flex: 1 1 auto;
}
</style>
