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

import type { TReadOnlyProperty } from "scenerystack/axon";
import type { Range } from "scenerystack/dot";
import { HBox, Text } from "scenerystack/scenery";
import { NumberDisplay } from "scenerystack/scenery-phet";
import ACPhasorColors from "../../ACPhasorColors.js";
import { CAPTION_FONT } from "../ACPhasorFonts.js";

export class ACPhasorReadout extends HBox {
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
  }
}
