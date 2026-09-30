/**
 * SeriesRlcKeyboardHelpContent.ts
 *
 * Keyboard-help dialog content for the Series RLC screen. R, L, C, the source
 * voltage and the frequency are all sliders, so the slider section joins the
 * basic actions. The configurable graph is keyboard-draggable, so that drag is
 * documented here too.
 */
import {
  BasicActionsKeyboardHelpSection,
  MoveDraggableItemsKeyboardHelpSection,
  SliderControlsKeyboardHelpSection,
  TwoColumnKeyboardHelpContent,
} from "scenerystack/scenery-phet";

export class SeriesRlcKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {
    // The configurable graph pans with a RichDragListener. That listener owns the
    // arrow keys while the plot is focused; sliders own them while a slider is focused.
    super(
      [new SliderControlsKeyboardHelpSection(), new MoveDraggableItemsKeyboardHelpSection()],
      [new BasicActionsKeyboardHelpSection()],
    );
  }
}
