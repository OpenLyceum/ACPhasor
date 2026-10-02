/**
 * formatCaption.ts
 *
 * Joins a formatted number to its unit, and a symbol to its value, through the
 * localized patterns rather than string concatenation, so a translation can
 * reorder or respace them. Degrees stay tight against the number ("31.5°"),
 * as every other degree readout in the sim is written.
 */

import { StringUtils } from "scenerystack/phetcommon";
import { StringManager } from "../../i18n/StringManager.js";

const DEGREES = "°";

/** "0.43 A", "31.5°", or just the value when there is no unit. */
export function formatValueWithUnits(value: string, units: string | null): string {
  if (units === null || units === "") {
    return value;
  }
  const labels = StringManager.getInstance().getLabels();
  return units === DEGREES
    ? StringUtils.fillIn(labels.degreesPatternStringProperty.value, { value: value })
    : StringUtils.fillIn(labels.valueUnitsPatternStringProperty.value, { value: value, units: units });
}

/** "|I| 0.43 A": a quantity's symbol followed by its value. */
export function formatSymbolValue(symbol: string, value: string): string {
  return StringUtils.fillIn(StringManager.getInstance().getLabels().symbolValuePatternStringProperty.value, {
    symbol: symbol,
    value: value,
  });
}
