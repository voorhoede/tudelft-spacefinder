<template>
  <div
    class="space-detail-card"
    :class="{ 'space-detail-card--image': imageUrl }"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      alt=""
      class="space-detail-card__image"
    >

    <div class="space-detail-card__heading">
      <h2 class="space-detail-card__title">
        {{ title }}
      </h2>

      <p class="space-detail-card__description">
        <em>{{ building }}</em> - {{ location }}
      </p>

      <p class="space-detail-card__location">
        {{ floor }}
      </p>
    </div>

    <div class="space-detail-card__meta">
      <space-facilities
        :facilities="facilities"
        class="space-detail-card__facilities"
      />

      <ul class="flat-list space-detail-card__seating">
        <li>
          <seat-icon class="space-detail-card__seating-icon" /> {{ seats }}
        </li>
        <li>
          <table-icon class="space-detail-card__seating-icon" /> {{ tables }}
        </li>
      </ul>

      <div class="space-detail-card__opening-hours">
        <p
          v-if="locationisOpen"
          class="space-detail-card__status space-detail-card__status--open"
        >
          {{ $t('open') }} <open-icon class="space-detail-card__status-icon" />
        </p>
        <p
          v-else
          class="space-detail-card__status"
        >
          {{ $t('closed') }} <closed-icon class="space-detail-card__status-icon" />
        </p>

        <button class="button space-detail-card__toggle">
          [{{ $t('openingHours') }} button]
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ClosedIcon from '../../static/icons/location-closed-icon.svg'
import SeatIcon from '../../static/icons/seat-icon.svg'
import TableIcon from '../../static/icons/table-icon.svg'
import OpenIcon from '../../static/icons/location-open-icon.svg'

import { SpaceFacilities } from '../../components'

export default {
  components: { ClosedIcon, OpenIcon, SeatIcon, SpaceFacilities, TableIcon },
  props: {
    building: String,
    facilities: Object,
    floor: String,
    imageUrl: String,
    location: String,
    locationisOpen: Boolean,
    seats: Number,
    tables: Number,
    title: String,
  },
  computed: {
  },
}
</script>

<style>
@import '../app-core/variables.css';


.space-detail-card {
  --image-width: 100px;

  padding: var(--spacing-default);
  background: var(--background-color);
  box-shadow: var(--shadow-small);
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
    margin: calc(-1 * var(--spacing-default)) calc(-1 * var(--spacing-default)) var(--spacing-half) calc(-1 * var(--spacing-default));
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
  font-size: var(--font-size-default);
  font-weight: 500;
}

.space-detail-card__description {
  font-size: var(--font-size-smaller);
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

@media (min-width: 700px) {
  .space-detail-card--image .space-detail-card__meta,
  .space-detail-card__meta {
    flex-wrap: nowrap;
    margin-left: 0;
  }
}

.space-detail-card__facilities {
  flex: 0 0 100%;
  margin: 0 0 var(--spacing-half) 0;
}

@media (min-width: 700px) {
  .space-detail-card__facilities {
    flex: 1 1 auto;
    margin: 0;
  }
}

.space-detail-card__opening-hours {
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

@media (min-width: 700px) {
  .space-detail-card__opening-hours {
    order: 1;
  }
}

.space-detail-card__status {
  font-size: var(--font-size-smaller);
}

@media (min-width: 700px) {
  .space-detail-card__status {
    position: absolute;
    top: 1.4rem;
    right: var(--spacing-default);
  }

  .space-detail-card--image .space-detail-card__status {
    top: 165px;
  }
}

.space-detail-card__status--open {
  color: var(--brand-secondary-color);
}

.space-detail-card__status-icon {
  width: 11px;
  height: 11px;
  stroke: var(--text-color);
}

.space-detail-card__status--open .space-detail-card__status-icon {
  stroke: var(--brand-secondary-color);
}

.space-detail-card__seating {
  flex: 0 0 auto;
  margin-right: var(--spacing-default);
}

@media (min-width: 700px) {
  .space-detail-card__seating {
    order: 2;
    flex: 0 0 auto;
    margin: -1.5rem 0 0 var(--spacing-default);
  }
}

.space-detail-card__seating li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (min-width: 700px) {
  .space-detail-card__seating li {
    justify-content: flex-end;
  }
}

.space-detail-card__seating-icon {
  margin-right: var(--spacing-half);
  width: 15px;
  height: 15px;
}

.space-detail-card__toggle {
  padding: 0;
  font-size: var(--font-size-smaller);
  text-align: right;
}

@media (min-width: 700px) {
  .space-detail-card__toggle {
    display: none;
  }
}
</style>
