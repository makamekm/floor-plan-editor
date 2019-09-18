/** Dimensioning in Inch. */
export const dimInch = "inch";

/** Dimensioning in Meter. */
export const dimMeter = "m";

/** Dimensioning in Centi Meter. */
export const dimCentiMeter = "cm";

/** Dimensioning in Milli Meter. */
export const dimMilliMeter = "mm";

/** Converts cm to dimensioning string.
 * @param cm Centi meter value to be converted.
 * @returns String representation.
 */
export function cmToMeasure(cm) {
  switch (Core.Configuration.getStringValue(Core.configDimUnit)) {
    case dimInch:
      const realFeet = ((cm * 0.393700) / 12);
      const feet = Math.floor(realFeet);
      const inches = Math.round((realFeet - feet) * 12);
      return feet + "'" + inches + "\"";
    case dimMilliMeter:
      return "" + Math.round(10 * cm) + " mm";
    case dimCentiMeter:
      return "" + Math.round(10 * cm) / 10 + " cm";
    case dimMeter:
    default:
      return "" + Math.round(10 * cm) / 1000 + " m";
  }
}
