import {matomoUrl, matomoSiteId} from '@/config'

console.log(matomoSiteId)
if (matomoSiteId) {
  var _paq = _paq || [];
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);

  (function() {
    var u=matomoUrl;
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', matomoSiteId]);
    var d=document,
      g=d.createElement('script'),
      s=d.getElementsByTagName('script')[0];
    g.type='text/javascript';
    g.defer=true;
    g.async=true;
    g.src=u+'piwik.js';
    s.parentNode.insertBefore(g,s);
  })();
}
