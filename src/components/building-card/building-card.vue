<template>
  <nuxt-link
    :to="
      localePath({
        name: 'buildings-buildingSlug',
        params: { buildingSlug: building.slug }
      })
    "
    class="building-card"
  >
    <h3
      class="building-card__header"
      :style="`background-image: url('${building.image.url}?&fm=jpg&w=700&auto=quality');`"
    >
      <span class="building-card__name">
        {{ building.name }}
      </span>
    </h3>

    <div class="building-card__meta">
      <ul class="flat-list building-card__seating">
        <li>50 rooms</li>
        <li>1000 seats</li>
      </ul>

      <p class="building-card__status">
        closed <open-icon class="space-card__status-icon" /><closed-icon class="space-card__status-icon" />
      </p>
    </div>
  </nuxt-link>
</template>

<script>
import ClosedIcon from '../../static/icons/location-closed-icon.svg'
import OpenIcon from '../../static/icons/location-open-icon.svg'

export default {
  components: { ClosedIcon, OpenIcon },
  props: {
    building: Object
  }
}
</script>

<style>
@import '../app-core/variables.css';

.building-card {
  display: block;
  padding: var(--spacing-half);
  background: var(--background-color);
  border: 1px solid var(--highlight-color);
  text-decoration: none;
}

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

}
</style>
