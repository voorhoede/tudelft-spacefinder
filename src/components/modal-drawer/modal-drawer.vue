<template>
<div>
  <transition name="modal-slide">
    <div
      v-if="isOpen"
      aria-hidden="false"
      role="alertdialog"
      aria-labelledby="modal-drawer-title"
      class="modal-drawer"
    >
      <div class="modal-drawer__body">
        <header class="modal-drawer__header">
          <h2 id="modal-drawer-title">
            {{ title }}
          </h2>

          <button
            type="button"
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
    </div>
  </transition>

  <transition name="modal-fade">
    <div
      v-if="isOpen"
      @click="$emit('close')"
      class="modal-drawer__background"
    ></div>
  </transition>

  </div>
</template>

<script>
export default {
  props: {
    title: String,
    isOpen: Boolean,
  }
}
</script>

<style>
@import '../app-core/variables.css';

.modal-drawer {
  z-index: var(--layer--raised);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
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

.modal-drawer__body {
  position: absolute;
  top: 0;
  right: 0;
  width: var(--column-width-mobile);
  height: 100%;
  background: var(--background-color);
}

@media (min-width: 700px) {
  .modal-drawer__body {
    width: var(--column-width-desktop);
  }
}

.modal-drawer__background {
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(0, 0, 0, .5);
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 200ms;
}
.modal-fade-enter, .modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active {
  transition: transform 200ms ease-in;
}

.modal-slide-leave-active {
  transition: transform 150ms ease-in;
}

.modal-slide-enter, .modal-slide-leave-to {
  transform: translateX(100%);
}

.modal-slide-leave, .modal-slide-enter-to {
  transform: none;
}
</style>
