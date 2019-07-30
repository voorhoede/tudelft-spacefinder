<template>
  <modal-drawer
    :isOpen="isOpen"
    :title="$t('menu')"
    @close="$emit('close')"
  >
    <nav class="app-menu">
      <ul class="flat-list">
        <li class="app-menu__item">
          <nuxt-link
            :to="`/${$i18n.locale}`"
            @click.native="$emit('close')"
            class="app-menu__link"
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
            @click.native="$emit('close')"
            class="app-menu__link"
          >
            <svg-icon name="building-icon" class="app-menu__icon" />

            <span class="app-menu__link-name">
              {{ $t('buildings') }}
            </span>
          </nuxt-link>
        </li>
        <li class="mobile-only app-menu__item">
          <nuxt-link
            :to="`/${$i18n.locale}`"
            @click.native="toggleListView"
            class="app-menu__link"
          >
            <span v-if="showListView">
              <svg-icon name="map-icon" class="app-menu__icon" />

              <span class="app-menu__link-name">
                {{ $t('mapToggle') }}
              </span>
            </span>
            <span v-else>
              <svg-icon name="list-icon" class="app-menu__icon" />

              <span class="app-menu__link-name">
                {{ $t('listToggle') }}
              </span>
            </span>
          </nuxt-link>
        </li>
        <li class="app-menu__item">
          <nuxt-link
            v-for="(locale, index) in $i18n.locales"
            :key="index"
            v-if="locale.code !== $i18n.locale"
            :to="`/${locale.code}`"
            @click.native="$emit('close')"
            :hreflang="locale.code"
            class="app-menu__link"
          >
            <svg-icon name="world-icon" class="app-menu__icon" />

            <span class="app-menu__link-name">
              {{ languages[locale.code] }}
            </span>
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </modal-drawer>
</template>

<script>
import { mapState } from 'vuex'
import ModalDrawer from '../modal-drawer'

export default {
  components: { ModalDrawer },
  props: {
    isOpen: Boolean,
  },
  data() {
    return {
      languages: {
        en: 'english',
        nl: 'nederlands'
      }
    }
  },
  computed: mapState(['appLanguage', 'showListView']),
  methods: {
    toggleListView() {
      this.$store.commit('toggleListView')
      this.$emit('close')
    },
  }
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

.app-menu__icon {
  margin-right: var(--spacing-half);
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
</style>
