<template>
  <div class="building-image">
    <component
      :is="isHeader ? 'h3' : 'h2'"
      class="building-image__title"
      :style="`background-image: url('${building.image.url}?&fm=jpg&w=700&h=150&fit=crop&auto=quality&auto=format&auto=compress');`"
    >
      <span class="building-image__name">
        {{ building.name }} ({{ building.abbreviation }})
      </span>
    </component>
  </div>
</template>

<script setup lang="ts">
import type { Building } from "~/types/Building";

defineProps<{ building: Building, isHeader?: boolean }>();
</script>

<style>
@import "../app-core/variables.css";

.building-image__title {
  position: relative;
  margin-bottom: 0;
  height: 150px;
  background-size: cover;
  background-position: center;
}

.building-image__title:after {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.building-image__name {
  z-index: var(--layer--raised);
  position: absolute;
  left: var(--spacing-half);
  bottom: var(--spacing-half);
  width: calc(100% - var(--spacing-default));
  font-family: var(--font-heading);
  font-size: var(--font-size-big);
  font-weight: 300;
  line-height: 1.2;
  color: var(--background-color);
  text-shadow: 1px 1px 2px var(--text-color);
}
</style>
