<template>
  <div class="default-layout">
    <app-header
      @openAppMenu="openAppMenu"
      @openFilterMenu="openFilterMenu"
    />

    <main class="default-layout__main">
      <nuxt />

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
