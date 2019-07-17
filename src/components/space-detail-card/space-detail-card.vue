<template>
  <div class="space-detail-card">
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

    <space-facilities
      :facilities="facilities"
      class="space-detail-card__facilities"
    />

    <div class="space-detail-card__meta">
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

        <button>
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
  padding: var(--spacing-default);
  background: var(--background-color);
  box-shadow: var(--shadow-small);
}

@media (min-width: 700px) {
  .space-detail-card {
    padding: 0;
    background: none;
    box-shadow: none;
  }
}

.space-detail-card__heading {
  margin-bottom: var(--spacing-double);
  line-height: 1.5;
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

.space-detail-card__facilities {
  margin-bottom: var(--spacing-half);
}

.space-detail-card__meta {
  display: flex;
  justify-content: space-between;
}

.space-detail-card__opening-hours {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.space-detail-card__status {
  font-size: var(--font-size-smaller);
}

.space-detail-card__status--open {
  color: var(--brand-secondary-color);
}

.space-detail-card__status-icon {
  width: 11px;
  stroke: var(--text-color);
}

.space-detail-card__status--open .space-detail-card__status-icon {
  stroke: var(--brand-secondary-color);
}

.space-detail-card__seating {
  flex: 0 0 auto;
  margin-right: var(--spacing-default);
}

.space-detail-card__seating li {
  display: flex;
  justify-content: space-between;
}

.space-detail-card__seating-icon {
  margin-right: var(--spacing-half);
  width: 15px;
}
</style>
