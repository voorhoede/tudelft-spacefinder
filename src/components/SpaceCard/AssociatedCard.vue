<template>
  <div class="associated-card">
    <button
      class="associated-card__button"
      @click="goToPreviousSpace"
      :disabled="currentIndex === 0"
      :aria-label="
        currentIndex === spaces.length - 1
          ? $t('spaceNavigationLast')
          : $t('spaceNavigationNext')
      "
    >
      <SvgIcon
        class="associated-card__icon associated-card__icon--left"
        name="chevron-icon"
      />
    </button>
    <span class="associated-card__text">{{ currentIndex + 1 }}/{{ spaces.length }} {{ $t("locations") }}</span>
    <button
      class="associated-card__button"
      @click="goToNextSpace"
      :disabled="currentIndex === spaces.length - 1"
      :aria-label="
        currentIndex === spaces.length - 1
          ? $t('spaceNavigationLast')
          : $t('spaceNavigationNext')
      "
    >
      <SvgIcon
        class="associated-card__icon associated-card__icon--right"
        name="chevron-icon"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  spaces: any;
  currentSpaceSlug: string;
}>();

const { $localePath } = useNuxtApp();
const currentIndex = ref(0);
const router = useRouter();

const goToPreviousSpace = () => {
  console.log(currentIndex.value);
  if (currentIndex.value > 0) {
    const previousSpace = props.spaces![currentIndex.value - 1];
    router.replace(
      $localePath("/buildings/:buildingSlug/spaces/:spaceSlug", {
        buildingSlug: previousSpace.buildingSlug,
        spaceSlug: previousSpace.spaceSlug,
      })
    );
    currentIndex.value--;
  }
};
const goToNextSpace = () => {
  if (currentIndex.value < props.spaces!.length - 1) {
    const nextSpace = props.spaces![currentIndex.value + 1];
    router.replace(
      $localePath("/buildings/:buildingSlug/spaces/:spaceSlug", {
        buildingSlug: nextSpace.buildingSlug,
        spaceSlug: nextSpace.spaceSlug,
      })
    );
    currentIndex.value++;
  }
};

watch(
  [() => props.currentSpaceSlug, () => props.spaces],
  ([newSpaceSlug, newAssociatedSpaces]) => {
    currentIndex.value =
      newAssociatedSpaces?.findIndex(
        (space) => space.spaceSlug === newSpaceSlug
      ) ?? 0;
  },
  { immediate: true }
);
</script>

<style>
.associated-card {
  display: inline-flex;
  align-items: center;
  margin-bottom: var(--spacing-default);
  background: var(--background-color);
  box-shadow: var(--shadow-small);
}

.associated-card__button {
  display: flex;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-half);
}

.associated-card__button:disabled {
  cursor: not-allowed;
  fill: var(--text-color-muted);
}

.associated-card__text {
  padding-inline: var(--spacing-half);
}

.associated-card__icon {
  width: 24px;
  height: 24px;
}

.associated-card__icon--left {
  rotate: 90deg;
}

.associated-card__icon--right {
  rotate: -90deg;
}
</style>
