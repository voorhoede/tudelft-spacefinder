<template>
  <nuxt-link
    :to="
      localePath({
        name: 'buildings-buildingSlug-spaces-spaceSlug',
        params: { buildingSlug: buildingSlug, spaceSlug: spaceSlug }
      })
    "
    class="space-card"
  >
    <div class="space-card__info">
      <div class="space-card__location">
        <h3 v-if="title">
          {{ title }}
        </h3>
        <p
          v-if="title"
          class="space-card__description"
        >
          <em>{{ building }}</em> - {{ location}}
        </p>
        <h3 v-else>
          <em>{{ building }}</em> - {{ location}}
        </h3>
      </div>

      <h4 class="a11y-sr-only">
        {{ $t('seating') }}
      </h4>

      <ul class="flat-list space-card__seating">
        <li>
          <svg-icon name="seat-icon" class="space-card__seating-icon" />
          {{ seats }}
        </li>
        <li>
          <svg-icon name="table-icon" class="space-card__seating-icon" />
          {{ tables }}
        </li>
      </ul>
    </div>

    <div class="space-card__meta">
      <p
        v-if="locationisOpen"
        class="space-card__status space-card__status--open"
      >
        {{ $t('open') }}
        <svg-icon name="location-open-icon" class="space-card__status-icon" />
      </p>
      <p
        v-else
        class="space-card__status"
      >
        {{ $t('closed') }}
        <svg-icon name="location-closed-icon" class="space-card__status-icon" />
      </p>

      <h4 class="a11y-sr-only">
        {{ $t('facilities') }}
      </h4>

      <space-facilities
        :facilities="facilities"
        class="space-card__facilities"
      />
    </div>
  </nuxt-link>
</template>

<script>
import { SpaceFacilities } from '../../components'

export default {
  components: { SpaceFacilities },
  props: {
    buildingSlug: String,
    locationisOpen: Boolean,
    facilities: Object,
    building: String,
    location: String,
    spaceSlug: String,
    title: String,
    seats: Number,
    tables: Number,
  },
}
</script>

<style>
@import '../app-core/variables.css';

.space-card {
  display: block;
  padding: var(--spacing-half);
  background: var(--background-color);
  border: 1px solid var(--highlight-color);
  text-decoration: none;
}

.space-card:hover,
.space-card:focus {
  border: 1px solid var(--brand-primary-color-dark);
}

@media (min-width: 700px) {
  .space-card {
    padding: var(--spacing-default);
  }
}

.space-card svg {
  fill: var(--text-color);
}

.space-card__info {
  display: flex;
  margin-bottom: var(--spacing-default);
}

.space-card__location {
  flex: 1 1 auto;
  line-height: 1.3;
}

.space-card__description {
  font-size: var(--font-size-smaller);
}

.space-card__description em {
  font-weight: bold;
  font-style: normal;
}

.space-card__seating {
  flex: 0 0 auto;
  margin-left: var(--spacing-default);
}

.space-card__seating li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.space-card__seating-icon {
  margin-right: var(--spacing-half);
  width: 15px;
  height: 15px;
}

.space-card:hover .space-card__seating-icon,
.space-card:focus .space-card__seating-icon {
  fill: var(--brand-primary-color-dark);
}

.space-card__meta {
  display: flex;
}

.space-card__status {
  flex: 0 0 auto;
  order: 2;
  margin: .1rem 0 0 var(--spacing-default);
  font-size: var(--font-size-smaller);
}

.space-card__status--open {
  color: var(--brand-secondary-color);
}

.space-card:hover .space-card__status--open,
.space-card:focus .space-card__status--open {
  color: var(--brand-primary-color-dark);
}

.space-card__status-icon {
  width: 11px;
  height: 11px;
  stroke: var(--text-color);
}

.space-card__status--open .space-card__status-icon {
  stroke: var(--brand-secondary-color);
}

.space-card:hover .space-card__status-icon,
.space-card:focus .space-card__status-icon {
  stroke: var(--brand-primary-color-dark);
}

.space-card__facilities {
  order: 1;
  flex: 1 1 auto;
}
</style>
