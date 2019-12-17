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
        :size-dependencies="[
          item.name,
          item.building.name,
          item.slug
        ]"
        :data-index="index"
        class="space-list__item"
      >
        <header class="space-list__header" v-if="index === 0">
          <h2>{{ $t('spacesTitle')}}</h2>
          <p>{{ $t('spacesSubTitle')}}</p>
        </header>
        <space-card :space="item" />
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
  <div
    v-else
    class="space-list__message"
  >
    {{ $t('noFilterResults') }}
  </div>
</template>

<script>
import SpaceCard from '../space-card'

export default {
  components: { SpaceCard },
  props: {
    spaces: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style>
@import '../app-core/variables.css';

.space-list {
  height: 100%;
  padding: var(--spacing-default) var(--spacing-default) 0 var(--spacing-default);
  -webkit-overflow-scrolling: touch;
}

.space-list__header {
  padding-bottom: var(--spacing-default);
}

.space-list__item {
  padding-bottom: var(--spacing-default);
}

.space-list__message {
  padding: var(--spacing-default);
  text-align: center;
}
</style>
