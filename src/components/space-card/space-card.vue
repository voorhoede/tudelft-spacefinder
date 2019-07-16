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
        <h3
          v-if="title"
          class="space-card__title">
          {{ title }}
        </h3>
        <p
          v-if="title"
          class="space-card__description"
        >
          {{ faculty }} - {{ location}}
        </p>
        <h3
          v-else
          class="space-card__description"
        >
          {{ faculty }} - {{ location}}
        </h3>
      </div>

      <h4 class="a11y-sr-only">
        {{ $t('seating') }}
      </h4>

      <ul class="flat-list space-card__seating">
        <li>
          <img src="/icons/seat-icon.svg" alt=""> {{ facilities.seats }}
        </li>
        <li>
          <img src="/icons/table-icon.svg" alt=""> {{ facilities.tables }}
        </li>
      </ul>
    </div>

    <div class="space-card__meta">
      <p
        v-if="locationisOpen"
        class="space-card__status space-card__status--open"
      >
        {{ $t('open') }}
      </p>
      <p
        v-else
        class="space-card__status space-card__status--closed"
      >
        {{ $t('closed') }}
      </p>

      <h4 class="a11y-sr-only">
        {{ $t('facilities') }}
      </h4>

      <ul class="flat-list space-card__facilities">
        <li
          v-for="(facility, index) in this.facilities"
          :key="index"
          class="space-card__facility-item"
        >
          <img
            src="/icons/building-3me-icon.svg"
            alt=""
          >
        </li>
      </ul>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    buildingSlug: String,
    locationisOpen: Boolean,
    facilities: Object,
    faculty: String,
    location: String,
    spaceSlug: String,
    title: String,
  },
}
// object.entries()
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

@media (min-width: 700px) {
  .space-card {
    padding: var(--spacing-default);
  }
}

.space-card__info {
  display: flex;
  margin-bottom: var(--spacing-double);
}

.space-card__location {
  flex: 1 1 auto;
  line-height: 1.3;
}

.space-card__title {
  margin-bottom: var(--spacing-quarter);
  font-size: var(--font-size-default);
  font-weight: 500;
}

.space-card__description {
  font-size: var(--font-size-smaller);
}

.space-card__seating {
  flex: 0 0 auto;
  margin-left: var(--spacing-default);
}

.space-card__seating li {
  display: flex;
  justify-content: space-between;
}

.space-card__seating img {
  margin-right: var(--spacing-half);
  width: 15px;
}

.space-card__meta {
  display: flex;
}

.space-card__status {
  flex: 0 0 auto;
  order: 2;
  margin-left: var(--spacing-default);
  font-size: var(--font-size-smaller);
}

.space-card__status::after {
  content: '';
  display: inline-block;
  width: 11px;
  height: 11px;
}

.space-card__status--open {
  color: var(--brand-secondary-color);
}

.space-card__status--open::after {
  background: url('/icons/location-open-icon.svg') center no-repeat;
}

.space-card__status--closed::after {
  background: url('/icons/location-closed-icon.svg') center no-repeat;
}

.space-card__facilities {
  order: 1;
  flex: 1 1 auto;
}

.space-card__facility-item {
  display: inline-block;
}

.space-card__facility-item img {
  width: 25px;
}
</style>
