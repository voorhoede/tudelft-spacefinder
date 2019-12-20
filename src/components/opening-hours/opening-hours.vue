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
          v-for="(timeSlot, index) in timeSlots"
        >
          <dt :key="`hour-entry-${index}`" class="opening-hours__day">
            {{ index === 0 ? $t('today') : $t(timeSlot.day) }}
          </dt>
          <dd :key="`time-entry-wrapper-${index}`" class="opening-hours__time">
            <template v-if="timeSlot.times.length">
              <p
                v-for="(time, timeIndex) in timeSlot.times"
                :key="timeIndex"
                :class="{
                  'opening-hours__busy': time.busy
                }"
              >
                {{ renderTime(time.time[0]) }} - {{ renderTime(time.time[1]) }}
              </p>
            </template>
            <template v-else>
              {{ $t('closed') }}
            </template>
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
    openingHoursSpace: {
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
    timeSlots() {
      console.log('openingHoursSpace', this.openingHoursSpace)
      const { openingHoursSpace } = this
      const asdf = openingHoursSpace.map((openingHour) => {
        const newTimeslots = []

        newTimeslots.day = openingHour.day

        newTimeslots.times = openingHour.time.reduce((timeslots, timeslot, index) => {
          timeslots.push({ time: timeslot, busy: false })

          const nextTimeslot = openingHour.time[index + 1]

          if (nextTimeslot && new Date(nextTimeslot[0]) > new Date(timeslot[1])) {
            const start = timeslot[1]
            const end = nextTimeslot[0]
            timeslots.push({ time: [start, end], busy: true })
          }

          return timeslots
        }, [])

        return newTimeslots
      })

      console.log(asdf)
      return asdf
    },
  },
  // timeSlots.push({ day, time: [start, end], busy: true })
  // const nextOpeningHour = openingHours[index + 1]
  // if (nextOpeningHour && nextOpeningHour.time && openingHour.day === nextOpeningHour.day) {
  //   const startNext = nextOpeningHour.time[0]
  //   if (new Date(startNext) > new Date(end)) {
  //     timeSlots.push({ day, time: [end, startNext], busy: false })
  //   }
  // }
  methods: {
    toggleOpeningHours() {
      this.openingHoursAreVisible = !this.openingHoursAreVisible
    },
    renderTime(dateStamp) {
      const date = new Date(dateStamp)
      const time = date.toLocaleString('nl-NL', { hour: 'numeric', minute: '2-digit' })
      return time
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
