/**
 * Simple helper to fetch attribute on given css selector
 */
function _attr(selector, name) {
    const el = document.querySelector(selector);
    return el ? el.getAttribute(name) : undefined;
}

/**
 * Simple helper to <meta/> tag content given its name
 */
function _meta(name) {
    return _attr(`meta[name=${name}]`, 'content');
}

export const csvapiUrl = process.env.VUE_APP_CSVAPI_URL || _meta('csvapi-url');
export const pageSize = _meta('page-size') || 10;
