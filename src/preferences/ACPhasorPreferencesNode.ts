/**
 * ACPhasorPreferencesNode.ts
 *
 * Custom preferences UI shown in Preferences → Simulation. Currently empty —
 * add controls here when the sim gains real preferences.
 */

import { Text, VBox } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import type { Tandem } from "scenerystack/tandem";
import ACPhasorColors from "../ACPhasorColors.js";
import ACPhasorNamespace from "../ACPhasorNamespace.js";
import { StringManager } from "../i18n/StringManager.js";
import type { ACPhasorPreferencesModel } from "./ACPhasorPreferencesModel.js";

/** Preferences dialog content sits on a light background regardless of color profile. */
const PREFERENCES_TEXT_FILL = ACPhasorColors.controlSurfaceTextColorProperty;

export class ACPhasorPreferencesNode extends VBox {
  public constructor(_preferencesModel: ACPhasorPreferencesModel, _tandem?: Tandem) {
    const prefStrings = StringManager.getInstance().getPreferences();

    const header = new Text(prefStrings.titleStringProperty, {
      font: new PhetFont({ size: 18, weight: "bold" }),
      fill: PREFERENCES_TEXT_FILL,
    });

    super({
      align: "left",
      spacing: 12,
      children: [header],
    });
  }
}

ACPhasorNamespace.register("ACPhasorPreferencesNode", ACPhasorPreferencesNode);
