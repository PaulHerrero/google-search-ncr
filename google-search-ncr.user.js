// ==UserScript==
// @name         Google Search NCR
// @namespace    https://github.com/userscripts
// @version      1.0.0
// @description  Force Google search pages to use www.google.com without country redirection.
// @author       Codex
// @include      /^https:\/\/(?:www\.)?google\.[a-z.]+\/(?:$|webhp(?:[?#].*)?$|search(?:[/?#].*)?$|ncr(?:[/?#].*)?$)/
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const STATE_PREFIX = '__google_search_ncr__:';
  const DONE_STATE = '__google_search_ncr_done__';
  const HASH_PREFIX = '#google-search-ncr=';
  const NCR_URL = 'https://www.google.com/ncr';
  const GOOGLE_COM_HOST = 'www.google.com';

  const currentUrl = new URL(window.location.href);
  const isGoogleCom = ['google.com', GOOGLE_COM_HOST].includes(currentUrl.hostname);
  const isSearchPage = ['/', '/webhp', '/search'].includes(currentUrl.pathname);
  const isNcrPage = currentUrl.pathname === '/ncr';

  if (!isSearchPage && !isNcrPage) {
    return;
  }

  function readState() {
    let rawState = null;

    if (window.name.startsWith(STATE_PREFIX)) {
      rawState = window.name.slice(STATE_PREFIX.length);
    } else if (window.location.hash.startsWith(HASH_PREFIX)) {
      try {
        rawState = decodeURIComponent(window.location.hash.slice(HASH_PREFIX.length));
      } catch {
        return null;
      }
    }

    if (!rawState) {
      return null;
    }

    try {
      const state = JSON.parse(rawState);
      const targetUrl = new URL(state.targetUrl);
      const validPath = ['/', '/webhp', '/search'].includes(targetUrl.pathname);

      if (targetUrl.protocol !== 'https:' || targetUrl.hostname !== GOOGLE_COM_HOST || !validPath) {
        throw new Error('Invalid NCR return URL');
      }

      return { targetUrl: targetUrl.href };
    } catch {
      window.name = '';
      return null;
    }
  }

  function writeState(targetUrl) {
    const serialized = JSON.stringify({ targetUrl });
    window.name = STATE_PREFIX + serialized;
    return NCR_URL + HASH_PREFIX + encodeURIComponent(serialized);
  }

  function clearState() {
    window.name = '';
  }

  function markDone() {
    window.name = DONE_STATE;
  }

  function canonicalSearchUrl(url) {
    const canonical = new URL(url.href);
    canonical.protocol = 'https:';
    canonical.hostname = GOOGLE_COM_HOST;
    canonical.port = '';
    return canonical.href;
  }

  const state = readState();

  // Let Google's /ncr endpoint set the preference cookie and perform its redirect.
  if (isNcrPage) {
    return;
  }

  if (isGoogleCom && state?.targetUrl) {
    const targetUrl = new URL(state.targetUrl);
    clearState();
    markDone();

    if (currentUrl.href !== targetUrl.href) {
      window.location.replace(targetUrl.href);
    }
    return;
  }

  if (window.name === DONE_STATE) {
    return;
  }

  const ncrUrl = writeState(canonicalSearchUrl(currentUrl));
  window.location.replace(ncrUrl);
})();
