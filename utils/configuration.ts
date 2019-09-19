import { dimMeter } from "./dimensioning";

// GENERAL:

/** The dimensioning unit for 2D floorplan measurements. */
export const configDimUnit = "dimUnit";

/** The dpr unit to scale the application */
export const configDpr = "dpr";

// WALL:

/** The initial wall thickness in cm. */
export const configWallThickness = "wallThickness";

/** Global configuration to customize the whole system.  */
export class Configuration {
  /** Configuration data loaded from/stored to extern. */
  private static data: {[key: string]: any} = {
    [configDimUnit]: dimMeter,
    [configWallThickness]: 14,
    [configDpr]: process.browser ? (window.devicePixelRatio || 1) : 1,
  };

  /** Set a configuration parameter. */
  public static setValue(key: string, value: string | number) {
    this.data[key] = value;
  }

  /** Get a string configuration parameter. */
  public static getStringValue(key: string): string {
    switch (key) {
      case configDimUnit:
        return <string>this.data[key];
      default:
        throw new Error("Invalid string configuration parameter: " + key);
    }
  }

  /** Get a numeric configuration parameter. */
  public static getNumericValue(key: string): number {
    switch (key) {
      case configDpr:
      case configWallThickness:
        return <number>this.data[key];
      default:
        throw new Error("Invalid numeric configuration parameter: " + key);
    }
  }
}