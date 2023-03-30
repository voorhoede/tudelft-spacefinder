<template>
  <div class="social-share">
    <button
      class="button button--round"
      @click="toggleOptions"
    >
      <SvgIcon
        name="share-icon"
        class="button--round__icon"
      />
      <span class="a11y-sr-only">
        <slot>{{
          optionsAreVisible
            ? $t("hideSharingOptions")
            : $t("showSharingOptions")
        }}</slot>
      </span>
    </button>

    <div
      class="social-share__options"
      :aria-hidden="!optionsAreVisible"
    >
      <a
        v-for="(platform, index) in platforms"
        :key="index"
        :tabindex="optionsAreVisible ? 0 : -1"
        target="_blank"
        :href="`${platform.link}${encodedUrl}`"
        class="social-share__option button button--round"
        :class="{ 'social-share__option--visible': optionsAreVisible }"
        @click="handleClick"
      >
        <SvgIcon
          :name="platform.icon"
          class="button--round__icon"
        />
        <span class="a11y-sr-only">
          {{ $t(platform.label) }}
        </span>
      </a>

      <button
        v-if="copyToClipboardIsVisible"
        ref="copyButton"
        :tabindex="optionsAreVisible ? 0 : -1"
        class="social-share__option button button--round"
        :class="{ 'social-share__option--visible': optionsAreVisible }"
        @click="copyToClipboard"
      >
        <SvgIcon
          name="copy-icon"
          class="button--round__icon"
        />
        <span class="a11y-sr-only">
          {{ $t("copyToClipboard") }}
        </span>
      </button>
    </div>

    <Transition name="notification-fade">
      <div
        v-if="notificationIsVisible"
        role="alert"
        class="social-share__notification"
      >
        {{ $t("copiedToClipboard") }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const platforms = [
  {
    icon: "whatsapp-icon",
    link: "https://wa.me/?text=",
    label: "shareWithWhatsApp",
  },
  {
    icon: "telegram-icon",
    link: "https://t.me/share/url?url=",
    label: "shareWithTelegram",
  },
];

const props = defineProps<{ url: string }>();
const optionsAreVisible = ref(false);
const copyToClipboardIsVisible = ref(true);
const notificationIsVisible = ref(false);
const copyButton = ref(null as null | HTMLButtonElement);
const encodedUrl = computed(() => encodeURIComponent(props.url));
onMounted(() => {
  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
    copyToClipboardIsVisible.value = false;
  }
});

function toggleOptions() {
  if (navigator.share) {
    navigator.share({
      url: props.url,
    });
  } else {
    optionsAreVisible.value = !optionsAreVisible.value;
  }
}

function copyToClipboard() {
  const el = document.createElement("textarea");
  el.value = props.url;
  document.body.appendChild(el);

  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);

  showNotification();
}

function showNotification() {
  notificationIsVisible.value = true;
  copyButton.value?.focus();
  window.setTimeout(() => {
    notificationIsVisible.value = false;
  }, 4000);
}

function handleClick() {
  optionsAreVisible.value = false;
}
</script>

<style>
@import "../app-core/variables.css";

.social-share {
  position: relative;
}

.social-share__options {
  position: absolute;
  top: 0;
  left: 0;
}

.social-share__option {
  margin-top: var(--spacing-half);
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transform: translateY(0px) scale(0);
  transition: all 0.5s ease;
}

.social-share__option--visible {
  opacity: 1;
  transition: transform 0.5s cubic-bezier(0, 1.33, 0.44, 0.98);
}

.social-share__option--visible:nth-child(1) {
  transition-delay: 0.2s;
  transform: translateY(50px) scale(1);
}

.social-share__option--visible:nth-child(2) {
  transition-delay: 0.1s;
  transform: translateY(110px) scale(1);
}

.social-share__option--visible:nth-child(3) {
  transform: translateY(170px) scale(1);
}

.social-share__notification {
  position: fixed;
  padding: var(--spacing-default);
  left: 0;
  bottom: 0;
  width: 100%;
  background: var(--brand-primary-color);
  font-size: var(--font-size-smaller);
  text-align: center;
  color: var(--background-color);
}

.notification-fade-enter-active,
.notification-fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.notification-fade-enter-from,
.notification-fade-leave-to {
  opacity: 0;
}
</style>
