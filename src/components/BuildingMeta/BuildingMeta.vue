<template>
  <ul class="flat-list building-meta">
    <li>
      <SvgIcon
        name="seat-icon"
        class="building-meta__icon"
      />
      <span>{{ " " }}{{ props.seats }} {{ $t("seats") }}</span>
    </li>
    <li>
      <SvgIcon
        name="door-icon"
        class="building-meta__icon"
      />
      <span>{{ " " }}{{ props.spaces }} {{ $t("spaces") }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps<{ seats: number; spaces: number }>();
</script>

<style>
.building-meta {
  font-size: var(--font-size-smaller);
  font-weight: bold;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-default);
}

.building-meta__icon {
  vertical-align: middle;
  margin-block-start: calc(1ex - 1cap);
  width: 16px;
  height: 16px;
}
</style>
