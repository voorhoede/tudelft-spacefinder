/**
 * Fetch JSON from `url`.
 *
 * adapted from http://youmightnotneedjquery.com/#json
 *
 * @param {String} url
 * @returns {Promise} resolved with JSON from response
 */
export default function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        try {
          const json = JSON.parse(request.responseText)
          resolve(json)
        } catch (error) {
          reject(error)
        }
      } else {
        reject(request)
      }
    }
    request.onerror = () => reject(request)
    request.send()
  })
}
