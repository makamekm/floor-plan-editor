import { dimMeter, dimInch, dimMilliMeter, dimCentiMeter } from "./dimensioning";

// GENERAL:

/** The dimensioning unit for 2D floorplan measurements. */
export const configDimUnit = "dimUnit";

/** The dpr unit to scale the application */
export const configDpr = "dpr";

/** Firebase */
export const configApiKey = "apiKey";

/** Firebase */
export const configAuthDomain = "authDomain";

// WALL:

/** The initial wall thickness in cm. */
export const configWallThickness = "wallThickness";

/** Global configuration to customize the whole system.  */
export class Configuration {
  /** Configuration data loaded from/stored to extern. */
  private static data: {[key: string]: any} = {
    [configApiKey]: 'AIzaSyASRwAqeD-9Fdo6m0VsDaN4GznhZ4ygfRU',
    [configAuthDomain]: 'localhost',
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
      case configApiKey:
      case configAuthDomain:
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

  /** Converts cm to dimensioning string.
   * @param cm Centi meter value to be converted.
   * @returns String representation.
   */
  public static cmToMeasure(cm: number): string {
    switch (Configuration.getStringValue(configDimUnit)) {
      case dimInch:
        const realFeet = ((cm * 0.393700) / 12);
        const feet = Math.floor(realFeet);
        const inches = Math.round((realFeet - feet) * 12);
        return feet + "'" + inches + '"';
      case dimMilliMeter:
        return "" + Math.round(10 * cm) + " mm";
      case dimCentiMeter:
        return "" + Math.round(10 * cm) / 10 + " cm";
      case dimMeter:
      default:
        return "" + Math.round(10 * cm) / 1000 + " m";
    }
  }
}