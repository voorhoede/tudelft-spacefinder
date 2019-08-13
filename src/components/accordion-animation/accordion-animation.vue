<template>
  <transition
    name="accordion"
    @enter="onAccordionEnter"
    @after-enter="onAccordionAfterEnter"
    @leave="onAccordionLeave"
  >
    <slot></slot>
  </transition>
</template>

<script>
  export default {
    methods: {
      onAccordionEnter(element) {
        const width = getComputedStyle(element).width

        // Let the element have its correct height
        // by rendering it, but set the visibility on hidden
        // to make sure it doesn't flicker.
        element.style.width = width
        element.style.position = 'absolute'
        element.style.visibility = 'hidden'
        element.style.height = 'auto'
        const height = getComputedStyle(element).height
        element.style.width = null
        element.style.position = null
        element.style.visibility = null
        element.style.height = 0

        // Force repaint to make sure the
        // animation is triggered correctly.
        getComputedStyle(element).height

        // Trigger the animation.
        // We use `nextTick` because we need
        // to make sure Vue has finished
        // processing after setting the `height`
        // to `0` in the line above.
        this.$nextTick(() => {
          element.style.height = height
        })
      },
      onAccordionAfterEnter(element) {
        const parent = element.parentElement
        element.style.height = 'auto'
        this.$el.scrollTo({
          top: parent.offsetTop,
          left: 0,
          behavior: 'smooth'
        })
      },
      onAccordionLeave(element) {
        const height = getComputedStyle(element).height
        element.style.height = height

        // Force repaint to make sure the
        // animation is triggered correctly.
        getComputedStyle(element).height
        this.$nextTick(() => {
          element.style.height = 0
        })
      }
    }
  }
</script>

<style>
.accordion-enter-active, .accordion-leave-active {
  overflow: hidden;
  transition: height 300ms;
}
</style>
