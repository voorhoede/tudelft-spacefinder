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
      { hid: 'og:title', name: 'og:title', content: title },
      description && { hid: 'description', name: 'description', content: description },
      description && { hid: 'og:description', name: 'og:description', content: description },
      image && { hid: 'og:image', name: 'og:image', content: image.url },
      image && { hid: 'og:image:width', name: 'og:image:width', content: image.width },
      image && { hid: 'og:image:height', name: 'og:image:height', content: image.height }
    ].filter(Boolean)
  }
}
