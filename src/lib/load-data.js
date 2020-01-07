/**
 * Load data in `filename`,
 * over http when on client
 * from disk when on server
 *
 * @param {string} filename - relative to `~/data/` directory
 * @returns {object} data
 */
export default function loadData(filename) {
  return import(`~/static/data/${filename}`).then(module => module.default)
}
