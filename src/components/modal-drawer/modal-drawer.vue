<template>
  <div>
    <transition name="modal-slide" @after-enter="focusCloseButton">
      <section
        v-if="isOpen"
        class="modal-drawer"
      >
        <div class="modal-drawer__header">
          <h2>{{ title }}</h2>

          <button
            type="button"
            @click="$emit('close')"
            class="button button--header"
            ref="closeButton"
          >
            <svg-icon
              name="close-icon"
              class="button--header__icon"
            />

            {{ $t('close') }}
          </button>
        </div>

        <slot />
      </section>
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
    isOpen: Boolean
  },
  data(){
    return {
      keydownEventListener: null
    }
  },
  watch: {
    isOpen(value) {
      if(value) {
        this.$nextTick(() => {
          const focusableElements = this.$el.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), input[type="checkbox"]:not([disabled])')
          const firstFocusableElement = focusableElements[0]
          const lastFocusableElement = focusableElements[focusableElements.length - 1]

          this.keydownEventListener = this.$el.addEventListener('keydown', (e) => {
            if(e.key === 'Tab') {
              if(e.shiftKey && document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus()
                e.preventDefault()
              } else if(!e.shiftKey && document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus()
                e.preventDefault()
              }
            }
          })
        })
      }
    }
  },
  beforeDestroy() {
    this.keydownEventListener = null
  },
  methods: {
    focusCloseButton() {
      this.$refs.closeButton.focus()
    }
  }
}
</script>

<style>
@import '../app-core/variables.css';

.modal-drawer {
  z-index: var(--layer--popup);
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  bottom: 0;
  width: var(--column-width-mobile);
  background: var(--background-color);
}

@media (min-width: 700px) {
  .modal-drawer {
    width: var(--column-width-desktop);
  }
}

.modal-drawer__header {
  display: flex;
  justify-content: space-between;
  padding: 0 var(--spacing-quarter) 0 var(--spacing-default);
  height: var(--header-height-mobile);
  background-color: var(--brand-primary-color);
  line-height: var(--header-height-mobile);
  color: var(--background-color);
}

@media (min-width: 700px) {
  .modal-drawer__header {
    padding: 0 var(--spacing-default) 0 1.5rem;
    height: var(--header-height-desktop);
    line-height: var(--header-height-desktop);
  }
}

.modal-drawer__background {
  z-index: var(--layer--overlay);
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .5);
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
