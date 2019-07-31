<template>
  <a 
    v-if="previousPageUrl"
    :href="previousPageUrl"
    @click.prevent="goBack"
  >
    <slot>{{ $t('back') }}</slot>
  </a>
  <nuxt-link 
    v-else 
    :to="to"
  >
    <slot>{{ $t('back') }}</slot>
  </nuxt-link>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      previousPageUrl: 'history/previousPageUrl'
    })
  },
  methods: {
    goBack() {
      this.$store.commit('history/goBack')
    }
  }
}
</script>
