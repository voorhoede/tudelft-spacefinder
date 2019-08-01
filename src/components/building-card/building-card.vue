<template>
  <nuxt-link
    :to="
      localePath({
        name: 'buildings-buildingSlug',
        params: { buildingSlug: building.slug }
      })
    "
    class="building-card card"
  >
    <building-image
      :building="building"
      class="building-card__image"
    />

    <div class="building-card__meta">
      <ul class="flat-list building-card__seating">
        <li>50 locations</li>
        <li>1000 seats</li>
      </ul>

      <card-status class="building-card__status" />
    </div>
  </nuxt-link>
</template>

<script>
import { BuildingImage, CardStatus } from '../../components'

export default {
  components: { BuildingImage, CardStatus },
  props: {
    building: Object
  }
}
</script>

<style>
@import '../app-core/variables.css';

.building-card__image {
  margin: var(--spacing-half-negative) var(--spacing-half-negative) var(--spacing-half) var(--spacing-half-negative);
}

.building-card__meta {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-smaller);
}

.building-card__seating {
  display: flex;
}

.building-card__seating li:not(:last-child):after {
  content: '|';
  display: inline-block;
  margin: 0 var(--spacing-quarter);
}

.building-card__status {
  flex: 0 0 auto;
}
</style>
