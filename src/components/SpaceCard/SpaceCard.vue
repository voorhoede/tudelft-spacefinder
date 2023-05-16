<template>
  <div 
    ref="root"
    class="space-detail-card-container" 
  >
    <div
      v-if="hasAssociatedSpaces"
      class="space-detail-card__top-row"
    >
      <div class="space-detail-card__navigation">
        <button
          class="space-detail-card__nav-button"
          @click="goToPreviousSpace"
          :disabled="currentIndex === 0"
          :aria-label="currentIndex === 0 ? 'This is the first location' : 'Go to previous location'"
        >
          <SvgIcon
            name="back-icon"
            class="space-detail-card__left-icon"
          />
        </button>
        <span class="space-detail-card__location-count">
          {{ currentIndex + 1 }}/{{ associatedSpaces.length }} {{ $t('locations') }}
        </span>
        <button
          class="space-detail-card__nav-button"
          @click="goToNextSpace"
          :disabled="currentIndex === associatedSpaces.length - 1"
          :aria-label="currentIndex === associatedSpaces.length - 1 ? 'This is the last location' : 'Go to next location'"
        >
          <SvgIcon
            name="back-icon"
            class="space-detail-card__right-icon"
          />
        </button>
      </div>
    </div>
    <div
      class="space-detail-card"
    >
      <div class="space-detail-card__left-column">
        <div class="space-detail-card__header">
          <h2 class="space-detail-card__title">
            {{ space.name }}
          </h2>

          <div class="space-detail-card__seating">
            <Tooltip
              :delay="0"
              :overflow-padding="4"
              :instant-move="true"
            >
              <div>
                <SvgIcon
                  name="seat-icon"
                  class="space-detail-card__seating-icon"
                />
                {{ space.seats }}
              </div>
              <template #popper>
                {{ $t('capacity') }}: {{ space.seats }} {{ $t('seats') }}
              </template>
            </Tooltip>
          </div>
        </div>

        <p class="space-detail-card__description">
          {{ space.roomId }} | {{ space.floor }}
        </p>

        <SpaceFacilities
          :facilities="space.facilities"
          class="space-detail-card__facilities"
        />

        <CardStatus
          :opening-hours="space.openingHours"
          class="space-detail-card__open-status"
          :class="{ 'space-detail-card__open-status--visible': !hideOpeningHours }"
        />

        <OpeningHours
          v-if="!hideOpeningHours"
          :opening-hours-building="space.building.openingHours"
          :opening-hours-space="space.openingHours"
          :show-toggle-on-desktop="false"
        />
      </div>
      <div class="space-detail-card__right-column">
        <div
          v-if="space.image"
          class="space-detail-card__image"
        >
          <img
            v-if="space.image"
            :src="`${space.image.url}?&fm=jpg&w=300&auto=quality&auto=format&auto=compress`"
            alt=""
          >
        </div>

        <div
          v-else
          class="space-detail-card__image-placeholder"
        >
          <SvgIcon
            name="flame-icon"
            class="space-detail-card__image-placeholder-icon"
          />
        </div>

        <div class="space-detail-card__occupancy-indicator">
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
import { Tooltip } from "floating-vue";
import { useRouter } from 'vue-router';
import { watch } from 'vue';

import type { Space } from "~/types/Space";
import type { AssociatedSpace } from "~/stores/spaces";
const props = defineProps<{
  space: Space,
  hideOpeningHours?: boolean,
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
    router.push($localePath("/buildings/:buildingSlug/spaces/:spaceSlug", {
      buildingSlug: previousSpace.buildingSlug,
      spaceSlug: previousSpace.spaceSlug,
    }));
    currentIndex.value--;
  }
}

const goToNextSpace = () => {
  if (currentIndex.value < props.associatedSpaces!.length - 1) {
    const nextSpace = props.associatedSpaces![currentIndex.value + 1];
    router.push($localePath("/buildings/:buildingSlug/spaces/:spaceSlug", {
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

.space-detail-card {
  display: flex;
  gap: var(--spacing-default);
  padding: var(--spacing-default);
  max-height: 70vh;
  background: var(--background-color);
  box-shadow: var(--shadow-small);
  overflow: auto;
}

@media (min-width: 700px) {
  .space-detail-card {
    padding: var(--spacing-default);
  }
}

.space-detail-card-container {
  position: relative;
}

.space-detail-card__top-row {
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

.space-detail-card__navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.space-detail-card__nav-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 var(--spacing-half);
}

.space-detail-card__nav-button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.space-detail-card__left-icon,
.space-detail-card__right-icon {
  width: 22px;
  height: 22px;
  vertical-align: middle;
}

.space-detail-card__right-icon {
  rotate: 180deg;
}

.space-detail-card__location-count {
  font-size: var(--font-size-default);
}

.space-detail-card__left-column {
  flex: 1;
}

.space-detail-card__right-column {
  position: relative;
  flex: 0 0 39%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.space-detail-card__header {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-half);
  font-weight: bold;
}

.space-detail-card__title {
  margin-bottom: var(--spacing-quarter);
  font-size: var(--font-size-default);
  font-weight: bold;
  line-height: 1.1;
  word-break: break-all;
}

.space-detail-card__seating {
  margin-top: -.1rem;
  white-space: nowrap;
}

.space-detail-card__seating-icon {
  margin: -2px 1px 0 0;
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

.space-detail-card__description {
  margin-bottom: var(--spacing-three-quarter);
  font-size: var(--font-size-medium);
  font-weight: bold;
  line-height: 1.1;
}

.space-detail-card__facilities {
  margin-left: -0.2rem;
}

.space-detail-card__open-status {
  margin-top: var(--spacing-half);
}

.space-detail-card__open-status--visible {
  margin-bottom: -1.4rem;
}

@media (min-width: 700px) {
  .space-detail-card__open-status {
    margin-bottom: 0;
  }
}

.space-detail-card__image {
  position: absolute;
  height: 100%;
  width: 100%;
}

.space-detail-card__image img {
  position: absolute;
  margin-top: var(--spacing-default-negative);
  width: calc(100% + var(--spacing-default));
  height: calc(100% + var(--spacing-double));
  object-fit: cover;
}

.space-detail-card__image-placeholder {
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

.space-detail-card__image-placeholder-icon {
  width: 30px;
  height: 30px;
}

.space-detail-card__occupancy-indicator {
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

.space-detail-card svg {
  fill: var(--text-color);
}

.space-detail-card__occupancy-indicator svg {
  margin-top: .3rem;
}
</style>
