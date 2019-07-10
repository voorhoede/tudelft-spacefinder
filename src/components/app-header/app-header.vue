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
      @click="$emit('openFilterMenu')"
      class="app-header__button button"
    >
      <img
        src="/icons/filter-icon.svg"
        alt=""
        class="app-header__button-icon"
      >

      {{ $t('filter') }}
    </button>

    <button
      @click="$emit('openAppMenu')"
      class="app-header__button button"
    >
      <img
        src="/icons/menu-icon.svg"
        alt=""
        class="app-header__button-icon"
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
  height: 50px;
  background-color: var(--brand-primary-color);
  color: var(--background-color);
}

@media (min-width: 700px) {
  .app-header {
    height: 75px;
  }
}

.app-header__logo {
  margin: 8px 0 8px var(--spacing-default);
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
  line-height: 50px;
}

@media (min-width: 700px) {
  .app-header__title {
    line-height: 75px;
  }
}

.app-header__button {
  justify-self: flex-end;
  margin: 5px 0;
  font-size: var(--font-size-small);
  text-transform: uppercase;
  color: var(--background-color);
}

.app-header__button:hover,
.app-header__button:focus {
  border: 1px solid var(--background-color);
}

@media (min-width: 700px) {
  .app-header__button {
    margin: 10px 0;
  }

  .app-header__button:last-of-type {
    margin: 10px var(--spacing-default) 10px var(--spacing-half);
  }
}

.app-header__button-icon {
  display: block;
  margin: 0 auto 3px auto;
  height: 21px;
}

@media (min-width: 700px) {
  .app-header__button-icon {
    height: 25px;
  }
}
</style>
