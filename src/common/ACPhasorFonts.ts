/**
 * ACPhasorFonts.ts
 *
 * The sim's text sizes in one place, so captions, readouts and control labels
 * stay consistent across screens. Kept apart from ACPhasorConstants because
 * the model imports that file and should not pull in scenery-phet.
 */

import { PhetFont } from "scenerystack/scenery-phet";

/** Captions above charts and diagrams, readout labels, and control titles. */
export const CAPTION_FONT = new PhetFont(14);

/** Emphasized captions, such as the "at resonance" banner. */
export const BOLD_CAPTION_FONT = new PhetFont({ size: 14, weight: "bold" });

/** Secondary captions and legend entries. */
export const SMALL_CAPTION_FONT = new PhetFont(12);

/** Text on large buttons, such as the frequency-sweep button. */
export const BUTTON_FONT = new PhetFont(16);
