<template>
  <form
    @submit.prevent="chatbot"
    class="search-field__form"
  >
    <label
      for="search-field__input"
      class="a11y-sr-only"
      aria-label="Filter spaces by name or description"
    />
    <input
      id="search-field__input"
      type="text"
      v-model="question"
      class="search-field__input"
      placeholder="I want a coffee, a quiet place to study..."
    >
    <button class="search-field__submit">
      <SvgIcon
        name="send-icon"
        class="search-field__button-icon"
        :class="{
          'search-field__button-icon-animated--rotate': isLoading,
          'search-field__button-icon-animated--fly': !isLoading && flyAway,
        }"
      />
      <span class="a11y-sr-only">
        {{ isLoading ? "Loading" : "Send" }}
      </span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { useSpacesStore } from "~/stores/spaces";
import type { Filters } from "~/types/Filters";

const spacesStore = useSpacesStore();

const question = ref("");
const messages = ref([] as { role: string; content: string }[]);
const answers = ref([] as { role: string; content: string }[]);
const isLoading = ref(false);
const flyAway = ref(false);

async function chatbot() {
  const input = question.value;
  messages.value.push({ role: "You", content: input });
  question.value = "";
  isLoading.value = true;

  const response = (await $fetch("/api/openai", {
    method: "POST",
    body: {
      query: input,
      defaultFilters: spacesStore.defaultFilters,
    },
  })) as any;

  answers.value.push({ role: "Spacefinder", content: response });
  filterChatResult(response);
}

const filterChatResult = (response: Filters) => {
  spacesStore.clearFilters();

  spacesStore.filters = {
    ...spacesStore.defaultFilters,
    ...response,
  };

  isLoading.value = false;
  flyAway.value = true;
  answers.value = [];

  setTimeout(() => {
    flyAway.value = false;
  }, 500);
};
</script>
<style>
@import "../app-core/variables.css";

:root {
  --search-field-loader-size: 5px;
}

.search-field__messages {
  position: absolute;
  bottom: 100%;
  background-color: var(--brand-primary-color);
}

.search-field__form {
  display: flex;
  margin: var(--spacing-default) 0;
  position: relative;
  border-radius: 5px;
  background-color: var(--background-color);
}

.search-field__input {
  all: unset;
  flex-grow: 1;
  width: 100%;
  padding: var(--spacing-half);
  color: var(--text-color);
}

.search-field__submit {
  all: unset;
  margin: 0 var(--spacing-half);
  overflow: hidden;
}

.search-field__button-icon {
  width: 20px;
  height: 20px;
  animation: fly-in-plane 600ms forwards;
}

.search-field__button-icon-animated--rotate {
  animation: rotate-plane 1s infinite forwards;
}

.search-field__button-icon-animated--fly {
  animation: fly-out-plane 600ms forwards;
}

@keyframes rotate-plane {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fly-out-plane {
  to {
    transform: translate(20px, -30px);
  }
}

@keyframes fly-in-plane {
  from {
    transform: translate(-20px, 30px);
  }
}
</style>
