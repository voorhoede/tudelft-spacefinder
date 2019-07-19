import deepFreeze from 'deep-freeze'
import fetchJson from './fetch-json'

/**
 * Load data in `filename`,
 * over http when on client
 * from disk when on server
 *
 * @param {string} filename - relative to `~/data/` directory
 * @returns {object} data
 */
export default function loadData(filename) {
  const fetchOrImportData = (process.client)
    ? fetchJson(`/data/${filename}`)
    : import(`~/static/data/${filename}`).then(result => result.default)

  return fetchOrImportData.then(deepFreeze)
}
