const withQuery = (url, params) => {
  let query = Object.keys(params)
    .filter(k => params[k] !== undefined)
    .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
  url += (url.indexOf("?") === -1 ? "?" : "&") + query;
  return url;
};

export default function fetch2(url, options = {}) {
  options = {
    credentials: "same-origin",
    redirect: "error",
    ...options,
  };

  if (options.queryParams) {
    url = withQuery(url, options.queryParams);
    delete options.queryParams;
  }

  return fetch(url, options);
}
