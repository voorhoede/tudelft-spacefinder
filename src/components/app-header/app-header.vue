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
  background-color: #27A8D2;
  color: white;
  padding: .5em;
}
</style>
