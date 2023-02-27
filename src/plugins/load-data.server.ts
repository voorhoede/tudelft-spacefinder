import { useStore } from "~/stores/store";
import { usePageContent } from "~/stores/pageContent";

export default defineNuxtPlugin((app) => {
  const store = useStore(app.$pinia);
  const pageContent = usePageContent(app.$pinia);
  import("~/public/data/buildings.json").then((buildings) => {
    store.setBuildings(buildings.default as any); //TODO: arrays can't become tuples, silly things
  });
  import("~/public/data/spaces.json").then((spaces) => {
    store.setSpaces(spaces.default as any); //TODO: arrays can't become tuples, silly things
  });
  import("~/public/data/onboarding.json").then((onboarding) => {
    pageContent.onboarding = onboarding.default;
  });
  import("~/public/data/infopage.json").then((infoPage) => {
    pageContent.infoPage = infoPage.default;
  });
  import("~/public/data/feedbackpage.json").then((feedbackPage) => {
    pageContent.feedbackPage = feedbackPage.default;
  });
});
