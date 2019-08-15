<template>
  <div>
    <template v-for="(locale, index) in $i18n.locales">
      <nuxt-link
        v-if="locale.code !== $i18n.locale"
        :key="index"
        :to="getLocalePath(locale.code)"
        @click.native="$emit('close')"
        :hreflang="locale.code"
        class="app-menu__link"
      >
        <svg-icon name="world-icon" class="app-menu__icon" />
        <span class="app-menu__link-name">
          {{ languages[locale.code] }}
        </span>
      </nuxt-link>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

const languages = { en: 'english', nl: 'nederlands' }

export default {
  computed: {
    languages() { return languages },
    ...mapGetters({ currentPageRoute: 'history/currentPageRoute' }),
    ...mapState(['selection'])
  },
  methods: {
    getLocalePath(locale) {
      const { currentPageRoute, selection } = this
      const localisedRouteName = currentPageRoute.name
      const genericRouteName = localisedRouteName.split('___')[0]
      const buildingSlug = selection.building && selection.building.i18n[locale].slug
      const spaceSlug = selection.space && selection.space.i18n[locale].slug
      const route = {
        name: genericRouteName,
        params: { buildingSlug, spaceSlug }
      }
      return this.localePath(route, locale)
    }
  },
}
</script>
