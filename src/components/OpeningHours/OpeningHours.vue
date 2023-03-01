<template>
  <div class="opening-hours">
    <button
      v-if="store.isMobile || showToggleOnDesktop"
      :aria-label="
        openingHoursAreVisible ? $t('hideOpeningHours') : $t('showOpeningHours')
      "
      class="opening-hours__toggle button"
      :class="{ 'opening-hours__toggle--open': openingHoursAreVisible }"
      @click="toggleOpeningHours"
    >
      <SvgIcon name="back-icon" class="opening-hours__toggle-icon" />

      <span class="opening-hours__toggle-label">
        {{ $t("openingHours") }}
      </span>
    </button>

    <div
      v-if="openingHoursAreVisible || (!store.isMobile && !showToggleOnDesktop)"
    >
      <h3 class="opening-hours__title">
        {{ $t("comingWeek") }}
      </h3>

      <dl class="opening-hours__overview">
        <template v-for="(timeSlot, index) in timeSlots" :key="index">
          <dt class="opening-hours__day">
            {{ index === 0 ? $t("today") : $t(timeSlot.day) }}
          </dt>
          <dd class="opening-hours__time">
            <template v-if="timeSlot.times.length">
              <p
                v-for="(time, timeIndex) in timeSlot.times"
                :key="timeIndex"
                :class="{
                  'opening-hours__busy': time.busy,
                }"
              >
                {{ renderTime(time.time[0]) }} - {{ renderTime(time.time[1]) }}
              </p>
            </template>
            <template v-else>
              {{ $t("closed") }}
            </template>
          </dd>
        </template>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "~/stores/store";
import type { OpeningHours } from "~/types/OpeningHours";

export interface Props {
  openingHoursBuilding: OpeningHours[];
  openingHoursSpace: OpeningHours[];
  showToggleOnDesktop?: boolean;
}
const props = withDefaults(defineProps<Props>(), { showToggleOnDesktop: true });
const openingHoursAreVisible = ref(false);
const store = useStore();

function toggleOpeningHours() {
  openingHoursAreVisible.value = !openingHoursAreVisible.value;
}

function renderTime(dateStamp: string) {
  const date = new Date(dateStamp);
  const time = date.toLocaleString("nl-NL", {
    hour: "numeric",
    minute: "2-digit",
  });
  return time;
}

const timeSlots = computed(() => {
  return props.openingHoursSpace.map((openingHour, dayIndex) => {
    const buildingHoursThisDay = props.openingHoursBuilding[dayIndex].time;

    const buildingStart = buildingHoursThisDay.length
      ? buildingHoursThisDay[buildingHoursThisDay.length - 1][0]
      : ""; //TODO: it was [] before and I do not know what it means. Both should throw!
    const buildingEnd = buildingHoursThisDay.length
      ? buildingHoursThisDay[buildingHoursThisDay.length - 1][1]
      : ""; //TODO: it was [] before and I do not know what it means. Both should throw!
    return {
      day: openingHour.day,
      times: openingHour.time.reduce((timeslots, timeslot, slotIndex) => {
        // Check if there is a busy slot before the first open time slot
        if (
          slotIndex === 0 &&
          new Date(timeslot[0]) > new Date(buildingStart)
        ) {
          const start = buildingStart;
          const end = timeslot[0];
          timeslots.push({ time: [start, end], busy: true });
        }

        // Always add open time slot to array
        timeslots.push({ time: timeslot, busy: false });

        // Check if there is a busy slot between two open time slots
        const nextTimeslot = openingHour.time[slotIndex + 1];
        if (nextTimeslot && new Date(nextTimeslot[0]) > new Date(timeslot[1])) {
          const start = timeslot[1];
          const end = nextTimeslot[0];
          timeslots.push({ time: [start, end], busy: true });
        }

        // Check if there is a busy slot after the last open time slot
        if (
          slotIndex === openingHour.time.length - 1 &&
          new Date(buildingEnd) > new Date(timeslot[1])
        ) {
          const start = timeslot[1];
          const end = buildingEnd;
          timeslots.push({ time: [start, end], busy: true });
        }

        return timeslots;
      }, [] as Array<{ time: [string, string]; busy: boolean }>),
    };
  });
});
</script>

<style>
@import "../app-core/variables.css";

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
  transition: transform 0.3s;
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
  text-align: right;
}

.opening-hours__busy {
  text-decoration: line-through;
  color: var(--text-color-muted);
}
</style>
