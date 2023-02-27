<template>
  <a
    v-if="useHistory && history.previousPageUrl"
    :href="history.previousPageUrl"
    class="back-button"
    @click.prevent="history.goBack()"
  >
    <BackButtonContent>
      <slot />
    </BackButtonContent>
  </a>

  <NuxtLink v-else :to="to" class="back-button">
    <BackButtonContent>
      <slot />
    </BackButtonContent>
  </NuxtLink>
</template>

<script setup lang="ts">
import { useHistoryStore } from "~/stores/history";

export interface Props {
  to: string;
  useHistory?: boolean;
}

withDefaults(defineProps<Props>(), {
  useHistory: true,
});

const history = useHistoryStore();
</script>

<style>
@import "../app-core/variables.css";

.back-button {
  z-index: var(--layer--popup);
  position: fixed;
  top: calc(var(--header-height-mobile) + var(--spacing-default));
  left: var(--spacing-default);
}

@media (min-width: 700px) {
  .back-button {
    top: calc(var(--header-height-desktop) + var(--spacing-default));
    left: calc(var(--column-width-desktop) + var(--spacing-default));
  }
}
</style>
