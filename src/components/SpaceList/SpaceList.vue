<template>
  <DynamicScroller
    v-if="spaces.length > 0"
    :items="spaces"
    key-field="slug"
    :min-item-size="114"
    class="space-list"
  >
    <template #default="{ item: space, index, active }">
      <DynamicScrollerItem
        :item="space"
        :active="active"
        :size-dependencies="[space.name, space.building.name, space.slug]"
        :data-index="index"
        class="space-list__item"
      >
        <header
          v-if="index === 0"
          class="space-list__header"
        >
          <h2 v-if="!hideTitle">
            {{ $t("spacesTitle") }}
          </h2>
          <p class="space-list__header-text">
            {{ $t("spacesSubTitle") }}
          </p>
        </header>
        <NuxtLink
          :to="$localePath('/buildings/:buildingSlug/spaces/:spaceSlug', { space })"
          class="space-list__link"
        >
          <SpaceCard
            :space="space"
            :hide-opening-hours="true"
          />
        </NuxtLink>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
  <div
    v-else
    class="space-list__message"
  >
    {{ $t("noFilterResults") }}
  </div>
</template>

<script setup lang="ts">
import type { Space } from "~/types/Space";
// @ts-ignore
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

defineProps<{ spaces: Space[]; hideTitle?: boolean }>();
</script>

<style>
@import "../app-core/variables.css";

.space-list {
  height: calc(100% - var(--navigation-height-mobile));
  padding: var(--spacing-default) var(--spacing-default) 0
    var(--spacing-default);
  -webkit-overflow-scrolling: touch;
}

@media (min-width: 700px) {
  .space-list {
    height: calc(100% - var(--navigation-height-desktop));
  }
}

.space-list__header {
  padding-bottom: var(--spacing-default);
}

.space-list__header-text {
  font-size: var(--font-size-default);
}

.space-list__item {
  padding: 0 .1rem var(--spacing-default) .1rem;
}

.space-list__link {
  text-decoration: none;
}

.space-list__message {
  padding: var(--spacing-default);
  text-align: center;
}
</style>
