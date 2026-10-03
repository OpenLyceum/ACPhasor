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

/** Tick labels on the scopes and frequency-response charts. */
export const TICK_LABEL_FONT = new PhetFont(10);

/** Phasor labels (V, I, R, X, Z, …) drawn beside their arrows. */
export const PHASOR_LABEL_FONT = new PhetFont({ size: 16, weight: "bold" });

/** The R, L and C letters over the pictorial circuit elements. */
export const ELEMENT_SYMBOL_FONT = new PhetFont({ size: 15, weight: "bold", style: "italic" });

/** Axis names on the phasor diagrams (Re, Im, P, Q). */
export const AXIS_LABEL_FONT = new PhetFont({ size: 14, style: "italic" });

/** Small italic symbols: the phase-arc angle and the circuit's current symbol. */
export const SYMBOL_FONT = new PhetFont({ size: 13, style: "italic" });
