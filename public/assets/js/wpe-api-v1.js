/**
 * Versioned JSON API base path. Same-origin /api/v1 when Apache proxies /api to Node.
 */
(function (global) {
  var V1 = "/api/v1";

  global.wpeApiV1Url = function wpeApiV1Url(path) {
    var p = path.indexOf("/") === 0 ? path : "/" + path;
    var base =
      typeof global.WPE_NODE_API_BASE === "string"
        ? global.WPE_NODE_API_BASE.replace(/\/$/, "")
        : "";
    return base + V1 + p;
  };
})(typeof window !== "undefined" ? window : globalThis);
