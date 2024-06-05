<template>
  <div class="space-card">
    <div class="space-card__info">
      <h3 class="space-card__title">
        {{ space.name }}
      </h3>
      <p class="space-card__description">
        {{ space.building.abbreviation }} | {{ space.roomName }} |
        {{ space.floor }}
      </p>
      <div class="space-card__seating">
        <SvgIcon
          name="seat-icon--micro"
          class="space-card__seating-icon"
        />
        <span>{{ " " }}{{ space.seats }}{{ " " }}</span>
        <span class="space-card__seating-label">
          {{ $t("seats") }}
        </span>
      </div>

      <SpaceFacilities
        :facilities="space.facilities"
        class="space-card__facilities"
      />
    </div>

    <img
      v-if="space.image"
      class="space-card__image"
      :src="`${space.image.url}?&fm=jpg&w=300&auto=quality&auto=format&auto=compress`"
      alt=""
    >
    <div
      v-else
      class="space-card__image space-card__image--placeholder"
    >
      <SvgIcon
        name="flame-icon"
        class="space-card__image-placeholder-icon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SpaceFeatures } from "~/types/Filters";

defineProps<{
  space: {
    name: string;
    roomName: string;
    floor: string;
    seats: number;
    facilities: SpaceFeatures;
    image?: {
      url: string;
    };
    building: {
      abbreviation: string;
    };
  };
}>();
</script>

<style>
.space-card {
  display: flex;
  justify-content: space-between;
  background-color: var(--background-color);
  box-shadow: var(--shadow-small);
}

.space-card__info {
  padding: var(--spacing-default);
}

.space-card__title {
  line-height: 1.2;
  font-weight: 600;
}

.space-card__description {
  margin-bottom: var(--spacing-half);
  font-size: var(--font-size-smaller);
}

.space-card__seating {
  font-weight: bold;
  font-size: var(--font-size-smaller);
  margin-bottom: var(--spacing-quarter);
}

.space-card__seating-icon {
  vertical-align: middle;
  margin-block-start: calc(1ex - 1cap);
  width: 16px;
  height: 16px;
}

.space-card__seating-label {
  font-weight: normal;
}

.space-card__image {
  width: clamp(32%, 30vw, 44%);
  flex-shrink: 0;
  object-fit: cover;
}

.space-card__image--placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--neutral-color);
}

.space-card__image-placeholder-icon {
  width: 30px;
  height: 30px;
}
</style>
