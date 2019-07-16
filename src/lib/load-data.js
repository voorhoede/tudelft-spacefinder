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
  if (process.client) {
    return fetchJson(`/data/${filename}`)
            .then(deepFreeze)
  } else {
    return import(`~/static/data/${filename}`)
      .then(response => response.default)
      .then(deepFreeze)
  }
}
