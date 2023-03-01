<template>
  <Transition name="pop-up-fade">
    <div v-if="isOpen" class="pop-up">
      <div class="pop-up__background" @click="close" />

      <div class="pop-up__body">
        <div class="pop-up__heading">
          <h1 class="pop-up__title h2">
            {{ title }}
          </h1>

          <button type="button" class="button button--header" @click="close">
            <SvgIcon name="close-icon" class="button--header__icon" />

            {{ $t("close") }}
          </button>
        </div>

        <p>{{ body }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { usePageContent } from "~/stores/pageContent";

const { $locale } = useNuxtApp();
const pageContent = usePageContent();

const title = computed(() => pageContent.onboarding[$locale.value].title);
const body = computed(() => pageContent.onboarding[$locale.value].body);
const hasSeenOnboarding = useLocalStorage("hasSeenOnboarding", false);
const isOpen = ref(false);

onMounted(() => {
  if (!hasSeenOnboarding.value) {
    isOpen.value = true;
    hasSeenOnboarding.value = true;
  }
});

function close() {
  isOpen.value = false;
}
</script>

<style>
@import "../app-core/variables.css";

.pop-up {
  z-index: var(--layer--popup);
  position: absolute;
  display: flex;
  align-content: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.pop-up__background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.pop-up__body {
  position: relative;
  z-index: var(--layer--raised);
  margin: auto;
  padding: var(--spacing-default);
  width: 85%;
  background: var(--background-color);
}

@media (min-width: 800px) {
  .pop-up__body {
    max-width: 680px;
  }
}

.pop-up__heading {
  display: flex;
  justify-content: space-between;
  margin: var(--spacing-default-negative) var(--spacing-default-negative)
    var(--spacing-default) var(--spacing-default-negative);
  padding: 0 var(--spacing-quarter) 0 var(--spacing-default);
  height: var(--header-height-mobile);
  background-color: var(--brand-primary-color);
  line-height: var(--header-height-mobile);
  color: var(--background-color);
}

@media (min-width: 700px) {
  .pop-up__heading {
    padding: 0 var(--spacing-default) 0 1.5rem;
    height: var(--header-height-desktop);
    line-height: var(--header-height-desktop);
  }
}

.pop-up__title {
  margin-top: 0;
}

.pop-up-fade-enter-active,
.pop-up-fade-leave-active {
  transition: opacity 200ms;
}
.pop-up-fade-enter-from,
.pop-up-fade-leave-to {
  opacity: 0;
}
</style>
