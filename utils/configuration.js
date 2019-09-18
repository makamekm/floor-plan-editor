/** The dimensioning unit for 2D floorplan measurements. */
export const configDimUnit = "dimUnit";

// WALL:

/** The initial wall height in cm. */
export const configWallHeight = "wallHeight";

/** The initial wall thickness in cm. */
export const configWallThickness = "wallThickness";

/** Configuration data loaded from/stored to extern. */
const data = {
  dimUnit: dimInch,
  wallHeight: 250,
  wallThickness: 10,
};

/** Set a configuration parameter. */
export function setValue(key, value) {
  data[key] = value;
}

/** Get a string configuration parameter. */
export function getStringValue(key) {
  switch (key) {
    case configDimUnit:
      return data[key];
    default:
      throw new Error("Invalid string configuration parameter: " + key);
  }
}

/** Get a numeric configuration parameter. */
export function getNumericValue(key) {
  switch (key) {
    case configWallHeight:
    case configWallThickness:
      return data[key];
    default:
      throw new Error("Invalid numeric configuration parameter: " + key);
  }
}
