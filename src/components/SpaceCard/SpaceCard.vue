<template>
  <div 
    ref="root"
    class="space-card-container" 
  >
    <div
      v-if="hasAssociatedSpaces"
      class="space-card__top-row"
    >
      <div class="space-card__navigation">
        <button
          class="space-card__nav-button"
          @click="goToPreviousSpace"
          :disabled="currentIndex === 0"
          :aria-label="currentIndex === 0 ? $t('spaceNavigationFirst') : $t('spaceNavigationPrevious')"
        >
          <SvgIcon
            name="back-icon"
            class="space-card__left-icon"
          />
        </button>
        <span class="space-card__location-count">
          {{ currentIndex + 1 }}/{{ associatedSpaces.length }} {{ $t('locations') }}
        </span>
        <button
          class="space-card__nav-button"
          @click="goToNextSpace"
          :disabled="currentIndex === associatedSpaces.length - 1"
          :aria-label="currentIndex === associatedSpaces.length - 1 ? $t('spaceNavigationLast') : $t('spaceNavigationNext')"
        >
          <SvgIcon
            name="back-icon"
            class="space-card__right-icon"
          />
        </button>
      </div>
    </div>
    <div
      class="space-card"
    >
      <div class="space-card__left-column">
        <component
          :is="isHeader ? 'h2' : 'h3'"
          class="space-card__title"
        >
          {{ space.name }}
        </component>

        <p class="space-card__description">
          {{ space.roomName }} | {{ space.floor }}
        </p>

        <div class="space-card__seating">
          <SvgIcon
            name="seat-icon"
            class="space-card__seating-icon"
          />
          <span class="space-card__seating-number">{{ space.seats }}</span>
          <span class="space-card__seating-label">{{ $t('total') }} {{ $t('seats') }}</span>
        </div>

        <SpaceFacilities
          :facilities="space.facilities"
          class="space-card__facilities"
        />
      </div>
      <div class="space-card__right-column">
        <div
          v-if="space.image"
          class="space-card__image"
        >
          <img
            v-if="space.image"
            :src="`${space.image.url}?&fm=jpg&w=300&auto=quality&auto=format&auto=compress`"
            alt=""
          >
        </div>

        <div
          v-else
          class="space-card__image-placeholder"
        >
          <SvgIcon
            name="flame-icon"
            class="space-card__image-placeholder-icon"
          />
        </div>

        <div class="space-card__occupancy-indicator">
          {{ space.building.abbreviation }}

          <OccupancyIndicator
            :active-devices="space.building.activeDevices"
            :total-seats="space.building.totalSeats"
            :occupancy="space.building.occupancy"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { watch } from 'vue';

import type { Space } from "~/types/Space";
import type { AssociatedSpace } from "~/stores/spaces";
const props = defineProps<{
  space: Space,
  isHeader?: boolean,
  associatedSpaces?: AssociatedSpace[]
}>();


const root = ref(null as null | HTMLDivElement);
const router = useRouter();
const { $localePath } = useNuxtApp();

const currentIndex = ref(0);

const hasAssociatedSpaces = computed(() => props.associatedSpaces && props.associatedSpaces.length > 0);

const goToPreviousSpace = () => {
  if (currentIndex.value > 0) {
    const previousSpace = props.associatedSpaces![currentIndex.value - 1];
    router.replace($localePath("/buildings/:buildingSlug/spaces/:spaceSlug", {
      buildingSlug: previousSpace.buildingSlug,
      spaceSlug: previousSpace.spaceSlug,
    }));
    currentIndex.value--;
  }
}

const goToNextSpace = () => {
  if (currentIndex.value < props.associatedSpaces!.length - 1) {
    const nextSpace = props.associatedSpaces![currentIndex.value + 1];
    router.replace($localePath("/buildings/:buildingSlug/spaces/:spaceSlug", {
      buildingSlug: nextSpace.buildingSlug,
      spaceSlug: nextSpace.spaceSlug,
    }));
    currentIndex.value++;
  }
}

