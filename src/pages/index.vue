<template>
  <nav>
    <h1>Home: {{ $i18n.locale }}</h1>
    <nuxt-link :to="localePath({ name: 'buildings' })">
      {{ $t('buildings') }}
    </nuxt-link>
  </nav>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('zoomToCampus')
  }
}
</script>
