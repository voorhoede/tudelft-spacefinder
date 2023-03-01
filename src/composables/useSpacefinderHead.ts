interface Props {
  title: string | ComputedRef<string>;
  description?: string | ComputedRef<string | undefined> | undefined;
  image?: OgImageProps | ComputedRef<OgImageProps | undefined> | undefined;
}

interface OgImageProps {
  url: string;
  width?: number;
  height?: number;
}

export default function useSpacefinderHead(props: Props | ComputedRef<Props>) {
  const { title, description, image } = unref(props);
  useHead({ title: computed(() => `${unref(title)} • TU Delft Spacefinder`) });

  useSeoMeta({
    ogTitle: title,
    description: description ?? null, // null removes the meta tag, while undefined does not
    ogDescription: description ?? null,
    ogImage: image ?? null,
  });
}
