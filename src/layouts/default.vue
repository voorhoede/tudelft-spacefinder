<template>
  <div class="default-layout">
    <app-header
      @openAppMenu="openAppMenu"
      @openFilterMenu="openFilterMenu"
      :openedMenu="openedMenu"
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
import debounce from 'lodash.debounce'
import { AppHeader, AppMenu, FilterMenu, MapboxMap } from '../components'

export default {
  components: { AppHeader, AppMenu, FilterMenu, MapboxMap },
  data() {
    return {
      openedMenu: null,
      onResizeDebounce: debounce(this.onResize, 200)
    }
  },
  beforeMount() {
    this.onResize()
    window.addEventListener('resize', this.onResizeDebounce, true)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResizeDebounce, true)
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
    },
    onResize() {
      if(window.matchMedia('(min-width: 700px)').matches) {
        this.$store.commit('setMobileState', false)
      } else {
        this.$store.commit('setMobileState', true)
      }
    }
  }
}
</script>
