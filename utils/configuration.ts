import { dimCentiMeter, dimInch, dimMeter, dimMilliMeter } from "./dimensioning";

// GENERAL:

/** The dimensioning unit for 2D floorplan measurements. */
export const configDimUnit = "dimUnit";

/** The dpr unit to scale the application */
export const configDpr = "dpr";

/** Firebase */
export const configApiKey = "apiKey";

/** Firebase */
export const configAuthDomain = "authDomain";

/** Firebase */
export const configDatabaseURL = "databaseURL";

/** Firebase */
export const configProjectId = "projectId";

/** Firebase */
export const configStorageBucket = "storageBucket";

/** Firebase */
export const configMessagingSenderId = "messagingSenderId";

/** Firebase */
export const configAppId = "appId";

/** Firebase */
export const configMeasurementId = "measurementId";

// WALL:

/** The initial wall thickness in cm. */
export const configWallThickness = "wallThickness";

/** Global configuration to customize the whole system.  */
export class Configuration {

  /** Set a configuration parameter. */
  public static setValue(key: string, value: string | number) {
    this.data[key] = value;
  }

  /** Get a string configuration parameter. */
  public static getStringValue(key: string): string {
    switch (key) {
      case configApiKey:
      case configAuthDomain:
      case configDatabaseURL:
      case configProjectId:
      case configStorageBucket:
      case configMessagingSenderId:
      case configAppId:
      case configMeasurementId:
      case configDimUnit:
        return this.data[key] as string;
      default:
        throw new Error("Invalid string configuration parameter: " + key);
    }
  }

  /** Get a numeric configuration parameter. */
  public static getNumericValue(key: string): number {
    switch (key) {
      case configDpr:
      case configWallThickness:
        return this.data[key] as number;
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
  /** Configuration data loaded from/stored to extern. */
  private static data: {[key: string]: any} = {
    [configApiKey]: "AIzaSyASRwAqeD-9Fdo6m0VsDaN4GznhZ4ygfRU",
    [configAuthDomain]: "localhost",
    [configDatabaseURL]: "https://floorplan-makamekm.firebaseio.com",
    [configProjectId]: "floorplan-makamekm",
    [configStorageBucket]: "floorplan-makamekm.appspot.com",
    [configMessagingSenderId]: "960620520456",
    [configAppId]: "1:960620520456:web:9a31aa6aa8ed2966479dbd",
    [configMeasurementId]: "G-84Z0YDFX18",
    [configDimUnit]: dimMeter,
    [configWallThickness]: 14,
    [configDpr]: process.browser ? (window.devicePixelRatio || 1) : 1,
  };
}
