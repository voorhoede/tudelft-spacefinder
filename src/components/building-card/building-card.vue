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
    <h3
      class="building-card__header"
      :style="`background-image: url('${building.image.url}?&fm=jpg&w=700&h=260&fit=crop&auto=quality&auto=format&auto=compress');`"
    >
      <span class="building-card__name">
        {{ building.name }}
      </span>
    </h3>

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
import { CardStatus } from '../../components'

import ClosedIcon from '../../static/icons/location-closed-icon.svg'
import OpenIcon from '../../static/icons/location-open-icon.svg'

export default {
  components: { CardStatus, ClosedIcon, OpenIcon },
  props: {
    building: Object
  }
}
</script>

<style>
@import '../app-core/variables.css';

.building-card__header {
  position: relative;
  margin: calc(-1 * var(--spacing-half)) calc(-1 * var(--spacing-half)) var(--spacing-half) calc(-1 * var(--spacing-half));
  padding: var(--spacing-half);
  min-height: 120px;
  background-size: cover;
  background-position: center;
}

.building-card__header:after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .3);
}

.building-card__name {
  z-index: var(--layer--raised);
  position: absolute;
  left: var(--spacing-half);
  bottom: var(--spacing-half);
  width: calc(100% - var(--spacing-default));
  font-family: var(--font-heading);
  font-size: var(--font-size-big);
  font-weight: 300;
  line-height: 1.2;
  color: var(--background-color);
  text-shadow: 1px 1px 2px var(--text-color);
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
