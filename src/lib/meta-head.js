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
export default function ({ title, description, image }) {
  return {
    title: `${title} • TU Delft Spacefinder`,
    meta: [
      { hid: 'og:title', property: 'og:title', content: title },
      description && { hid: 'description', name: 'description', content: description },
      description && { hid: 'og:description', property: 'og:description', content: description },
      image && { hid: 'og:image', property: 'og:image', content: image.url },
      image && { hid: 'og:image:width', property: 'og:image:width', content: image.width },
      image && { hid: 'og:image:height', property: 'og:image:height', content: image.height }
    ].filter(Boolean)
  }
}
