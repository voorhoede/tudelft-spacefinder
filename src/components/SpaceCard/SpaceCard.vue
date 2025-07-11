<template>
  <div class="space-card">
    <div class="space-card__info">
      <h3 class="space-card__title">
        {{ space.name }}
      </h3>
      <p class="space-card__description">
        {{ space.building.abbreviation }} | {{ space.roomName }} |
        {{ space.floor }}
      </p>
      <div class="space-card__seating">
        <SvgIcon
          name="seat-icon--micro"
          class="space-card__seating-icon"
        />
        <span>{{ " " }}{{ space.seats }}{{ " " }}</span>
        <span class="space-card__seating-label">
          {{ $t("seats") }}
        </span>
      </div>

      <SpaceFacilities
        :facilities="space.facilities"
        class="space-card__facilities"
      />
    </div>

    <div class="space-card__image-wrapper">
      <div
        v-if="space.image"
        class="space-card__image-inner"
      >
        <DatoImage
          class="space-card__image"
          :class="{ 'space-card__image--zoomable': zoomable }"
          :src="space.image.url"
          alt=""
          :width="210"
          :height="158"
          loading="eager"
          :modifiers="{ fit: 'crop', ar: 1.33 }"
          @click="zoomable && openDialog()"
        />
        <SvgIcon
          class="space-card__image-icon"
          v-if="zoomable"
          name="arrows-pointing-out"
          @click="openDialog()"
        />
      </div>
      <div
        v-else
        class="space-card__image space-card__image--placeholder"
      >
        <SvgIcon
          name="flame-icon"
          class="space-card__image-placeholder-icon"
        />
      </div>
    </div>

    <dialog
      v-if="zoomable"
      ref="imageDialog"
      class="space-card__dialog"
      @click.self="closeDialog()"
    >
      <DatoImage
        class="space-card__dialog-image"
        :src="space.image.url"
        sizes="min(100vw, 160dvh)"
        alt=""
        loading="lazy"
        :width="1200"
        :height="900"
        :modifiers="{ fit: 'scale' }"
      />
      <button
        class="space-card__dialog-close"
        @click="closeDialog()"
        aria-label="Close image"
      >
        <SvgIcon name="x-mark" />
        {{ $t("close") }}
      </button>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { type SpaceFeatures } from "~/types/Filters";

const props = defineProps<{
  space: {
    name: string;
    roomName: string;
    floor: string;
    seats: number;
    facilities: SpaceFeatures;
    image?: {
      url: string;
    };
    building: {
      abbreviation: string;
    };
  };
  canZoom: boolean;
}>();

const imageDialog = ref<HTMLDialogElement>();
const zoomable = computed(() => props.canZoom && props.space.image);

const openDialog = () => {
  imageDialog.value?.showModal();
};

const closeDialog = () => {
  imageDialog.value?.close();
};
</script>

<style>
.space-card {
  display: flex;
  justify-content: space-between;
  background-color: var(--background-color);
  box-shadow: var(--shadow-small);
  align-items: stretch;
}

.space-card__info {
  padding: var(--spacing-default);
}

.space-card__title {
  line-height: 1.2;
  font-weight: 600;
}

.space-card__description {
  margin-bottom: var(--spacing-half);
  font-size: var(--font-size-smaller);
}

.space-card__seating {
  font-weight: bold;
  font-size: var(--font-size-smaller);
  margin-bottom: var(--spacing-quarter);
}

.space-card__seating-icon {
  vertical-align: middle;
  margin-block-start: calc(1ex - 1cap);
  width: 16px;
  height: 16px;
}

.space-card__seating-label {
  font-weight: normal;
}

.space-card__image-wrapper {
  width: clamp(32%, 30vw, 44%);
  flex-shrink: 0;
}

.space-card__image {
  object-fit: cover;
  height: 100%;
}

.space-card__image-inner {
  display: grid;
  grid-template-areas: "stack";
  height: 100%;

  * {
    grid-area: stack;
  }
}

.space-card__image-icon {
  width: 24px;
  height: 24px;
  padding: var(--spacing-quarter);
  box-sizing: content-box;
  place-self: flex-end;
  margin: var(--spacing-half);
  cursor: pointer;
  opacity: 0.9;
  background: white;
  border-radius: 4px;
}

.space-card__image--placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--neutral-color);
}

.space-card__image-placeholder-icon {
  width: 30px;
  height: 30px;
}

.space-card__image--zoomable {
  cursor: pointer;
}

.space-card__dialog[open] {
  display: flex;
  flex-direction: column;
  padding: 0;
  border: 0;
  background: none;
  width: 100%;
  max-width: 100%;
  max-height: 100dvh;
  height: 100%;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  background: none;
}

.space-card__dialog::backdrop {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
}

.space-card__dialog-close {
  display: flex;
  align-self: flex-end;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 12rem;
  padding-inline: var(--spacing-half);
  padding-block: var(--spacing-three-quarter);
  cursor: pointer;
  background: var(--background-color);
  box-shadow: var(--shadow-small);
  border: none;
  border-radius: 2rem;
  position: absolute;
  bottom: var(--spacing-default);
  right: var(--spacing-default);
}

.space-card__dialog-close:hover {
  background: rgba(255, 255, 255, 1);
}

.space-card__dialog-close svg {
  width: 24px;
  height: 24px;
}

.space-card__dialog-image {
  object-fit: contain;
  align-self: center;
  max-height: 90dvh;
  width: 100%;
  flex-basis: 100%;
}

@media (min-width: 700px) {
  .space-card__dialog-close {
    top: var(--spacing-default);
    bottom: auto;
  }
}
</style>
