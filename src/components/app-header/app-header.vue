<template>
  <header
    role="banner"
    class="app-header"
  >
    <a
      href="/"
      class="app-header__logo"
    >
      <img
        src="/tu-delft-logo.svg"
        alt="Home"
      >
    </a>

    <h1 class="app-header__title">
      {{ $t('title') }}
    </h1>

    <button
      type="button"
      @click="$emit('openFilterMenu')"
      class="app-header__button button button--header"
    >
      <img
        src="/icons/filter-icon.svg"
        alt=""
        class="button--header__icon"
      >

      {{ $t('filter') }}
    </button>

    <button
      type="button"
      @click="$emit('openAppMenu')"
      class="app-header__button button button--header"
    >
      <img
        src="/icons/menu-icon.svg"
        alt=""
        class="button--header__icon"
      >

      {{ $t('menu') }}
    </button>
  </header>
</template>

<style>
@import '../app-core/variables.css';

.app-header {
  display: flex;
  justify-content: space-between;
  padding: 0 var(--spacing-default);
  height: var(--header-height-mobile);
  background-color: var(--brand-primary-color);
  color: var(--background-color);
}

@media (min-width: 700px) {
  .app-header {
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
  margin: 0;
  font-size: var(--font-size-big);
  text-align: center;
  line-height: var(--header-height-mobile);
}

@media (min-width: 700px) {
  .app-header__title {
    line-height: var(--header-height-desktop);
  }
}

.app-header__button {
  justify-self: flex-end;
}

@media (min-width: 700px) {
  .app-header__button:last-of-type {
    margin-left: var(--spacing-half);
  }
}
</style>
