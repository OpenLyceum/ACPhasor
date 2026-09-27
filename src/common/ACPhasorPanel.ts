/**
 * ACPhasorPanel.ts
 *
 * A pre-themed Panel that automatically uses ACPhasorColors for background and
 * border. Use this for all control panels and info boxes in the sim so that
 * default / projector mode switching is handled automatically.
 *
 * ── Basic usage ───────────────────────────────────────────────────────────────
 *
 *   import { ACPhasorPanel } from "../../common/ACPhasorPanel.js";
 *   import { VBox, Text } from "scenerystack/scenery";
 *
 *   const content = new VBox({
 *     children: [ new Text("label"), slider ],
 *     spacing: 8,
 *   });
 *   const panel = new ACPhasorPanel(content);
 *
 * ── Overriding defaults ───────────────────────────────────────────────────────
 *
 *   // Wider margins, sharper corners, custom stroke
 *   const panel = new ACPhasorPanel(content, { xMargin: 20, cornerRadius: 0 });
 *
 *   // Transparent background (decorative border only)
 *   const panel = new ACPhasorPanel(content, { fill: "transparent" });
 */

import { type EmptySelfOptions, optionize } from "scenerystack/phet-core";
import type { Node } from "scenerystack/scenery";
import { Panel, type PanelOptions } from "scenerystack/sun";
import ACPhasorColors from "../ACPhasorColors.js";
import { PANEL_CORNER_RADIUS } from "../ACPhasorConstants.js";

export type ACPhasorPanelOptions = PanelOptions;

export class ACPhasorPanel extends Panel {
  public constructor(content: Node, providedOptions?: ACPhasorPanelOptions) {
    const options = optionize<ACPhasorPanelOptions, EmptySelfOptions, PanelOptions>()(
      {
        fill: ACPhasorColors.panelBackgroundColorProperty,
        stroke: ACPhasorColors.panelBorderColorProperty,
        cornerRadius: PANEL_CORNER_RADIUS,
        xMargin: 12,
        yMargin: 10,
      },
      providedOptions,
    );
    super(content, options);
  }
}
