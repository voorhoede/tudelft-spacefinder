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
          item.roomId
        ]"
        :data-index="index"
        class="space-list__item"
      >
          <space-card
            :buildingSlug="item.building.slug"
            :spaceSlug="item.slug"
            :facilities="item.facilities"
            :building="item.building.abbreviation"
            :location="item.roomId"
            :title="item.name"
            :seats="item.seats"
            :tables="item.tables"
          />
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
      required: true,
    }
  }
}
</script>

<style>
@import '../app-core/variables.css';

.space-list {
  height: 100%;
  padding: var(--spacing-default);
}

.space-list__item {
  padding-bottom: var(--spacing-default);
}

.space-list__message {
  padding: var(--spacing-default);
  text-align: center;
}
</style>
