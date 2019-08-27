<template>
  <div class="social-share">
    <button
      class="button button--round"
      @click="toggleOptions"
    >
      <svg-icon
        name="share-icon"
        class="button--round__icon"
      />
      <span class="a11y-sr-only">
        <slot>{{ !optionsAreVisible ? $t('showSharingOptions') : $t('hideSharingOptions') }}</slot>
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
        :class="{ 'social-share__option--visible' : optionsAreVisible }"
        @click="handleClick"
      >
        <svg-icon
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
        :class="{ 'social-share__option--visible' : optionsAreVisible }"
        @click="copyToClipboard"
      >
        <svg-icon
          name="copy-icon"
          class="button--round__icon"
        />
        <span class="a11y-sr-only">
          {{ $t('copyToClipboard') }}
        </span>
      </button>
    </div>

    <transition name="notification-fade">
      <div
        v-if="notificationIsVisible"
        role="alert"
        class="social-share__notification"
      >
        {{ $t('copiedToClipboard') }}
      </div>
    </transition>
  </div>
</template>

<script>
import platforms from './platforms'

export default {
  props: {
    url: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      optionsAreVisible: false,
      copyToClipboardIsVisible: true,
      notificationIsVisible: false,
      platforms,
    }
  },
  computed: {
    encodedUrl() {
      return encodeURIComponent(this.url)
    },
  },
  mounted() {
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      this.copyToClipboardIsVisible = false
    }
  },
  methods: {
    toggleOptions() {
      if (navigator.share) {
        navigator.share({
          url: this.url,
        })
      } else {
        this.optionsAreVisible = !this.optionsAreVisible
      }
    },
    copyToClipboard() {
      const el = document.createElement('textarea')
      el.value = this.url
      document.body.appendChild(el)

      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)

      this.showNotification()
    },
    showNotification() {
      this.notificationIsVisible = true
      this.$refs.copyButton.focus()
      window.setTimeout(() => { this.notificationIsVisible = false }, 4000)
    },
    handleClick() {
      this.optionsAreVisible = false
    },
  },
}
</script>

<style>
@import '../app-core/variables.css';

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
  transition: all .5s ease;
}

.social-share__option--visible {
  opacity: 1;
  transition: transform .5s cubic-bezier(0, 1.33, .44, .98);
}

.social-share__option--visible:nth-child(1) {
  transition-delay: .2s;
  transform: translateY(50px) scale(1);
}

.social-share__option--visible:nth-child(2) {
  transition-delay: .1s;
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

.notification-fade-enter-active, .notification-fade-leave-active {
  transition: opacity .5s ease-in-out;
}

.notification-fade-enter, .notification-fade-leave-to {
  opacity: 0;
}
</style>
