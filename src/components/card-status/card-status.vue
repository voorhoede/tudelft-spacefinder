<template>
  <client-only placeholder="...">
    <p
      v-if="isOpen"
      class="card-status card-status--open"
    >
      {{ $t('open') }} <svg-icon name="location-open-icon" class="card-status__icon" />
    </p>
    <p
      v-else
      class="card-status"
    >
      {{ $t('closed') }} <svg-icon name="location-closed-icon" class="card-status__icon" />
    </p>
  </client-only>
</template>

<script>
export default {
  props: {
    openingHours: {
      required: true,
      type: Array,
    },
  },
  computed: {
    isOpen() {
      const indexToday = 0
      const openingHoursToday = this.openingHours[indexToday].time
      const now = new Date()

      return openingHoursToday.some(([startTime, endTime]) => {
        return now >= new Date(startTime) && now <= new Date(endTime)
      })
    },
  },
}
</script>

<style>
.card-status {
  font-size: var(--font-size-smaller);
}

.card-status--open {
  color: var(--brand-secondary-color);
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
