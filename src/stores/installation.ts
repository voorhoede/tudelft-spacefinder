import { defineStore } from "pinia";

export const useInstallationStore = defineStore("installation", () => {
  const isInstallable = ref(false);
  let installPromptEvent = undefined as undefined | BeforeInstallPromptEvent;

  function setInstallPromptEvent(event: BeforeInstallPromptEvent) {
    installPromptEvent = event;
    isInstallable.value = true;
  }

  function unsetInstallEvent() {
    installPromptEvent = undefined;
    isInstallable.value = false;
  }

  function installApp() {
    if (!isInstallable) {
      return Promise.reject(new Error("Install unavailable"));
    }
    installPromptEvent!.prompt();
    return installPromptEvent!.userChoice.then((result) => {
      if (result.outcome === "accepted") {
        unsetInstallEvent();
        return result;
      }
      return Promise.reject(new Error("User dismissed install"));
    });
  }

  return { isInstallable, installApp, setInstallPromptEvent };
});
