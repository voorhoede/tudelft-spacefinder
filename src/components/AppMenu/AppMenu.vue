<template>
  <ModalDrawer
    :is-open="isOpen"
    :title="$t('menu')"
    @close="$emit('close')"
  >
    <nav class="app-menu">
      <ul class="flat-list">
        <li class="app-menu__item">
          <NuxtLink
            :to="$localePath('/help')"
            class="app-menu__link"
            @click="$emit('close')"
          >
            <SvgIcon
              name="help-icon"
              class="app-menu__icon"
            />

            <span class="app-menu__link-name">
              {{ $t("help") }}
            </span>
          </NuxtLink>
        </li>
        <li class="app-menu__item">
          <NuxtLink
            :to="$localePath('/feedback')"
            class="app-menu__link"
            @click="$emit('close')"
          >
            <SvgIcon
              name="feedback-icon"
              class="app-menu__icon"
            />

            <span class="app-menu__link-name">
              {{ $t("feedback") }}
            </span>
          </NuxtLink>
        </li>
        <li class="app-menu__item">
          <LanguageSelector @close="$emit('close')" />
        </li>
        <li
          v-if="isInstallable"
          class="app-menu__item"
        >
          <button
            type="button"
            class="app-menu__link app-menu__button button"
            @click="installApp"
          >
            <SvgIcon
              name="plus-icon"
              class="app-menu__icon"
            />

            <span class="app-menu__link-name">
              {{ $t("addToHomescreen") }}
            </span>
          </button>
        </li>
      </ul>
    </nav>
  </ModalDrawer>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useInstallationStore } from "~/stores/installation";

defineProps<{ isOpen?: boolean }>();
const emit = defineEmits(["close"]);
const installationStore = useInstallationStore();

const { isInstallable } = storeToRefs(installationStore);

function installApp() {
  installationStore.installApp().then(() => emit("close"));
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
