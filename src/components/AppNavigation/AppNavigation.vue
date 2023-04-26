<template>
  <nav class="app-navigation">
    <ul class="app-navigation__items flat-list">
      <li class="app-navigation__item">
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
      <li
        v-if="$isMobile.value"
        class="app-navigation__item"
      >
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
    </ul>

    <button
      ref="menuButton"
      type="button"
      @click="$emit('openFilterMenu')"
    >
      [FILTER]
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{ openedMenu: string | null }>();
let lastOpenedMenu: string | null = null;
const menuButton = ref(null as null | HTMLButtonElement);
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
</style>
