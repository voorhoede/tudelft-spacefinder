<template>
  <DynamicScroller
    v-if="spaces.length > 0"
    :items="spaces"
    key-field="slug"
    :min-item-size="114"
    class="space-list"
  >
    <template v-slot="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[item.name, item.building.name, item.slug]"
        :data-index="index"
        class="space-list__item"
      >
        <header v-if="index === 0" class="space-list__header">
          <h2>{{ $t("spacesTitle") }}</h2>
          <p class="space-list__header-text">
            {{ $t("spacesSubTitle") }}
          </p>
        </header>
        <SpaceCard
          :space="item"
          :show-building-occupancy="showBuildingOccupancy"
        />
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
  <div v-else class="space-list__message">
    {{ $t("noFilterResults") }}
  </div>
</template>

<script setup lang="ts">
import type { Space } from "~/types/Space";
import type { Room } from "~/types/Room";
// @ts-ignore
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

defineProps<{ spaces: (Space | Room)[]; showBuildingOccupancy: boolean }>();
</script>

<style>
@import "../app-core/variables.css";

.space-list {
  height: 100%;
  padding: var(--spacing-default) var(--spacing-default) 0
    var(--spacing-default);
  -webkit-overflow-scrolling: touch;
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
