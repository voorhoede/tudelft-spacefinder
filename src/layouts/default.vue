<template>
  <div ref="defaultLayout" class="default-layout">
    <SpriteMap />
    <ClientOnly>
      <PopUp />
    </ClientOnly>

    <NotificationBar
      class="default-layout__notification-bar"
      :message="$t('ieNotification')"
    />

    <AppHeader
      :opened-menu="openedMenu"
      @openAppMenu="openAppMenu"
      @openFilterMenu="openFilterMenu"
    />

    <main class="default-layout__main">
      <slot />

      <MapboxMap class="default-layout__map" />
    </main>

    <AppMenu :is-open="openedMenu === 'app-menu'" @close="closeMenu" />

    <FilterMenu :is-open="openedMenu === 'filter-menu'" @close="closeMenu" />
  </div>
</template>

<script setup lang="ts">
import debounce from "lodash.debounce";
import { useStore } from "~/stores/store";

const store = useStore();
const defaultLayout = ref<null | HTMLDivElement>(null);
const openedMenu = ref<null | string>(null);

const onResizeDebounce = debounce(onResize, 200);

function openAppMenu() {
  openedMenu.value = "app-menu";
}
function openFilterMenu() {
  openedMenu.value = "filter-menu";
}
function closeMenu() {
  openedMenu.value = null;
}
function onResize() {
  const windowHeight = window.innerHeight * 0.01;
  defaultLayout.value!.style.setProperty(
    "--window-height",
    `${windowHeight}px`
  );

  store.isMobile = !window.matchMedia("(min-width: 700px)").matches;
}

onMounted(() => {
  onResize();
  window.addEventListener("resize", onResizeDebounce, true);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResizeDebounce, true);
});

useHead({
  script: [
    {
      innerHTML: `
        var isIE = (/(MSIE|Trident)/).test(window.navigator.userAgent);
        if (isIE) { document.documentElement.className += " old-ie"; }`,
    },
  ],
});
</script>

<style>
.default-layout__notification-bar {
  display: none;
}
.old-ie .default-layout__notification-bar {
  display: block;
}
</style>
