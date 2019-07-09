<template>
  <nuxt-link :to="to" v-on:click.native="goBack">
    <slot>{{ $t('back') }}</slot>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    goBack(event) {
      event.preventDefault()
      window.history.back()
    }
  }
}
</script>
