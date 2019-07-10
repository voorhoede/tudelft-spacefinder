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

      <button
        @click="$emit('close')"
        class="button button--header"
      >
        <img
          src="/icons/close-icon.svg"
          alt=""
          class="button--header__icon"
        >

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
@import '../app-core/variables.css';

.modal-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: var(--column-width-mobile);
  height: 100vh;
  background-color: var(--background-color);
}

@media (min-width: 700px) {
  .modal-drawer {
    width: var(--column-width-desktop);
  }
}

.modal-drawer__header {
  display: flex;
  justify-content: space-between;
  padding: 0 var(--spacing-default);
  height: var(--header-height-mobile);
  background-color: var(--brand-primary-color);
  line-height: var(--header-height-mobile);
  color: var(--background-color);
}

@media (min-width: 700px) {
  .modal-drawer__header {
    height: var(--header-height-desktop);
    line-height: var(--header-height-desktop);
  }
}
</style>
