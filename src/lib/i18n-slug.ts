import { Building } from "~/types/Building";
import { Space } from "~/types/Space";

// pick the slug for the current locale from a building or a space object
export function i18nSlug(lang: string, obj: Building | Space | undefined) {
  return obj ? ((obj.i18n || {})[lang] || {}).slug : undefined;
}
