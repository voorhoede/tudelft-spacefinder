<template>
  <div
    v-if="showPanel"
    class="notification-panel"
  >
    <div
      v-html="message"
      class="notification-panel__content"
    />

    <button
      type="button"
      class="button button--navigation"
      @click="closePanel"
    >
      <SvgIcon
        name="close-icon"
        class="button--navigation__icon"
      />

      {{ $t("close") }}
    </button>
  </div>
</template>

<script setup lang="ts">
import Cookie from "js-cookie";

const props = defineProps<{ showNotification: boolean, timestamp: string, message: string, }>();

const showPanel = ref(false);

onMounted(() => {
  const cookieNotificationTimestamp = Cookie.get('notification-timestamp');

  if (props.showNotification && cookieNotificationTimestamp !== props.timestamp) {
    showPanel.value = true;
  }
});

function closePanel() {
  Cookie.set('notification-timestamp', props.timestamp);
  showPanel.value = false;
}
</script>

<style>
@import "../app-core/variables.css";

.notification-panel {
  z-index: var(--layer--popup);
  position: absolute;
  display: flex;
  gap: var(--spacing-default);
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-default) var(--spacing-three-quarter) var(--spacing-default) var(--spacing-default);
  bottom: var(--spacing-default);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - var(--spacing-double));
  max-width: 800px;
  background: var(--brand-secondary-color);
  border: 1px solid transparent;
  box-shadow: var(--shadow-small);
  color: var(--background-color);
  line-height: 1.3;
}

@media (min-width: 700px) {
  .notification-panel {
    bottom: var(--spacing-double);
  }
}

.notification-panel__content {
  max-width: 800px;
  align-self: center;
}
</style>
  