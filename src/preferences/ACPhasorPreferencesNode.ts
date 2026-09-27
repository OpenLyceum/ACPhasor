import { Node } from "scenerystack/scenery";
import ACPhasorNamespace from "../ACPhasorNamespace.js";

/** Empty conventional preferences node; the sim currently uses only framework preferences. */
export class ACPhasorPreferencesNode extends Node {}

ACPhasorNamespace.register("ACPhasorPreferencesNode", ACPhasorPreferencesNode);
