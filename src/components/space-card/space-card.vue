<template>
  <nuxt-link
    :to="
      localePath({
        name: 'buildings-buildingSlug-spaces-spaceSlug',
        params: { buildingSlug: space.building.slug, spaceSlug: space.slug }
      })
    "
    class="space-card card"
  >
    <div class="space-card__info">
      <div class="space-card__location">
        <h3 v-if="space.name">
          {{ space.name }}
        </h3>
        <p
          v-if="space.name"
          class="space-card__description"
        >
          <em>{{ space.building.abbreviation }}</em> - {{ space.roomId }}
        </p>
        <h3 v-else>
          <em>{{ space.building.abbreviation }}</em> - {{ space.roomId }}
        </h3>
      </div>

      <h4 class="a11y-sr-only">
        {{ $t('seating') }}
      </h4>

      <div class="flat-list space-card__seating">
        <svg-icon name="seat-icon" class="space-card__seating-icon" />
        {{ space.seats }}
      </div>
    </div>

    <div class="space-card__meta">
      <card-status
        :opening-hours="space.openingHours"
        :is-open="locationIsOpen"
        class="space-card__status"
      />

      <h4 class="a11y-sr-only">
        {{ $t('facilities') }}
      </h4>

      <space-facilities
        :facilities="space.facilities"
        class="space-card__facilities"
      />
    </div>
  </nuxt-link>
</template>

<script>
import { CardStatus, SpaceFacilities } from '../../components'

export default {
  components: { CardStatus, SpaceFacilities },
  props: {
    locationIsOpen: Boolean,
    space: {
      required: true,
      type: Object,
    },
  },
}
</script>

<style>
@import '../app-core/variables.css';

@media (min-width: 700px) {
  .space-card {
    padding: var(--spacing-default);
  }
}

.space-card svg {
  fill: var(--text-color);
}

.space-card:hover svg,
.space-card:focus svg {
  fill: var(--brand-primary-color-dark);
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
  font-size: var(--font-size-smaller);
  font-weight: bold;
}

.space-card__seating li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.space-card__seating-icon {
  margin: -2px 1px 0 0;
  width: 18px;
  height: 18px;
  vertical-align: middle;
}

.space-card__meta {
  display: flex;
}

.space-card__status {
  order: 2;
  flex: 0 0 auto;
  margin-top: .1rem;
}

.space-card__facilities {
  order: 1;
  flex: 1 1 auto;
}
</style>
