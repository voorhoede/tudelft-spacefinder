<template>
  <a
    v-if="useHistory && history.previousPageUrl"
    :href="history.previousPageUrl"
    @click.prevent="history.goBack()"
    class="button button--round"
  >
    <SvgIcon
      name="back-icon"
      class="button--round__icon"
    />
    <span class="a11y-sr-only">{{ $t("back") }}</span>
  </a>

  <NuxtLink
    v-else
    :to="to"
    class="button button--round"
  >
    <SvgIcon
      name="back-icon"
      class="button--round__icon"
    />
    <span class="a11y-sr-only">{{ $t("back") }}</span>
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
