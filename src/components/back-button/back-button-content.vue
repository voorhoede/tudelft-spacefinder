<template>
  <span class="button button--round">
    <svg-icon
      name="back-icon"
      class="button--round__icon"
    />
    <span class="a11y-sr-only">
      <slot>{{ $t('back') }}</slot>
    </span>
  </span>
</template>
