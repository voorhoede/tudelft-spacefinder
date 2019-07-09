<template>
  <div
    aria-hidden="false"
    role="alertdialog"
    aria-labelledby="modal-drawer-title"
    class="modal-drawer"
  >
    <header class="modal-drawer__header">
      <h2 id="modal-drawer-title">
        {{ title }}
      </h2>
      <button type="button" @click="$emit('close')">
        {{ $t('close') }}
      </button>
    </header>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  }
}
</script>

<style>
.modal-drawer {
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  width: 20rem;
  background-color: white;
  border: 1px solid black;
}

.modal-drawer__header {
  display: flex;
  justify-content: space-between;
  background-color: #27A8D2;
  color: white;
  padding: .5em;
}
</style>
