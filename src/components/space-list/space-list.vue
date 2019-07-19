<template>
  <DynamicScroller
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
          item.room.id
        ]"
        :data-index="index"
        class="space-list__item"
      >
          <space-card
            :buildingSlug="item.building.slug"
            :spaceSlug="item.slug"
            :facilities="item.facilities"
            :building="item.building.name"
            :location="item.room.id"
            :title="item.name"
            :seats="item.seats"
            :tables="item.tables"
          />
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
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
.space-list {
  height: 100%;
}
.space-list__item {
  padding-bottom: var(--spacing-default);
}
</style>
