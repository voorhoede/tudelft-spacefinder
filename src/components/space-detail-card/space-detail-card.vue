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

      <p class="space-detail-card__description">
        <em>{{ space.building.name }}</em> - {{ space.roomId }}
      </p>

      <p class="space-detail-card__location">
        {{ space.floor }}
      </p>
    </div>

    <div class="space-detail-card__meta">
      <space-facilities
        :facilities="space.facilities"
        class="space-detail-card__facilities"
      />

      <div class="flat-list space-detail-card__seating">
        <svg-icon name="seat-icon" class="space-detail-card__seating-icon" />
        {{ space.seats }}
      </div>

      <card-status
        :opening-hours="space.openingHours"
        :is-open="space.locationIsOpen"
        class="space-detail-card__open-status"
      />

      <opening-hours
        :opening-hours="space.openingHours"
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

    display: flex;
    flex-wrap: wrap;
  }
}

@media (min-width: 700px) {
  .space-detail-card {
    padding: 0;
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
    width: calc(100% + 2 * var(--spacing-default));
    height: 150px;
  }
}

.space-detail-card__heading {
  flex: 1 1 100%;
  margin-bottom: var(--spacing-double);
  line-height: 1.5;
}

.space-detail-card--image .space-detail-card__heading {
  margin: 0 0 var(--spacing-double) var(--image-width);
}

@media (min-width: 700px) {
  .space-detail-card__heading {
    flex: 0 0 75%;
    margin: 0 0 var(--spacing-default) 0;
    line-height: 1.7;
  }

  .space-detail-card--image .space-detail-card__heading {
    margin-left: 0;
  }
}

.space-detail-card__title {
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
  font-size: var(--font-size-smaller);
  font-weight: bold;
}

.space-detail-card__meta {
  display: flex;
  flex: 1 1 100%;
  flex-wrap: wrap;
  justify-content: space-between;
}

.space-detail-card--image .space-detail-card__meta {
  margin-left: var(--image-width);
}

.space-detail-card__facilities {
  flex: 1 1 auto;
  margin: 0 0 var(--spacing-half) 0;
}

@media (min-width: 700px) {
  .space-detail-card__facilities {
    flex: 1 1 auto;
  }
}

.space-detail-card__open-status {
  flex: 0 0 100%;
  font-size: var(--font-size-smaller);
  text-align: right;
}

@media (min-width: 700px) {
  .space-detail-card__open-status {
    position: absolute;
    margin-top: .1rem;
    top: var(--spacing-default);
    right: var(--spacing-default);
  }

  .space-detail-card--image .space-detail-card__open-status {
    top: 165px;
  }
}

.space-detail-card__open-status--open {
  color: var(--brand-secondary-color);
}

.space-detail-card__open-status-icon {
  width: 11px;
  height: 11px;
  stroke: var(--text-color);
}

.space-detail-card__open-status--open .space-detail-card__open-status-icon {
  stroke: var(--brand-secondary-color);
}

.space-detail-card__seating {
  flex: 0 0 auto;
  margin-top: 3px;
  font-size: var(--font-size-smaller);
  font-weight: bold;
}

@media (min-width: 700px) {
  .space-detail-card__seating {
    margin-right: 0;
  }
}

.space-detail-card__seating li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.space-detail-card__seating-icon {
  margin: -2px 1px 0 0;
  width: 18px;
  height: 18px;
  vertical-align: middle;
}

.space-detail-card__opening-hours {
  flex: 0 0 100%;
  font-size: var(--font-size-smaller);
}

@media (min-width: 700px) {
  .space-detail-card__opening-hours {
    margin-top: var(--spacing-half);
  }
}
</style>
