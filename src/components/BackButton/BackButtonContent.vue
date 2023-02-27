<template>
  <span class="button button--round">
    <SvgIcon name="back-icon" class="button--round__icon" />
    <span class="a11y-sr-only">
      <slot>{{ $t("back") }}</slot>
    </span>
  </span>
</template>
