export function getQueryVariables(url) {
  const query = url.split("?")[1] || "";
  const couples = query.split("&").filter(s => !!s);
  let result = {};
  let pair;
  for (let couple of couples) {
    pair = couple.split("=");
    result[pair[0]] = decodeURIComponent(pair[1]);
  }
  return result;
}
