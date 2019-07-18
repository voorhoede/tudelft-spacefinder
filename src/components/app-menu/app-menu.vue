<template>
  <nav>
    <modal-drawer
      :isOpen="isOpen"
      :title="$t('menu')"
      @close="$emit('close')"
    >
      <ul>
        <li>
          <nuxt-link
            :to="`/${$i18n.locale}`"
            @click.native="$emit('close')"
          >
            {{ $t('home') }}
          </nuxt-link>
        </li>
        <li>
          <nuxt-link
            :to="localePath({ name: 'buildings' })"
            @click.native="$emit('close')"
          >
            {{ $t('buildings') }}
          </nuxt-link>
        </li>
        <li>
          <nuxt-link
            :to="`/${$i18n.locale}`"
            @click.native="toggleListView"
          >
            <span v-if="showListView">{{ $t('mapToggle') }}</span>
            <span v-else>{{ $t('listToggle') }}</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link
            v-if="$i18n.locale === 'nl'"
            to="/en"
            @click.native="$emit('close')"
            hreflang="en"
          >
            english
          </nuxt-link>

          <nuxt-link
            v-if="$i18n.locale === 'en'"
            to="/nl"
            @click.native="$emit('close')"
            hreflang="nl"
          >
            nederlands
          </nuxt-link>
        </li>
      </ul>
    </modal-drawer>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import ModalDrawer from '../modal-drawer'

export default {
  components: { ModalDrawer },
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
