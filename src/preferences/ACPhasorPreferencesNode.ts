/**
 * ACPhasorPreferencesNode.ts
 *
 * Custom preferences UI shown in Preferences → Simulation. Currently empty —
 * add controls here when the sim gains real preferences.
 */

import { Node } from "scenerystack/scenery";
import type { Tandem } from "scenerystack/tandem";
import ACPhasorNamespace from "../ACPhasorNamespace.js";
import type { ACPhasorPreferencesModel } from "./ACPhasorPreferencesModel.js";

/** Empty conventional preferences node; the sim currently uses only framework preferences. */
export class ACPhasorPreferencesNode extends Node {
  public constructor(_preferencesModel: ACPhasorPreferencesModel, _tandem?: Tandem) {
    super();
  }
}

ACPhasorNamespace.register("ACPhasorPreferencesNode", ACPhasorPreferencesNode);
