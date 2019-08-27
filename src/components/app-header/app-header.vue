<template>
  <header
    role="banner"
    class="app-header default-layout__header"
  >
    <nuxt-link
      :to="localePath('index')"
      class="app-header__logo"
    >
      <img
        src="~/assets/tu-delft-logo.svg"
        alt="Home"
      >
    </nuxt-link>

    <h1 class="app-header__title">
      {{ $t('title') }}
    </h1>

    <button
      ref="filterButton"
      type="button"
      class="app-header__button button button--header"
      @click="$emit('openFilterMenu')"
    >
      <svg-icon
        name="filter-icon"
        class="button--header__icon"
      />
      {{ $t('filter') }}

      <div
        v-show="isFiltered"
        class="app-header__status-indicator"
      />
    </button>

    <button
      ref="menuButton"
      type="button"
      class="app-header__button button button--header"
      @click="$emit('openAppMenu')"
    >
      <svg-icon
        name="menu-icon"
        class="button--header__icon"
      />
      {{ $t('menu') }}
    </button>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    openedMenu: {
      default: null,
      type: String,
    },
  },
  data() {
    return {
      lastOpenedMenu: null,
    }
  },
  computed: {
    ...mapGetters(['isFiltered']),
  },
  watch: {
    openedMenu() {
      if (this.lastOpenedMenu === 'app-menu') {
        this.$refs.menuButton.focus()
      } else if (this.lastOpenedMenu === 'filter-menu') {
        this.$refs.filterButton.focus()
      }
      this.lastOpenedMenu = this.openedMenu
    },
  },
}
</script>

<style>
@import '../app-core/variables.css';

.app-header {
  display: flex;
  justify-content: space-between;
  padding: 0 var(--spacing-half) 0 var(--spacing-half);
  height: var(--header-height-mobile);
  background-color: var(--brand-primary-color);
  color: var(--background-color);
}

@media (min-width: 700px) {
  .app-header {
    padding: 0 var(--spacing-default);
    height: var(--header-height-desktop);
  }
}

.app-header__logo {
  margin: 8px 0;
}

.app-header__logo img {
  height: 30px;
}

@media (min-width: 700px) {
  .app-header__logo img {
    height: 40px;
  }
}

.app-header__title {
  flex: 1 1 auto;
  margin: 0;
  font-size: var(--font-size-big);
  text-align: center;
  line-height: var(--header-height-mobile);
}

@media (min-width: 700px) {
  .app-header__title {
    line-height: var(--header-height-desktop);
  }
}

.app-header__button {
  position: relative;
  justify-self: flex-end;
}

@media (min-width: 700px) {
  .app-header__button:last-of-type {
    margin-left: var(--spacing-half);
  }
}

.app-header__status-indicator {
  position: absolute;
  padding: var(--spacing-quarter);
  top: 3px;
  right: 3px;
  width: 12px;
  height: 12px;
  background-color: var(--brand-secondary-color);
  border-radius: 50%;
}

@media (min-width: 700px) {
  .app-header__status-indicator {
    top: 5px;
    right: 5px;
  }
}
</style>
