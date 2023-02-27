import { defineStore } from "pinia";

export interface LocalizedPageContent {
  title: string;
  body: string;
}

export type PageContent = Record<string, LocalizedPageContent>;

export const usePageContent = defineStore("pageContent", () => {
  const onboarding = ref<PageContent>({});
  const infoPage = ref<PageContent>({});
  const feedbackPage = ref<PageContent>({});
  return { onboarding, infoPage, feedbackPage };
});
