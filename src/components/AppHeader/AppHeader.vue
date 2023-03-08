<template>
  <header role="banner" class="app-header default-layout__header">
    <NuxtLink to="/" class="app-header__logo">
      <img src="~/assets/tu-delft-logo.svg" alt="Home" />
    </NuxtLink>

    <h1 class="app-header__title">
      {{ $t("title") }}
    </h1>

    <button
      ref="filterButton"
      type="button"
      class="app-header__button button button--header"
      @click="$emit('openFilterMenu')"
    >
      <SvgIcon name="filter-icon" class="button--header__icon" />
      {{ $t("filter") }}

      <div v-show="isFiltered" class="app-header__status-indicator" />
    </button>

    <button
      ref="menuButton"
      type="button"
      class="app-header__button button button--header"
      @click="$emit('openAppMenu')"
    >
      <SvgIcon name="menu-icon" class="button--header__icon" />
      {{ $t("menu") }}
    </button>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSpacesStore } from "~/stores/spaces";

const props = defineProps<{ openedMenu: string | null }>();
let lastOpenedMenu: string | null = null;
const spacesStore = useSpacesStore();
const { isFiltered } = storeToRefs(spacesStore);
const menuButton = ref(null as null | HTMLButtonElement);
const filterButton = ref(null as null | HTMLButtonElement);
watch(
  () => props.openedMenu,
  (newValue) => {
    if (lastOpenedMenu === "app-menu") {
      menuButton.value?.focus();
    } else if (lastOpenedMenu === "filter-menu") {
      filterButton.value?.focus();
    }
    lastOpenedMenu = newValue;
  }
);
</script>

<style>
@import "../app-core/variables.css";

.app-header {
  display: flex;
  justify-content: space-between;
  padding: 0 var(--spacing-half) 0 var(--spacing-half);
  height: var(--header-height-mobile);
  background-color: var(--brand-primary-color);
  color: var(--background-color);
}

@media (min-width: 700px) {
  .app-header {
    padding: 0 var(--spacing-default);
    height: var(--header-height-desktop);
  }
}

.app-header__logo {
  margin: 8px 0;
}

.app-header__logo img {
  height: 30px;
}

@media (min-width: 700px) {
  .app-header__logo img {
    height: 40px;
  }
}

.app-header__title {
  flex: 1 1 auto;
  text-align: center;
  line-height: var(--header-height-mobile);
}

@media (min-width: 700px) {
  .app-header__title {
    line-height: var(--header-height-desktop);
  }
}

.app-header__button {
  position: relative;
  justify-self: flex-end;
}

@media (min-width: 700px) {
  .app-header__button:last-of-type {
    margin-left: var(--spacing-half);
  }
}

.app-header__status-indicator {
  position: absolute;
  padding: var(--spacing-quarter);
  top: 3px;
  right: 3px;
  width: 12px;
  height: 12px;
  background-color: var(--brand-secondary-color);
  border-radius: 50%;
}

@media (min-width: 700px) {
  .app-header__status-indicator {
    top: 5px;
    right: 5px;
  }
}
</style>
