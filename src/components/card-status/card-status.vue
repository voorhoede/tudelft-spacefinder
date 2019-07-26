<template>
  <div>
    <p
      v-if="isOpen"
      class="card-status card-status--open"
    >
      {{ $t('open') }} <open-icon class="card-status__icon" />
    </p>
    <p
      v-else
      class="card-status"
    >
      {{ $t('closed') }} <closed-icon class="card-status__icon" />
    </p>
  </div>
</template>

<script>
import ClosedIcon from '../../static/icons/location-closed-icon.svg'
import OpenIcon from '../../static/icons/location-open-icon.svg'

export default {
  components: { ClosedIcon, OpenIcon },
  props: {
    isOpen: Boolean
  }
}
</script>

<style>
.card-status {
  flex: 0 0 auto;
  margin: .1rem 0 0 var(--spacing-default);
  font-size: var(--font-size-smaller);
}

.card-status--open {
  color: var(--brand-secondary-color);
}

.space-card:hover .card-status--open,
.space-card:focus .card-status--open {
  color: var(--brand-primary-color-dark);
}

.card-status__icon {
  width: 11px;
  height: 11px;
  stroke: var(--text-color);
}

.card-status--open .card-status__icon {
  stroke: var(--brand-secondary-color);
}
</style>
