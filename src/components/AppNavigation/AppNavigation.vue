<template>
  <nav class="app-navigation">
    <ul class="app-navigation__items flat-list">
      <li 
        v-if="$isMobile.value"
        class="app-navigation__item"
      >
        <NuxtLink
          to="/"
          class="button button--navigation"
        >
          <SvgIcon
            name="map-icon"
            class="button--navigation__icon"
          />

          <span class="app-menu__link-name">
            {{ $t("map") }}
          </span>
        </NuxtLink>
      </li>
      <li class="app-navigation__item">
        <NuxtLink
          :to="$localePath('/buildings')"
          class="button button--navigation"
        >
          <SvgIcon
            name="building-icon"
            class="button--navigation__icon"
          />

          <span class="app-menu__link-name">
            {{ $t("buildings") }}
          </span>
        </NuxtLink>
      </li>
      <li class="app-navigation__item">
        <NuxtLink
          :to="$localePath('/spaces')"
          class="button button--navigation"
        >
          <SvgIcon
            name="list-icon"
            class="button--navigation__icon"
          />

          <span class="app-menu__link-name">
            {{ $t("spaces") }}
          </span>
        </NuxtLink>
      </li>
    </ul>

    <button
      ref="menuButton"
      type="button"
      class="app-menu__filter-button"
      @click="$emit('openFilterMenu')"
    >
      <SvgIcon
        name="filter-icon"
        class="app-menu__filter-button-icon"
      />

      {{ $t("filter") }}

      <div class="app-menu__filter-indicator">
        {{ spacesStore.numberOfSelectedFilters }}

        <span class="a11y-sr-only">
          {{ $t("filtersSelected") }}
        </span>
      </div>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useSpacesStore } from "~/stores/spaces";

const props = defineProps<{ openedMenu: string | null }>();

const spacesStore = useSpacesStore();
const menuButton = ref(null as null | HTMLButtonElement);

let lastOpenedMenu: string | null = null;

watch(
  () => props.openedMenu,
  (newValue) => {    
    if (lastOpenedMenu === "filter-menu") {
      menuButton.value?.focus();
    }
    lastOpenedMenu = newValue;
  }
);
</script>

<style>
@import "../app-core/variables.css";

.app-navigation {
  z-index: var(--layer--overlay);
  position: absolute;
  display: flex;
  justify-content: space-between;
  left: 0;
  bottom: 0;
  padding: 0 var(--spacing-default);
  height: var(--navigation-height-mobile);
  width: 100%;
  background-color: var(--brand-primary-color);
  color: var(--background-color);
}

@media (min-width: 700px) {
  .app-navigation {
    width: var(--column-width-desktop);
    height: var(--navigation-height-desktop);
  }
}

.app-navigation__items {
  display: flex;
  gap: var(--spacing-default-half);
  padding-top: 2px;
  height: 100%;
}

.app-navigation__item {
  display: flex;
  align-items: center;
}

.app-menu__filter-button {
  display: flex;
  align-items: center;
  margin: var(--spacing-half) 0;
  padding-left: var(--spacing-three-quarter);
  padding-right: var(--spacing-quarter);
  background: var(--background-color);
  border: none;
  border-radius: 2rem;
  cursor: pointer;
}

.app-menu__filter-button-icon {
  margin-right: var(--spacing-half);
  width: 16px;
  height: 16px;
}

.app-menu__filter-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: var(--spacing-three-quarter);
  width: 28px;
  height: 28px;
  background: var(--brand-secondary-color);
  border-radius: 50%;
  font-size: var(--font-size-smaller);
  font-weight: bold;
  color: var(--background-color);
}
</style>
