<template>
  <div
    class="space-detail-card"
    :class="{ 'space-detail-card--image': space.imageUrl }"
  >
    <img
      v-if="space.imageUrl"
      :src="space.imageUrl"
      alt=""
      class="space-detail-card__image"
    >

    <div class="space-detail-card__heading">
      <h2 class="space-detail-card__title">
        {{ space.name }}
      </h2>

      <div class="space-detail-card__info">
        <div class="space-detail-card__location">
          <p class="space-detail-card__description">
            <em>{{ space.building.name }}</em> - {{ space.roomId }}
          </p>

          <p>{{ space.floor }}</p>
        </div>

        <card-status
          :opening-hours="space.openingHours"
          :is-open="space.locationIsOpen"
          class="space-detail-card__open-status"
        />
      </div>
    </div>

    <div class="space-detail-card__meta">
      <space-facilities
        :facilities="space.facilities"
        class="space-detail-card__facilities"
      />

      <div class="flat-list space-detail-card__seating">
        <svg-icon name="seat-icon" class="space-detail-card__seating-icon" />
        {{ space.seats }} {{ $t('seatsDescription') }}
      </div>

      <opening-hours
        :opening-hours-building="building.openingHours"
        :opening-hours-space="space.openingHours"
        :show-toggle-on-desktop="false"
        class="space-detail-card__opening-hours"
      />
    </div>
  </div>
</template>

<script>

import { CardStatus, OpeningHours, SpaceFacilities } from '../../components'

export default {
  components: { CardStatus, OpeningHours, SpaceFacilities },
  props: {
    building: {
      required: true,
      type: Object,
    },
    space: {
      required: true,
      type: Object,
    },
  },
}
</script>

<style>
@import '../app-core/variables.css';

.space-detail-card {
  --image-width: 100px;

  padding: var(--spacing-default);
  max-height: 70vh;
  background: var(--background-color);
  box-shadow: var(--shadow-small);
  overflow: auto;
}

@media (min-width: 400px) {
  .space-detail-card {
    --image-width: 120px;
  }
}

@media (min-width: 700px) {
  .space-detail-card {
    margin: var(--spacing-default-negative);
    padding: var(--spacing-default);
    background: none;
    box-shadow: none;
  }
}

.space-detail-card svg {
  fill: var(--text-color);
}

.space-detail-card__image {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--image-width);
  height: 100%;
  object-fit: cover;
}

@media (min-width: 700px) {
  .space-detail-card__image {
    position: relative;
    margin: var(--spacing-default-negative) var(--spacing-default-negative) var(--spacing-half) var(--spacing-default-negative);
    width: calc(100% + var(--spacing-double));
    height: 150px;
  }
}

.space-detail-card__heading {
  margin-bottom: var(--spacing-default);
  line-height: 1.5;
}

.space-detail-card--image .space-detail-card__heading {
  margin: 0 0 var(--spacing-default) var(--image-width);
}

@media (min-width: 700px) {
  .space-detail-card__heading {
    margin: 0 0 var(--spacing-default) 0;
    line-height: 1.7;
  }

  .space-detail-card--image .space-detail-card__heading {
    margin-left: 0;
  }
}

.space-detail-card__info {
  display: flex;
}

.space-detail-card__title {
  margin-bottom: 0;
  line-height: 1.3;
  font-size: var(--font-size-default);
  font-weight: 500;
}

.space-detail-card__description {
  margin-top: var(--spacing-quarter);
  font-size: var(--font-size-smaller);
  line-height: 1.3;
}

.space-detail-card__description em {
  font-style: normal;
  font-weight: bold;
}

.space-detail-card__location {
  flex: 1 1 auto;
  font-size: var(--font-size-smaller);
  font-weight: bold;
}

.space-detail-card--image .space-detail-card__meta {
  margin-left: var(--image-width);
}

@media (min-width: 700px) {
  .space-detail-card--image .space-detail-card__meta {
    margin-left: 0;
  }
}

.space-detail-card__facilities {
  margin-left: -.2rem;
}

.space-detail-card__open-status {
  flex: 0 0 auto;
  font-size: var(--font-size-smaller);
  text-align: right;
}

.space-detail-card__seating {
  margin-bottom: var(--spacing-default);
  font-size: var(--font-size-smaller);
}

@media (min-width: 700px) {
  .space-detail-card__seating {
    margin-bottom: var(--spacing-double);
  }
}

.space-detail-card__seating-icon {
  margin: -2px 1px 0 0;
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

.space-detail-card__opening-hours {
  font-size: var(--font-size-smaller);
  text-align: left;
}

.space-detail-card__opening-hours .opening-hours__toggle {
  margin: 0 0 0 var(--spacing-half-negative);
}

@media (min-width: 700px) {
  .space-detail-card__opening-hours {
    margin-top: var(--spacing-half);
  }
}
</style>
