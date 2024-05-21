<template>
  <div class="opening-hours">
    <button
      :aria-label="isExpanded ? $t('hideOpeningHours') : $t('showOpeningHours')"
      class="opening-hours__toggle button"
      :class="{ 'opening-hours__toggle--open': isExpanded }"
      @click="toggleOpeningHours"
    >
      <SvgIcon
        name="chevron-icon"
        class="opening-hours__toggle-icon"
      />

      <span class="opening-hours__toggle-label">
        {{ $t("openingHours") }}
      </span>
    </button>

    <div v-if="isExpanded">
      <h3 class="opening-hours__title">
        {{ $t("comingWeek") }}
      </h3>

      <dl class="opening-hours__overview">
        <template
          v-for="(day, dayIndex) in comingWeek"
          :key="dayIndex"
        >
          <dt class="opening-hours__day">
            {{ intlFormatDay.format(day.date) }}
          </dt>
          <dd class="opening-hours__time">
            <template v-if="day.events">
              <p
                v-for="(event, index) in day.events"
                :key="`${dayIndex}-${index}`"
              >
                {{
                  intlFormatTime.formatRange(
                    new Date(event.start),
                    new Date(event.end)
                  )
                }}
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
const props = defineProps<{
  openingHoursPerDay: unknown;
}>();

const isExpanded = ref(false);
const route = useRoute();

const intlFormatDay = Intl.DateTimeFormat(route.params.locale, {
  weekday: "long",
});

const intlFormatTime = Intl.DateTimeFormat(route.params.locale, {
  hour: "numeric",
  minute: "numeric",
  hour12: false,
});

const comingWeek = computed(() => {
  const week = [0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  });

  return week.map((day) => {
    return { date: day, events: props.openingHoursPerDay[day.getUTCDate()] };
  });
});

function toggleOpeningHours() {
  isExpanded.value = !isExpanded.value;
}
</script>

<style>
.opening-hours {
  font-size: var(--font-size-smaller);
  text-align: right;
}

.opening-hours__overview {
  display: flex;
  flex-wrap: wrap;
}

.opening-hours__toggle {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0;
  font-size: var(--font-size-smaller);
}

.opening-hours__toggle-label {
  text-decoration: underline;
}

.opening-hours__toggle-icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-block-start: calc(1ex - 1cap);
  transition: transform 0.2s;
  transform-origin: center 54%;
}

.opening-hours__toggle--open .opening-hours__toggle-icon {
  transform: rotate(180deg);
}

.opening-hours__title {
  margin-top: var(--spacing-half);
  font-size: var(--font-size-default);
  text-align: left;
}

.opening-hours__day:first-child {
  font-weight: bold;
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
</style>
