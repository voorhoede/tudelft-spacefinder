<template>
  <header
    role="banner"
    class="app-header default-layout__header"
  >
    <NuxtLink
      to="/"
      class="app-header__logo"
    >
      <img
        src="~/assets/tu-delft-logo.svg"
        :alt="$t('home')"
      >

      <h1 class="app-header__logo-text">
        {{ $t("title") }}
      </h1>
    </NuxtLink>

    <button
      ref="menuButton"
      type="button"
      class="button button--navigation button--spacing"
      @click="$emit('openAppMenu')"
    >
      <SvgIcon
        name="menu-icon"
        class="button--navigation__icon"
      />
      {{ $t("menu") }}
    </button>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{ openedMenu: string | null }>();
let lastOpenedMenu: string | null = null;
const menuButton = ref(null as null | HTMLButtonElement);
watch(
  () => props.openedMenu,
  (newValue) => {
    if (lastOpenedMenu === "app-menu") {
      menuButton.value?.focus();
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
  padding: 0 var(--spacing-half) 0 var(--spacing-default);
  height: var(--header-height-mobile);
  background-color: var(--brand-primary-color);
}

@media (min-width: 700px) {
  .app-header {
    padding: 0 var(--spacing-default);
    height: var(--header-height-desktop);
  }
}

.app-header__logo {
  display: flex;
  margin: 8px 0;
  text-decoration: none;
  color: var(--background-color);
}

.app-header__logo img {
  height: 25px;
}

@media (min-width: 700px) {
  .app-header__logo img {
    height: 31px;
  }
}

.app-header__logo-text {
  position: relative;
  margin: 8px 0 0 var(--spacing-half);
  padding-left: var(--spacing-half);
  font-size: var(--font-size-default);
}

.app-header__logo-text::before {
  content: '';
  position: absolute;
  left: 0px;
  top: 5px;
  width: 1px;
  height: 13px;
  background: var(--background-color);
}

@media (min-width: 700px) {
  .app-header__logo-text {
    top: 0;
    margin-left: calc(.75 * var(--spacing-default));
    padding-left: calc(.75 * var(--spacing-default));
    font-size: var(--font-size-bigger);
  }

  .app-header__logo-text::before {
    top: 7px;
    height: 17px;
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
