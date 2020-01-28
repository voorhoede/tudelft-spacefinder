<template>
  <div
    ref="defaultLayout"
    class="default-layout"
  >
    <client-only>
      <pop-up />
    </client-only>

    <notification-bar
      class="default-layout__notification-bar"
      :message="$t('ieNotification')"
    />

    <app-header
      :opened-menu="openedMenu"
      @openAppMenu="openAppMenu"
      @openFilterMenu="openFilterMenu"
    />

    <main class="default-layout__main">
      <nuxt />

      <mapbox-map class="default-layout__map" />
    </main>

    <app-menu
      :is-open="openedMenu === 'app-menu'"
      @close="closeMenu"
    />

    <filter-menu
      :is-open="openedMenu === 'filter-menu'"
      @close="closeMenu"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import { AppHeader, AppMenu, FilterMenu, MapboxMap, NotificationBar, PopUp } from '../components'

export default {
  components: { AppHeader, AppMenu, FilterMenu, MapboxMap, NotificationBar, PopUp },
  head() {
    return {
      script: [
        {
          innerHTML: `
            var isIE = (/(MSIE|Trident)/).test(window.navigator.userAgent);
            if (isIE) { document.documentElement.className += " old-ie"; }
          `,
        },
      ],
      __dangerouslyDisableSanitizers: ['script'],
    }
  },
  data() {
    return {
      openedMenu: null,
      onResizeDebounce: debounce(this.onResize, 200),
    }
  },
  mounted() {
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
      const windowHeight = window.innerHeight * 0.01
      this.$refs.defaultLayout.style.setProperty('--window-height', `${windowHeight}px`)

      if (window.matchMedia('(min-width: 700px)').matches) {
        this.$store.commit('setMobileState', false)
      } else {
        this.$store.commit('setMobileState', true)
      }
    },
  },
}
</script>

<style>
.default-layout__notification-bar {
  display: none;
}
.old-ie .default-layout__notification-bar {
  display: block;
}
</style>
