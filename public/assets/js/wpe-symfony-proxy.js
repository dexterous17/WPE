/**
 * Routes legacy Symfony endpoints through the Node BFF (/api/symfony/*).
 * Set window.WPE_NODE_API_BASE when the API is on another origin (e.g. http://127.0.0.1:3001).
 * Leave empty for same-origin (Docker Apache → Node).
 */
(function (global) {
  var PREFIX = "/api/symfony";

  function backendBase() {
    var b =
      typeof global.WPE_NODE_API_BASE === "string"
        ? global.WPE_NODE_API_BASE.replace(/\/$/, "")
        : "";
    return b + PREFIX;
  }

  global.wpeSymfonyProxyUrl = function wpeSymfonyProxyUrl(urlOrPath) {
    if (!urlOrPath) {
      return urlOrPath;
    }
    var path = urlOrPath;
    if (/^https?:\/\//i.test(urlOrPath)) {
      try {
        var u = new URL(urlOrPath);
        if (
          typeof global.location !== "undefined" &&
          u.origin === global.location.origin
        ) {
          path = u.pathname + u.search;
        } else {
          return urlOrPath;
        }
      } catch (e) {
        return urlOrPath;
      }
    }
    if (path.indexOf("/") !== 0) {
      path = "/" + path;
    }
    if (path.indexOf(PREFIX + "/") === 0 || path === PREFIX) {
      return (typeof global.WPE_NODE_API_BASE === "string"
        ? global.WPE_NODE_API_BASE.replace(/\/$/, "")
        : "") + path;
    }
    return backendBase() + path;
  };
})(typeof window !== "undefined" ? window : globalThis);
