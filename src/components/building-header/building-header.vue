<template>
  <div class="building-header">
    <building-image
      :building="building"
    />

    <h3 class="a11y-sr-only">
      {{ $t('seating') }}
    </h3>

    <div class="building-header__meta">
      <ul class="flat-list building-header__seating">
        <li>
          <svg-icon name="seat-icon" class="building-header__seating-icon" />
          1000
        </li>
        <li>
          <svg-icon name="door-icon" class="building-header__seating-icon" />
          50
        </li>
      </ul>

      <div class="building-header__opening-hours">
        <card-status
          :isOpen="building.isOpen"
          class="building-header__status"
        />

        <button class="building-header__toggle button">
          [{{ $t('openingHours') }} button]
        </button>
      </div>
    </div>
  </div>
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

.building-header__seating {
  font-size: var(--font-size-smaller);
  font-weight: bold;
}

.building-header__meta {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-default);
}

.building-header__seating li {
  display: flex;
  align-items: center;
}

.building-header__seating-icon {
  margin-right: var(--spacing-half);
  width: 15px;
  height: 15px;
}

.building-header__opening-hours {
  font-size: var(--font-size-smaller);
  text-align: right;
}
</style>
