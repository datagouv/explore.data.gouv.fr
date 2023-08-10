/**
 * @typedef CsvapiFilter
 * @property {string} field
 * @property {string} value
 * @property {string} comp
 */

/**
 * @typedef CsvapiRequestConfiguration
 * @property {string?} csvapiUrl - URL used to apify resource
 * @property {string?} dataEndpoint - URL used to get resource data
 * @property {Array<CsvapiFilter>} filters - Filters applied to resource data
 * @property {number} page
 * @property {number} pageSize
 * @property {string?} sortBy
 * @property {boolean} sortDesc
 * @property {number} totalRows
 */

/**
 * @typedef CsvapiApifyResponse
 * @property {boolean} ok
 * @property {string} endpoint - Endpoint to use for {@link CsvapiRequestConfiguration.dataEndpoint}
 */

/**
 * @typedef CsvapiResponse 
 * @property {Array<string>} columns - array of column names
 * @property {object} columns_infos
 * @property {object} general_infos
 * @property {boolean} ok
 * @property {number} query_ms
 * @property {Array<object>} rows
 * @property {number} total
 */

/** @type {CsvapiRequestConfiguration} */
let config = {
    csvapiUrl: null,
    dataEndpoint: null,
    filters: [],
    page: 1,
    pageSize: 10,
    sortBy: null,
    sortDesc: false,
    totalRows: 0,
}

/**
 * Update configuration object
 * @param {object} options - (see {@link CsvapiRequestConfiguration})
 */
export function configure(options) {
    config = { ...config, ...options }
}

/**
 * Change page and load data
 * @param {number} page
 * @returns {Promise<CsvapiResponse> | void} csvapi response (see {@link CsvapiResponse})
 */
export function changePage(page) {
    config.page = page
    if ((config.page - 1) <= config.totalRows / config.pageSize) {
        return getData('page')
    }
}

/**
 * 
 * @param {string} sortBy 
 * @param {boolean} [sortDesc=false]
 * @returns {Promise<CsvapiResponse>} csvapi response (see {@link CsvapiResponse})
 */
export function sort(sortBy, sortDesc = false) {
    config.sortBy = sortBy
    config.sortDesc = sortDesc
    return getData('sort')
}

/**
 * 
 * @param {string} action 
 */
export function makeDataUrl(action) {
    let offset = 0
    if (action && action === 'page') {
        offset = config.pageSize * (config.page - 1)
    }
    else {
        config.page = 1
    }
    if (!config.dataEndpoint) {
        throw Error("No dataEndpoint configured. Use configure() before to add it.")
    }
    const dataUrl = new URL(config.dataEndpoint)
    dataUrl.searchParams.set('_shape', 'objects')
    dataUrl.searchParams.set('_rowid', 'hide')
    dataUrl.searchParams.set('_size', config.pageSize.toString())
    dataUrl.searchParams.set('_offset', offset.toString())
    config.filters.forEach(({ field, value, comp }) => {
        dataUrl.searchParams.set(`${field}__${comp}`, value)
    })
    if (config.sortBy) {
        const param = config.sortDesc ? '_sort_desc' : '_sort'
        dataUrl.searchParams.set(param, config.sortBy)
    }
    return dataUrl
}

/**
 * Get data from {@link makeDataUrl} according to specified action
 * @param {string} action - Action to do
 * @returns {Promise<CsvapiResponse>} csvapi response (see {@link CsvapiResponse})
 */
export function getData(action) {
    const dataUrl = makeDataUrl(action)
    return fetch(dataUrl.toString()).then(res => {
        const json = res.json()
        if (!res.ok) {
            Promise.reject(json)
        }
        return json
    })
}
/**
 * 
 * @param {string} url 
 * @returns {Promise<CsvapiApifyResponse>} csvapi response (see {@link CsvapiApifyResponse})
 */
export function apify(url) {
    if (!config.csvapiUrl) {
        throw Error("No csvapiUrl configured. Use configure() before to add it.")
    }
    const apiUrl = new URL(config.csvapiUrl)
    apiUrl.pathname = '/apify'
    apiUrl.searchParams.set('url', encodeURI(url))
    apiUrl.searchParams.set('analysis', 'yes')
    return fetch(apiUrl.toString()).then(res => {
        const json = res.json()
        if (!res.ok) {
            Promise.reject(json)
        }
        return json;
    })
}

export function apifyWithoutAnalysis(url) {
    if (!config.csvapiUrl) {
        throw Error("No csvapiUrl configured. Use configure() before to add it.")
    }
    const apiUrl = new URL(config.csvapiUrl)
    apiUrl.pathname = '/apify'
    apiUrl.searchParams.set('url', encodeURI(url))
    return fetch(apiUrl.toString()).then(res => {
        const json = res.json()
        if (!res.ok) {
            Promise.reject(json)
        }
        return json;
    })
}