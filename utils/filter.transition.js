import filterKeys from "../models/filter.transition-key";

export function setAllTransitionObject(obj, value = true) {
  for (const name of filterKeys) {
    obj[name] = value;
  }
  return obj;
}

export function setTransitionObject(obj, values) {
  for (const name of filterKeys) {
    obj[name] = values.indexOf(name) >= 0 ? true : false;
  }
  return obj;
}
