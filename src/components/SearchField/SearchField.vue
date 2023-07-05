<template>
  <form
    @submit.prevent="handleSearch"
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
      v-model="query"
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

const query = ref("");
const isLoading = ref(false);
const flyAway = ref(false);

async function handleSearch() {
  isLoading.value = true;

  const searchFilters = await getSearchFiltersFromQuery();
  applySearchFilters(searchFilters);

  query.value = "";
  isLoading.value = false;
  flyAway.value = true;

  setTimeout(() => {
    flyAway.value = false;
  }, 500);
}

async function getSearchFiltersFromQuery() {
  const searchFilters = (await $fetch("/api/openai", {
    method: "POST",
    body: { query: query.value },
  })) as Partial<Filters>;

  return searchFilters;
}

function applySearchFilters(searchFilters: Partial<Filters>) {
  spacesStore.clearFilters();

  spacesStore.filters = {
    ...spacesStore.defaultFilters,
    ...searchFilters,
  };
}
</script>

<style>
@import "../app-core/variables.css";

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
