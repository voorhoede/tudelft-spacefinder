<template>
  <div
    class="search-field__loading"
    v-if="isLoading"
  >
    <div class="search-field__dot" />
    <div class="search-field__dot" />
    <div class="search-field__dot" />
  </div>

  <span v-if="answers.length"> Filters are updated </span>
  <form
    @submit.prevent="chatbot"
    class="search-field__form"
  >
    <input
      type="question"
      v-model="question"
      class="search-field__input"
      placeholder="I want a coffee, a quiet place to study..."
    >
    <button class="search-field__submit">
      <SvgIcon
        name="send-icon"
        class="button--navigation__icon"
      />
    </button>
  </form>
</template>

<script setup lang="ts">
import { useSpacesStore } from "~/stores/spaces";
const spacesStore = useSpacesStore();

const question = ref("");
const messages = ref([] as { role: string; content: string }[]);
const answers = ref([] as { role: string; content: string }[]);
const isLoading = ref(false);

async function chatbot() {
  const input = question.value;
  messages.value.push({ role: "You", content: input });
  question.value = "";
  isLoading.value = true;

  const response = (await $fetch("/api/openai", {
    method: "POST",
    body: { query: input },
  })) as any;
  answers.value.push({ role: "Spacefinder", content: response });
  filterChatResult(response);
}

const filterChatResult = (response: {}) => {
  spacesStore.clearFilters();

  spacesStore.filters = {
    ...spacesStore.defaultFilters,
    ...response,
  };
  isLoading.value = false;

  answers.value = [];
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
  }

  .search-field__loading {
    display: flex;
    position: relative;
    gap: 5px;
    align-items: center;
    margin: var(--spacing-default) auto;
  }

  .search-field__dot {
    width: var(--search-field-loader-size);
    height: var(--search-field-loader-size);
    border-radius: var(--search-field-loader-size);
    background-color: white;
  }

  .search-field__dot:nth-of-type(1) {
    animation: bounce-loading 1s infinite forwards;
  }

  .search-field__dot:nth-of-type(2) {
    animation: bounce-loading 1s infinite forwards;
    animation-delay: 200ms;
  }

  .search-field__dot:nth-of-type(3) {
    animation: bounce-loading 1s infinite forwards;
    animation-delay: 300ms;
  }

  @keyframes bounce-loading {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  @keyframes bounce-loading-inverted {
    0% {
      transform: translateY(8px);
    }
    50% {
      transform: translateY(-8px);
    }
    100% {
      transform: translateY(8px);
    }
  }
</style>
