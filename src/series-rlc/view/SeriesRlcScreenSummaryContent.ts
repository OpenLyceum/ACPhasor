/**
 * SeriesRlcScreenSummaryContent.ts
 *
 * Accessible screen summary for the Series RLC screen. The current-details
 * sentence is live: it reports whether the circuit is currently inductive,
 * capacitive, or at resonance, based on the net reactance.
 */
import { DerivedProperty, type ReadOnlyProperty } from "scenerystack/axon";
import { ScreenSummaryContent } from "scenerystack/sim";
import { StringManager } from "../../i18n/StringManager.js";
import type { SeriesRlcModel } from "../model/SeriesRlcModel.js";

export class SeriesRlcScreenSummaryContent extends ScreenSummaryContent {
  /** Live current-details sentence; derived here, so disposed here. */
  private readonly currentDetailsProperty: ReadOnlyProperty<string>;

  public constructor(model: SeriesRlcModel) {
    const a11y = StringManager.getInstance().getSeriesRlcA11yStrings();

    // The model decides what counts as resonance, so this sentence and the
    // on-screen badge can never disagree about it.
    const currentDetails = new DerivedProperty(
      [
        model.reactanceProperty,
        model.isAtResonanceProperty,
        a11y.currentDetails.inductiveStringProperty,
        a11y.currentDetails.capacitiveStringProperty,
        a11y.currentDetails.resonantStringProperty,
      ],
      (reactance, isAtResonance, inductive, capacitive, resonant) => {
        if (isAtResonance) {
          return resonant;
        }
        return reactance > 0 ? inductive : capacitive;
      },
    );

    super({
      playAreaContent: a11y.screenSummary.playAreaStringProperty,
      controlAreaContent: a11y.screenSummary.controlAreaStringProperty,
      currentDetailsContent: currentDetails,
      interactionHintContent: a11y.screenSummary.interactionHintStringProperty,
    });
    this.currentDetailsProperty = currentDetails;
  }

  public override dispose(): void {
    this.currentDetailsProperty.dispose();
    super.dispose();
  }
}
