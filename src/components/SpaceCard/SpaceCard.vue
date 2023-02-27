<template>
  <NuxtLink
    :to="
      spaceRoute({ buildingSlug: space.building.slug, spaceSlug: space.slug })
    "
    class="space-card card"
  >
    <h3 v-if="space.name">
      {{ space.name }}
    </h3>

    <div class="space-card__info">
      <div class="space-card__location">
        <p v-if="space.name" class="space-card__description">
          <em>{{ space.building.abbreviation }}</em> - {{ space.roomId }}
        </p>
        <h3 v-else>
          <em>{{ space.building.abbreviation }}</em> - {{ space.roomId }}
        </h3>
      </div>

      <CardStatus
        :opening-hours="space.openingHours"
        class="space-card__status"
      />
    </div>

    <h4 class="a11y-sr-only">
      {{ $t("facilities") }}
    </h4>

    <SpaceFacilities
      :facilities="space.facilities"
      :seats="space.seats"
      class="space-card__facilities"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
import { type Space } from "~/types/Space";
defineProps<{ space: Space }>();
const { spaceRoute } = useLocaleRoute();
</script>

<style>
@import "../app-core/variables.css";

@media (min-width: 700px) {
  .space-card {
    padding: var(--spacing-default);
  }
}

.space-card svg {
  fill: var(--text-color);
}

.space-card:hover svg,
.space-card:focus svg {
  fill: var(--brand-primary-color-dark);
}

.space-card:hover .space-facility__icon,
.space-card:focus .space-facility__icon,
.space-card:hover .space-facility__seating-icon,
.space-card:focus .space-facility__seating-icon {
  /*color: #1e6188;*/
}

.space-card__info {
  display: flex;
  margin-bottom: var(--spacing-default);
}

.space-card__location {
  flex: 1 1 auto;
  line-height: 1.3;
}

.space-card__description {
  font-size: var(--font-size-smaller);
}

.space-card__description em {
  font-weight: bold;
  font-style: normal;
}

.space-card__status {
  flex: 0 0 auto;
}

.space-card__facilities {
  margin-left: -0.2rem;
}
</style>
