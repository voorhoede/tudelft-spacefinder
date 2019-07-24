<template>
  <nav>
    <modal-drawer
      :isOpen="isOpen"
      :title="$t('menu')"
      @close="$emit('close')"
    >
      <ul class="app-menu flat-list">
        <li class="app-menu__item">
          <nuxt-link
            :to="`/${$i18n.locale}`"
            @click.native="$emit('close')"
            class="app-menu__link"
          >
            <home-icon class="app-menu__icon" />

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
            <building-icon class="app-menu__icon" />

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
              <map-icon class="app-menu__icon" />

              <span class="app-menu__link-name">
                {{ $t('mapToggle') }}
              </span>
            </span>
            <span v-else>
              <list-icon class="app-menu__icon" />

              <span class="app-menu__link-name">
                {{ $t('listToggle') }}
              </span>
            </span>
          </nuxt-link>
        </li>
        <li class="app-menu__item">
          <nuxt-link
            v-if="$i18n.locale === 'nl'"
            to="/en"
            @click.native="$emit('close')"
            hreflang="en"
            class="app-menu__link"
          >
            <world-icon class="app-menu__icon" />

            <span class="app-menu__link-name">
              english
            </span>
          </nuxt-link>

          <nuxt-link
            v-if="$i18n.locale === 'en'"
            to="/nl"
            @click.native="$emit('close')"
            hreflang="nl"
            class="app-menu__link"
          >
            <world-icon class="app-menu__icon" />

            <span class="app-menu__link-name">
              nederlands
            </span>
          </nuxt-link>
        </li>
      </ul>
    </modal-drawer>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import ModalDrawer from '../modal-drawer'

import BuildingIcon from '../../static/icons/building-icon.svg'
import HomeIcon from '../../static/icons/home-icon.svg'
import ListIcon from '../../static/icons/list-icon.svg'
import MapIcon from '../../static/icons/map-icon.svg'
import WorldIcon from '../../static/icons/world-icon.svg'

export default {
  components: { BuildingIcon, HomeIcon, ListIcon, MapIcon, ModalDrawer, WorldIcon },
  props: {
    isOpen: Boolean,
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

.app-menu__icon {
  margin-right: var(--spacing-half);
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
</style>
