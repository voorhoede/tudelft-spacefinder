<template>
  <div>
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
  </div>
</template>

<script>
export default {
  props: {
    openingHours: Array
  },
  computed: {
    isOpen() {
      let isOpen = false

      this.openingHours[0].time.forEach(time => {
        const currentTime = new Date()
        const startTime = new Date(time[0])
        const endTime = new Date(time[1])

        if(currentTime >= startTime && currentTime <= endTime) {
          isOpen = true
        }
      })

      return isOpen
    }
  }
}
</script>

<style>
.card-status {
  margin: .1rem 0 0 var(--spacing-default);
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
