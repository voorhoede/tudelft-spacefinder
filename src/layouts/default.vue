<template>
  <div
    ref="defaultLayout"
    class="default-layout"
  >
    <VitePwaManifest />
    <SpriteMap />

    <div
      tabindex="-1"
      ref="topOfPage"
    />

    <NotificationBar
      class="default-layout__notification-bar"
      :message="$t('ieNotification')"
    />

    <NotificationPanel
      :show-notification="notification.showNotification"
      :timestamp="notification.updatedAt"
      :message="notificationBody"
    />

    <AppHeader
      :opened-menu="openedMenu"
      @open-app-menu="openAppMenu"
    />

    <main class="default-layout__main">
      <slot />

      <MapboxMap
        class="default-layout__map"
        :class="{ 'default-layout__map--space-detail-page': isSpaceDetailPage}"
      />
    </main>

    <AppNavigation
      :opened-menu="openedMenu"
      @open-filter-menu="openFilterMenu"
    />

    <AppMenu
      :is-open="openedMenu === 'app-menu'"
      @close="closeMenu"
    />

    <FilterMenu
      :is-open="openedMenu === 'filter-menu'"
      @close="closeMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from "~/stores/map";
import notification from "../data/notification.json";

const route = useRoute();
const { afterEach } = useRouter();
const mapStore = useMapStore();
const { $locale } = useNuxtApp();

const defaultLayout = ref<null | HTMLDivElement>(null);
const openedMenu = ref<null | string>(null);
const topOfPage = ref<null | HTMLDivElement>(null);

let spaceSlug: string | string[];

watch(route,
  value => {
    const previousSpaceSlug = spaceSlug
    spaceSlug = value.params.spaceSlug

    if (previousSpaceSlug !== spaceSlug) {
      mapStore.resizeMap();
    }
  }
);

afterEach((from, to) => {
  if (from.path !== to.path) {
    topOfPage.value.focus();
  }
});

const isSpaceDetailPage = computed(() => route.params.spaceSlug !== undefined)

const notificationBody = computed(() => notification[$locale.value].body)

const onResizeDebounce = useDebounceFn(onResize, 200);

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
      (function(){  
        var isIE = (/(MSIE|Trident)/).test(window.navigator.userAgent);
        if (isIE) { document.documentElement.className += " old-ie"; }
      })()
      `,
    },
  ],
  htmlAttrs: { lang: $locale }
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
