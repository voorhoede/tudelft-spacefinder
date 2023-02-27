<template>
  <modal-drawer :is-open="isOpen" :title="$t('menu')" @close="$emit('close')">
    <nav class="app-menu">
      <ul class="flat-list">
        <li class="app-menu__item">
          <nuxt-link to="/" class="app-menu__link" @click="$emit('close')">
            <svg-icon name="home-icon" class="app-menu__icon" />

            <span class="app-menu__link-name">
              {{ $t("home") }}
            </span>
          </nuxt-link>
        </li>
        <li class="app-menu__item">
          <nuxt-link
            :to="buildingsRoute"
            class="app-menu__link"
            @click="$emit('close')"
          >
            <svg-icon name="building-icon" class="app-menu__icon" />

            <span class="app-menu__link-name">
              {{ $t("buildingTitle") }}
            </span>
          </nuxt-link>
        </li>
        <li class="app-menu__item">
          <nuxt-link
            :to="helpRoute"
            class="app-menu__link"
            @click="$emit('close')"
          >
            <svg-icon name="help-icon" class="app-menu__icon" />

            <span class="app-menu__link-name">
              {{ $t("help") }}
            </span>
          </nuxt-link>
        </li>
        <li class="app-menu__item">
          <nuxt-link
            :to="feedbackRoute"
            class="app-menu__link"
            @click="$emit('close')"
          >
            <svg-icon name="feedback-icon" class="app-menu__icon" />

            <span class="app-menu__link-name">
              {{ $t("feedback") }}
            </span>
          </nuxt-link>
        </li>
        <li class="mobile-only app-menu__item">
          <nuxt-link to="/" class="app-menu__link" @click="toggleMapMode">
            <span v-if="isMapMode">
              <svg-icon name="list-icon" class="app-menu__icon" />

              <span class="app-menu__link-name">
                {{ $t("listToggle") }}
              </span>
            </span>
            <span v-else>
              <svg-icon name="map-icon" class="app-menu__icon" />

              <span class="app-menu__link-name">
                {{ $t("mapToggle") }}
              </span>
            </span>
          </nuxt-link>
        </li>
        <li class="app-menu__item">
          <language-selector @close="$emit('close')" />
        </li>
        <li v-if="isInstallable" class="app-menu__item">
          <button
            type="button"
            class="app-menu__link app-menu__button button"
            @click="installApp"
          >
            <svg-icon name="plus-icon" class="app-menu__icon" />

            <span class="app-menu__link-name">
              {{ $t("addToHomescreen") }}
            </span>
          </button>
        </li>
      </ul>
    </nav>
  </modal-drawer>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "~/stores/store";
import { useInstallationStore } from "~/stores/installation";

defineProps<{ isOpen?: boolean }>();
const emit = defineEmits(["close"]);
const store = useStore();
const installationStore = useInstallationStore();
const { helpRoute, feedbackRoute, buildingsRoute } = useLocaleRoute();

const { isInstallable } = storeToRefs(installationStore);
const { isMapMode } = storeToRefs(store);

function installApp() {
  installationStore.installApp().then(() => emit("close"));
}

function toggleMapMode() {
  store.isMapMode = !store.isMapMode;
  emit("close");
}
</script>

<style>
.app-menu {
  padding: 0 var(--spacing-default) var(--spacing-default)
    var(--spacing-default);
}

li.app-menu__item {
  display: block;
  border-bottom: 1px solid var(--highlight-color);
  text-transform: lowercase;
}

.app-menu__link {
  display: block;
  padding: var(--spacing-default) 0;
  text-decoration: none;
}

.app-menu__link:hover .app-menu__link-name,
.app-menu__link:focus .app-menu__link-name {
  text-decoration: underline;
}

.app-menu__link-name {
  display: inline-block;
}

.app-menu__link-name::first-letter {
  text-transform: uppercase;
}

.app-menu__button {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
}

.app-menu__button:hover,
.app-menu__button:focus {
  border: none;
}

.app-menu__icon {
  margin-right: var(--spacing-half);
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
</style>
