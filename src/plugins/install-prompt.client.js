import { useInstallationStore } from "~/stores/installation";

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export default defineNuxtPlugin(({ vueApp }) => {
  const installationStore = useInstallationStore();
  window.addEventListener(
    "beforeinstallprompt",
    (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      installationStore.setInstallPromptEvent(event);
    }
  );
});
