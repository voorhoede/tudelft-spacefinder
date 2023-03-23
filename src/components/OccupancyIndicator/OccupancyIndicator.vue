<template>
  <ClientOnly>
    <div>
      <Tooltip :delay="0" :overflowPadding="4" :instantMove="true">
        <SvgIcon
          :name="`facility-occupancy.${occupancy}-icon`"
          class="occupancy-indicator__icon"
          :alt="$t(`occupancy.${occupancy}`)"
        />
        <template #popper>
          {{ $t("occupancy") }}: {{ $t(`occupancy.${occupancy}`) }}
        </template>
      </Tooltip>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Tooltip } from "floating-vue";
import "floating-vue/dist/style.css";
import type { Occupancy } from "~/types/Filters";

defineProps<{
  totalSeats: number;
  activeDevices: number;
  occupancy: Occupancy;
}>();
</script>

<style>
.occupancy-indicator__icon {
  height: 24px;
  width: 60px;
}
</style>
