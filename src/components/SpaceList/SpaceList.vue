<template>
  <DynamicScroller
    v-if="spaces.length > 0"
    :items="spaces"
    key-field="slug"
    :min-item-size="114"
    class="space-list"
  >
    <template #default="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[item.name, item.building.name, item.slug]"
        :data-index="index"
        class="space-list__item"
      >
        <header
          v-if="index === 0"
          class="space-list__header"
        >
          <h2>{{ $t("spacesTitle") }}</h2>
          <p class="space-list__header-text">
            {{ $t("spacesSubTitle") }}
          </p>
        </header>
        <NuxtLink :to="$localePath('/buildings/:buildingSlug/spaces/:spaceSlug', { space: item })">
          <SpaceCard :space="item" />
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

defineProps<{ spaces: Space[]; showBuildingOccupancy: boolean }>();
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
  padding-bottom: var(--spacing-default);
}

.space-list__message {
  padding: var(--spacing-default);
  text-align: center;
}
</style>
