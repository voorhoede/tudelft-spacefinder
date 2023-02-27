/**
 * Generate document head object for Nuxt.
 *
 * @see https://nuxtjs.org/api/pages-head
 *
 * @param {Object} meta
 * @param {String} meta.title
 * @param {String} [meta.description]
 * @param {Object} [meta.image]
 * @param {String} [meta.image.url]
 * @param {Number} [meta.image.width]
 * @param {Number} [meta.image.height]
 */
export default function ({
  title,
  description,
  image,
}: {
  title: string;
  description?: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
  };
}) {
  const meta = [{ hid: "og:title", property: "og:title", content: title }] as {
    hid: string;
    property?: string;
    name?: string; //TODO: all good here?
    content: string;
  }[];
  if (description) {
    meta.push({
      hid: "description",
      name: "description",
      content: description,
    });
    meta.push({
      hid: "og:description",
      property: "og:description",
      content: description,
    });
  }
  if (image) {
    meta.push({ hid: "og:image", property: "og:image", content: image.url });
    if (image.width)
      meta.push({
        hid: "og:image:width",
        property: "og:image:width",
        content: image.width.toString(),
      });
    if (image.height)
      meta.push({
        hid: "og:image:height",
        property: "og:image:height",
        content: image.height?.toString(),
      });
  }
  return {
    title: `${title} • TU Delft Spacefinder`,
    meta: meta,
  };
}
