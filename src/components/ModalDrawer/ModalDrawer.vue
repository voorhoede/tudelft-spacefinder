<!-- Pattern based on [Material Design: Modal Drawer](https://material.io/design/components/navigation-drawer.html#modal-drawer). -->
<template>
  <div ref="el">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="modal-drawer__background"
        @click="$emit('close')"
      />
    </Transition>

    <Transition name="modal-slide" @after-enter="focusCloseButton">
      <section v-if="isOpen" class="modal-drawer">
        <div class="modal-drawer__header">
          <h2 class="model-drawer__title">
            {{ title }}
          </h2>

          <button
            ref="closeButton"
            type="button"
            class="button button--header"
            @click="$emit('close')"
          >
            <SvgIcon name="close-icon" class="button--header__icon" />

            {{ $t("close") }}
          </button>
        </div>

        <slot />
      </section>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ title: string; isOpen?: boolean }>();
const el = ref(null as null | HTMLDivElement);
const closeButton = ref(null as null | HTMLButtonElement);
// eslint-disable-next-line no-unused-vars
let keydownEventListener = null;
watch(
  () => props.isOpen,
  (value) => {
    if (value) {
      nextTick(() => {
        //TODO: get rid of el?
        const focusableElements = el.value!.querySelectorAll<HTMLElement>(
          'a[href]:not([disabled]), button:not([disabled]), input[type="checkbox"]:not([disabled])'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement =
          focusableElements[focusableElements.length - 1];

        keydownEventListener = el.value!.addEventListener("keydown", (e) => {
          if (e.key === "Tab") {
            if (
              e.shiftKey &&
              document.activeElement === firstFocusableElement
            ) {
              lastFocusableElement.focus();
              e.preventDefault();
            } else if (
              !e.shiftKey &&
              document.activeElement === lastFocusableElement
            ) {
              firstFocusableElement.focus();
              e.preventDefault();
            }
          }
        });
      });
    }
  }
);
onBeforeUnmount(() => {
  keydownEventListener = null; //TODO: y need that?
});

function focusCloseButton() {
  closeButton.value?.focus();
}
</script>

<style>
@import "../app-core/variables.css";

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

.model-drawer__title {
  margin: 0;
  font-size: var(--font-size-big);
}

.modal-drawer__background {
  z-index: var(--layer--popup);
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 200ms;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active {
  transition: transform 200ms ease-in;
}

.modal-slide-leave-active {
  transition: transform 150ms ease-in;
}

.modal-slide-enter-from,
.modal-slide-leave-to {
  transform: translateX(100%);
}

.modal-slide-leave-from,
.modal-slide-enter-to {
  transform: none;
}
</style>
