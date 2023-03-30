<template>
  <ClientOnly>
    <div>
      <Tooltip
        :delay="0"
        :overflow-padding="4"
        :instant-move="true"
      >
        <SvgIcon
          :name="`facility-occupancy.${occupancyKey}-icon`"
          class="occupancy-indicator__icon"
          :alt="$t(`occupancy.${occupancyKey}`)"
        />
        <template #popper>
          {{ $t("occupancy") }}: {{ $t(`occupancy.${occupancyKey}`) }}
        </template>
      </Tooltip>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Tooltip } from "floating-vue";
import "floating-vue/dist/style.css";
import type { Occupancy } from "~/types/Filters";

const props = defineProps<{
  totalSeats: number;
  activeDevices?: number | null | undefined;
  occupancy?: Occupancy | null | undefined;
}>();
const occupancyKey = computed(() => props.occupancy ?? "unknown");
</script>

<style>
.occupancy-indicator__icon {
  height: 24px;
  width: 60px;
}
</style>