watch(
  [() => props.space, () => props.associatedSpaces],
  ([newSpace, newAssociatedSpaces]) => {
    currentIndex.value = newAssociatedSpaces?.findIndex(space => space.spaceSlug === newSpace.slug) ?? 0;
  },
  { immediate: true }
);

defineExpose({
  getClientHeight: () => root.value?.clientHeight,
});
</script>

<style>
@import "../app-core/variables.css";

.space-card {
  display: flex;
  gap: var(--spacing-default);
  padding: var(--spacing-default);
  max-height: 70vh;
  background: var(--background-color);
  box-shadow: var(--shadow-small);
  overflow: auto;
}

@media (min-width: 700px) {
  .space-card {
    padding: var(--spacing-default);
  }
}

.space-card-container {
  position: relative;
}

.space-card__top-row {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  top: -60px;
  margin-bottom: var(--spacing-double);
  background: white;
  padding: var(--spacing-three-quarter) 0;
  box-shadow: var(--shadow-small);
}

.space-card__navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.space-card__nav-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 var(--spacing-half);
}

.space-card__nav-button:disabled {
  cursor: not-allowed;
}

.space-card__left-icon,
.space-card__right-icon {
  width: 22px;
  height: 22px;
  vertical-align: middle;
}

.space-card__right-icon {
  rotate: 180deg;
}

.space-card__location-count {
  font-size: var(--font-size-default);
}

.space-card__left-column {
  flex: 1;
}

.space-card__right-column {
  position: relative;
  flex: 0 0 39%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.space-card__title {
  margin-bottom: var(--spacing-quarter);
  font-size: var(--font-size-default);
  font-weight: bold;
  line-height: 1.1;
  word-break: break-all;
}

.space-card__seating {
  margin-top: -.1rem;
  font-weight: bold;
  white-space: nowrap;
}

.space-card__seating-icon {
  margin: -2px 1px 0 0;
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

.space-card__seating-number {
  margin-left: calc(.5 * var(--spacing-quarter));
  margin-right: var(--spacing-quarter);
}

.space-card__seating-label {
  font-size: var(--font-size-smaller);
  font-weight: normal;
}

.space-card__description {
  margin-bottom: var(--spacing-three-quarter);
  font-size: var(--font-size-medium);
  font-weight: bold;
  line-height: 1.1;
}

.space-card__facilities {
  margin-left: -0.2rem;
}

.space-card__message {
  margin: var(--spacing-default) 0;
  padding: var(--spacing-quarter) var(--spacing-half);
  background-color: var(--neutral-color);
  font-size: var(--font-size-smaller); 
}

.space-card__open-status {
  margin-top: var(--spacing-half);
}

.space-card__open-status--visible {
  margin-bottom: -1.4rem;
}

@media (min-width: 700px) {
  .space-card__open-status {
    margin-bottom: 0;
  }
}

.space-card__image {
  position: absolute;
  height: 100%;
  width: 100%;
}

.space-card__image img {
  position: absolute;
  margin-top: var(--spacing-default-negative);
  width: calc(100% + var(--spacing-default));
  height: calc(100% + var(--spacing-double));
  object-fit: cover;
}

.space-card__image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: var(--spacing-default-negative);
  right: var(--spacing-default-negative);
  width: calc(100% + var(--spacing-default));
  height: calc(100% + var(--spacing-double));
  background: var(--neutral-color);
}

.space-card__image-placeholder-icon {
  width: 30px;
  height: 30px;
}

.space-card__occupancy-indicator {
  position: relative;
  z-index: var(--layer--raised);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-half);
  margin-left: var(--spacing-default);
  padding: .3rem var(--spacing-three-quarter);
  border-radius: 2rem;
  background: var(--background-color);
  font-size: var(--font-size-smaller);
  font-weight: bold;
  line-height: 1;
  word-break: break-all;
}

.space-card svg {
  fill: var(--text-color);
}

.space-card__occupancy-indicator svg {
  margin-top: .3rem;
}
</style>
