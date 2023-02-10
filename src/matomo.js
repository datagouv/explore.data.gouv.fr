import {matomoUrl, matomoSiteId} from '@/config'

if (matomoSiteId) {
  var _paq = window._paq = window._paq || [];
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);

  (function() {
    var u=matomoUrl;
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', matomoSiteId]);
    var d=document,
      g=d.createElement('script'),
      s=d.getElementsByTagName('script')[0];
    g.async=true;
    g.src=u+'matomo.js';
    s.parentNode.insertBefore(g,s);
  })();
}
