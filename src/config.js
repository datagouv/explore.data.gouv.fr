/**
 * Simple helper to fetch attribute on given css selector
 */
function _attr(selector, name) {
  const el = document.querySelector(selector)
  return el ? el.getAttribute(name) : undefined
}

/**
 * Simple helper to <meta/> tag content given its name
 */
function _meta(name) {
  return _attr(`meta[name=${name}]`, 'content')
}

export const csvapiUrl = process.env.VUE_APP_CSVAPI_URL || _meta('csvapi-url')
export const pageSize = _meta('page-size') || 10
export const dataGouvUrl = "https://www.data.gouv.fr/fr/"

/**
 * @param {string} id
 */
export function getResourceUrl(id) {
  return dataGouvUrl + 'datasets/r/' + id
}

/**
 * @param {string} path
 */
export function getDataGouvUrl(path) {
  return dataGouvUrl + path
}

let _filtersEnabled = process.env.VUE_APP_FILTERS_ENABLED || _meta('filters-enabled')
try {
  _filtersEnabled = JSON.parse(_filtersEnabled)
} catch {
  _filtersEnabled = false
}
export const filtersEnabled = _filtersEnabled
