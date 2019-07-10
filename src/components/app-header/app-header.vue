<template>
  <header role="banner" class="app-header">
    TU Delft - Spacefinder
    <button type="button" @click="$emit('openFilterMenu')">
      {{ $t('filter') }}
    </button>
    <button type="button" @click="$emit('openAppMenu')">
      {{ $t('menu') }}
    </button>
  </header>
</template>

<style>
.app-header {
  background-color: var(--brand-primary-color);
  color: var(--background-color);
  padding: .5em;
}
</style>
