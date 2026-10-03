/**
 * ACPhasorReadout.ts
 *
 * One "label  value" row for an info panel: a themed label next to a
 * {@link NumberDisplay} badge on the sim's light control surface. Stack several
 * in a `VBox` inside a {@link ACPhasorPanel} to build a readout panel.
 *
 * ── Usage ─────────────────────────────────────────────────────────────────────
 *
 *   new ACPhasorReadout( labels.impedanceStringProperty, impedanceProperty,
 *                   labels.ohmsPatternStringProperty, new Range( 0, 1000 ), 1 );
 */

import { DerivedProperty, type TReadOnlyProperty } from "scenerystack/axon";
import { type Range, toFixed } from "scenerystack/dot";
import { StringUtils } from "scenerystack/phetcommon";
import { HBox, Text } from "scenerystack/scenery";
import { NumberDisplay } from "scenerystack/scenery-phet";
import ACPhasorColors from "../../ACPhasorColors.js";
import { CAPTION_FONT } from "../ACPhasorFonts.js";

export class ACPhasorReadout extends HBox {
  /** "Label value unit", read by screen readers as the value changes. */
  private readonly accessibleTextProperty: TReadOnlyProperty<string>;

  public constructor(
    label: TReadOnlyProperty<string>,
    numberProperty: TReadOnlyProperty<number>,
    valuePattern: TReadOnlyProperty<string>,
    displayRange: Range,
    decimalPlaces: number,
  ) {
    super({
      spacing: 8,
      children: [
        new Text(label, {
          font: CAPTION_FONT,
          fill: ACPhasorColors.textColorProperty,
        }),
        new NumberDisplay(numberProperty, displayRange, {
          valuePattern,
          decimalPlaces,
          textOptions: {
            font: CAPTION_FONT,
            fill: ACPhasorColors.controlSurfaceTextColorProperty,
          },
          backgroundFill: ACPhasorColors.controlSurfaceColorProperty,
          backgroundStroke: ACPhasorColors.panelBorderColorProperty,
        }),
      ],
    });

    // The NumberDisplay is visual only, so mirror the row into the PDOM: without this
    // a screen reader has no access to the impedance, Q, bandwidth or power values.
    this.accessibleTextProperty = new DerivedProperty(
      [label, numberProperty, valuePattern],
      (labelText, value, pattern) =>
        `${labelText} ${StringUtils.fillIn(pattern, { value: toFixed(value, decimalPlaces) })}`,
    );
    this.accessibleParagraph = this.accessibleTextProperty;
  }

  /** The label and NumberDisplay link Properties this row does not own; release them. */
  public override dispose(): void {
    this.accessibleParagraph = null;
    this.accessibleTextProperty.dispose();
    for (const child of this.children) {
      child.dispose();
    }
    super.dispose();
  }
}
