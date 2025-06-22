// utils/apiHelper.js
export function extractData(promise) {
  return promise.then((res) => res.data.data);
}
