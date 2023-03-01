import { useStore } from "~/stores/store";
import { usePageContent } from "~/stores/pageContent";

export default defineNuxtPlugin((app) => {
  const store = useStore(app.$pinia);
  const pageContent = usePageContent(app.$pinia);
  import("~/data/buildings.json").then((buildings) => {
    store.setBuildings(buildings.default as any); //TODO: arrays can't become tuples, silly things
  });
  import("~/data/spaces.json").then((spaces) => {
    store.setSpaces(spaces.default as any); //TODO: arrays can't become tuples, silly things
  });
  import("~/data/onboarding.json").then((onboarding) => {
    pageContent.onboarding = onboarding.default;
  });
  import("~/data/infopage.json").then((infoPage) => {
    pageContent.infoPage = infoPage.default;
  });
  import("~/data/feedbackpage.json").then((feedbackPage) => {
    pageContent.feedbackPage = feedbackPage.default;
  });
});
