<template>
  <div class="opening-hours">
    <button
      v-if="isMobile || showToggleOnDesktop"
      :aria-label="openingHoursAreVisible ? $t('hideOpeningHours') : $t('showOpeningHours')"
      class="opening-hours__toggle button"
      :class="{ 'opening-hours__toggle--open': openingHoursAreVisible }"
      @click="toggleOpeningHours"
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
          v-for="(openingHour, index) in openingHours"
        >
          <dt :key="`hour-entry-${index}`" class="opening-hours__day">
            {{ index === 0 ? $t('today') : $t(openingHour.day) }}
          </dt>
          <dd :key="`time-entry-wrapper-${index}`" class="opening-hours__time">
            <template v-if="!openingHour.time.length">
              {{ $t('closed') }}
            </template>
            <p
              v-for="(time, timeEntryIndex) in openingHour.time"
              v-else
              :key="`time-entry-${timeEntryIndex}`"
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
    openingHours: {
      required: true,
      type: Array,
    },
    showToggleOnDesktop: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      openingHoursAreVisible: false,
    }
  },
  computed: {
    ...mapState(['isMobile']),
  },
  methods: {
    toggleOpeningHours() {
      this.openingHoursAreVisible = !this.openingHoursAreVisible
    },
    renderTime(dateStamp) {
      const date = new Date(dateStamp)
      return date.toLocaleString('nl-NL', { hour: 'numeric', minute: '2-digit' })
    },
  },
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
