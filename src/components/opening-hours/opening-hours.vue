<template>
  <div class="opening-hours">
    <button
      v-if="isMobile || showToggleOnDesktop"
      @click="toggleOpeningHours"
      :aria-label="openingHoursAreVisible ? $t('hideOpeningHours') : $t('showOpeningHours')"
      class="opening-hours__toggle button"
      :class="{ 'opening-hours__toggle--open': openingHoursAreVisible }"
    >
      <svg-icon
        name="back-icon"
        class="opening-hours__toggle-icon"
      />

      <span class="opening-hours__toggle-label">
        {{ $t('openingHours') }}
      </span>
    </button>

    <div v-if="openingHoursAreVisible || (!isMobile && !showToggleOnDesktop)">
      <h3 class="opening-hours__title">
        {{ $t('comingWeek') }}
      </h3>

      <dl class="opening-hours__overview">
        <template
          v-for="(openingHour, index) in building.openingHours"
        >
          <dt class="opening-hours__day">
            {{ index === 0 ? $t('today') : $t(openingHour.day) }}
          </dt>
          <dd class="opening-hours__time">
            <template v-if="!openingHour.time.length">
              {{ $t('closed') }}
            </template>
            <p
              v-else
              v-for="(time, index) in openingHour.time"
              :key="index"
            >
              {{ renderTime(time[0]) }} - {{ renderTime(time[1]) }}
            </p>
          </dd>
        </template>
      </dl>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    building: Object,
    showToggleOnDesktop: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      openingHoursAreVisible: false
    }
  },
  computed: {
    ...mapState(['isMobile'])
  },
  methods: {
    toggleOpeningHours() {
      this.openingHoursAreVisible = !this.openingHoursAreVisible
    },
    renderTime(dateStamp) {
      const date = new Date(dateStamp)
      const time = date.toLocaleString('nl-NL', { hour: 'numeric', minute: '2-digit' })
      return time
    }
  }
}
</script>

<style>
@import '../app-core/variables.css';

.opening-hours {
  text-align: right;
}

.opening-hours__overview {
  display: flex;
  flex-wrap: wrap;
}

.opening-hours__toggle {
  padding-left: var(--spacing-quarter);
  margin-right: var(--spacing-half-negative);
  overflow: hidden;
}

.opening-hours__toggle-label {
  text-decoration: underline;
}

.opening-hours__toggle-icon {
  margin-right: var(--spacing-quarter-negative);
  width: 20px;
  height: 20px;
  vertical-align: middle;
  transform: rotate(270deg);
  transition: transform .3s;
}

.opening-hours__toggle--open .opening-hours__toggle-icon {
  transform: rotate(90deg);
}

.opening-hours__title {
  margin-top: var(--spacing-half);
  text-align: left;
}

.opening-hours__day,
.opening-hours__time {
  flex: 1 1 50%;
  margin: 2px 0;
}

.opening-hours__day {
  text-align: left;
}

.opening-hours__time {
  font-weight: bold;
}
</style>
