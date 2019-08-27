<template>
  <modal-drawer
    :is-open="isOpen"
    :title="$t('menu')"
    @close="$emit('close')"
  >
    <nav class="app-menu">
      <ul class="flat-list">
        <li class="app-menu__item">
          <nuxt-link
            :to="localePath('index')"
            class="app-menu__link"
            @click.native="$emit('close')"
          >
            <svg-icon name="home-icon" class="app-menu__icon" />

            <span class="app-menu__link-name">
              {{ $t('home') }}
            </span>
          </nuxt-link>
        </li>
        <li class="app-menu__item">
          <nuxt-link
            :to="localePath({ name: 'buildings' })"
            class="app-menu__link"
            @click.native="$emit('close')"
          >
            <svg-icon name="building-icon" class="app-menu__icon" />

            <span class="app-menu__link-name">
              {{ $t('buildingTitle') }}
            </span>
          </nuxt-link>
        </li>
        <li class="mobile-only app-menu__item">
          <nuxt-link
            :to="localePath('index')"
            class="app-menu__link"
            @click.native="toggleMapMode"
          >
            <span v-if="isMapMode">
              <svg-icon name="list-icon" class="app-menu__icon" />

              <span class="app-menu__link-name">
                {{ $t('listToggle') }}
              </span>
            </span>
            <span v-else>
              <svg-icon name="map-icon" class="app-menu__icon" />

              <span class="app-menu__link-name">
                {{ $t('mapToggle') }}
              </span>
            </span>
          </nuxt-link>
        </li>
        <li class="app-menu__item">
          <language-selector />
        </li>
        <li
          v-if="isInstallable"
          class="app-menu__item"
        >
          <button
            type="button"
            class="app-menu__link app-menu__button button"
            @click="installApp"
          >
            <svg-icon name="plus-icon" class="app-menu__icon" />

            <span class="app-menu__link-name">
              {{ $t('addToHomescreen') }}
            </span>
          </button>
        </li>
      </ul>
    </nav>
  </modal-drawer>
</template>

<script>
import { mapState } from 'vuex'
import LanguageSelector from '../language-selector'
import ModalDrawer from '../modal-drawer'

export default {
  components: { LanguageSelector, ModalDrawer },
  props: {
    isOpen: Boolean,
  },
  computed: mapState(['appLanguage', 'isInstallable', 'isMapMode']),
  methods: {
    installApp() {
      this.$store.dispatch('installApp')
        .then(() => this.$emit('close'))
    },
    toggleMapMode() {
      this.$store.commit('toggleMapMode')
      this.$emit('close')
    },
  },
}
</script>

<style>
.app-menu {
  padding: 0 var(--spacing-default) var(--spacing-default) var(--spacing-default);
}

li.app-menu__item {
  display: block;
  border-bottom: 1px solid var(--highlight-color);
  text-transform: lowercase
}

.app-menu__link {
  display: block;
    padding: var(--spacing-default) 0;
  text-decoration: none;
}

.app-menu__link:hover .app-menu__link-name,
.app-menu__link:focus .app-menu__link-name {
  text-decoration: underline;
}

.app-menu__link-name {
  display: inline-block;
}

.app-menu__link-name::first-letter {
  text-transform: uppercase;
}

.app-menu__button {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
}

.app-menu__button:hover,
.app-menu__button:focus {
  border: none;
}

.app-menu__icon {
  margin-right: var(--spacing-half);
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
</style>
