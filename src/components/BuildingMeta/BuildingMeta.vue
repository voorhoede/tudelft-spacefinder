<template>
  <ul class="flat-list building-meta">
    <li class="building-meta__item">
      <div class="building-meta__item-content">
        <SvgIcon
          name="seat-icon"
          class="building-meta__seating-icon"
        />
        {{ props.seats }} {{ $t('total') }} {{ $t('seats') }}
      </div>
    </li>
    <li class="building-meta__item">
      <SvgIcon
        name="door-icon"
        class="building-meta__seating-icon"
      />
      {{ props.spaces }} {{ $t('spaces') }}
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps<{ seats: number, spaces: number }>();
</script>

<style>
@import "../app-core/variables.css";

.building-meta {
  font-size: var(--font-size-smaller);
  font-weight: bold;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-default);
}

.building-meta__item,
.building-meta__item-content {
  display: flex;
  align-items: center;
  line-height: 1;
}

.building-meta__seating-icon {
  margin-right: var(--spacing-half);
  width: 15px;
  height: 15px;
}
</style>
