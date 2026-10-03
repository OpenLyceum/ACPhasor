/**
 * PhasorNode.ts
 *
 * Draws a single {@link Phasor} as an arrow in the complex plane, staying in
 * sync with a `Property<Phasor>`. The mapping from model coordinates
 * (real, imaginary) to view pixels is supplied as a {@link ModelViewTransform2},
 * so the same node works on any screen's diagram.
 *
 * By default the tail sits at the origin, which is what a phasor drawn on its own
 * wants. Pass a `tailProperty` to start the arrow somewhere else — that is how a
 * head-to-tail chain is built, where each phasor begins at the tip of the one
 * before it and the whole run closes onto a resultant (see
 * {@link PhasorChainNode}).
 *
 * `showProjection` adds the construction line that connects a rotating phasor to
 * the waveform it generates: a dashed drop from the tip to one of the axes, whose
 * length is the instantaneous value of the signal at that moment.
 *
 * ── Usage ─────────────────────────────────────────────────────────────────────
 *
 *   const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
 *     Vector2.ZERO, diagramCenter, pixelsPerUnit );
 *   const voltageArrow = new PhasorNode( model.voltagePhasorProperty, modelViewTransform, {
 *     fill: ACPhasorColors.resistorColorProperty,
 *     labelString: "V",
 *     showProjection: "real",
 *   } );
 */

import { DerivedProperty, Multilink, Property, type TReadOnlyProperty } from "scenerystack/axon";
import { Vector2 } from "scenerystack/dot";
import { optionize } from "scenerystack/phet-core";
import type { ModelViewTransform2 } from "scenerystack/phetcommon";
import { type Font, Line, Node, RichText, type TColor } from "scenerystack/scenery";
import { ArrowNode, type ArrowNodeOptions } from "scenerystack/scenery-phet";
import { PHASOR_LABEL_FONT } from "../ACPhasorFonts.js";
import type { Phasor } from "../model/Phasor.js";

/** Which axis a projection line drops to, or "none" for no construction line. */
export type PhasorProjection = "none" | "real" | "imaginary";

type PhasorNodeSelfOptions = {
  /** Fill color of the arrow (and its label). */
  fill?: TColor;
  /**
   * Optional short label drawn near the arrow tip. Rendered as `RichText`, so
   * markup works: `"V<sub>R</sub>"` gives a real subscript.
   */
  labelString?: string | TReadOnlyProperty<string> | null;
  /** Font used for the label. */
  labelFont?: Font;
  /** Explicit offset in view pixels from the tip to the label center; null auto-places it past the tip. */
  labelOffset?: Vector2 | null;
  /**
   * A model point the label should keep away from — the centroid of a closed
   * figure the arrow is a side of. While it holds a point, the label sits beside
   * the middle of the arrow, on the far side from that point, so labels of sides
   * that meet at a corner cannot land on each other. While it holds null (or is
   * omitted), the label sits past the tip as usual.
   */
  labelAwayFromProperty?: TReadOnlyProperty<Vector2 | null> | null;
  /**
   * Side to use when the arrow points straight through `labelAwayFromProperty`,
   * as every side does when the figure collapses onto one line: +1 puts the
   * label to the right of the arrow's direction on screen, −1 to the left.
   */
  labelTieBreakSide?: 1 | -1;
  /**
   * Where the arrow starts, in model coordinates. Null pins it to the origin,
   * which is the usual case; supply a Property to chain phasors head to tail.
   */
  tailProperty?: TReadOnlyProperty<Vector2> | null;
  /**
   * Draw a dashed line from the tip perpendicular onto an axis. "real" drops to
   * the horizontal axis, so its length reads as the phasor's projection there —
   * the instantaneous value of A·cos(ωt + φ).
   */
  showProjection?: PhasorProjection;
};

type PhasorNodeArrowOptions = Omit<ArrowNodeOptions, "fill" | "stroke">;

export type PhasorNodeOptions = PhasorNodeSelfOptions & PhasorNodeArrowOptions;

/** Gap in view pixels between a side-placed label and its arrow. */
const LABEL_GAP = 6;

export class PhasorNode extends Node {
  private readonly arrowNode: ArrowNode;
  private readonly updateMultilink: ReturnType<typeof Multilink.multilink>;
  /** The stand-in tail this node created, if it was not given one to use. */
  private readonly ownedTailProperty: Property<Vector2> | null;
  /** The stand-in keep-away point this node created, if it was not given one. */
  private readonly ownedAwayFromProperty: Property<Vector2 | null> | null;

  public constructor(
    phasorProperty: TReadOnlyProperty<Phasor>,
    modelViewTransform: ModelViewTransform2,
    providedOptions?: PhasorNodeOptions,
  ) {
    const options = optionize<PhasorNodeOptions, PhasorNodeSelfOptions, PhasorNodeArrowOptions>()(
      {
        fill: "black" as TColor,
        labelString: null as string | TReadOnlyProperty<string> | null,
        labelFont: PHASOR_LABEL_FONT,
        labelOffset: null as Vector2 | null,
        labelAwayFromProperty: null as TReadOnlyProperty<Vector2 | null> | null,
        labelTieBreakSide: 1 as 1 | -1,
        tailProperty: null as TReadOnlyProperty<Vector2> | null,
        showProjection: "none" as PhasorProjection,
        tailWidth: 3,
        headWidth: 12,
        headHeight: 12,
      },
      providedOptions,
    );

    super();

    const modelOrigin = modelViewTransform.modelToViewPosition(Vector2.ZERO);

    // The projection line is drawn first so the arrow paints over it where they
    // meet at the tip.
    const projectionLine =
      options.showProjection === "none"
        ? null
        : new Line(0, 0, 0, 0, {
            stroke: options.fill,
            lineWidth: 1,
            lineDash: [3, 3],
            opacity: 0.7,
          });
    if (projectionLine) {
      this.addChild(projectionLine);
    }

    this.arrowNode = new ArrowNode(modelOrigin.x, modelOrigin.y, modelOrigin.x, modelOrigin.y, {
      fill: options.fill,
      stroke: options.fill,
      tailWidth: options.tailWidth,
      headWidth: options.headWidth,
      headHeight: options.headHeight,
      // Keep a proportional head even when the arrow is short.
      isHeadDynamic: true,
      fractionalHeadHeight: 0.5,
    });
    this.addChild(this.arrowNode);

    let labelNode: RichText | null = null;
    if (options.labelString !== null) {
      labelNode = new RichText(options.labelString, {
        font: options.labelFont,
        fill: options.fill,
      });
      this.addChild(labelNode);
    }

    const labelOffset = options.labelOffset;
    const labelTieBreakSide = options.labelTieBreakSide;
    const showProjection = options.showProjection;

    // A phasor with no tail Property never moves its tail, but binding through a
    // constant Property keeps one update path instead of two. It must be a plain
    // Property rather than one derived from `phasorProperty`: deriving would put
    // a second listener on the caller's Property that outlives this node.
    let ownedTailProperty: Property<Vector2> | null = null;
    let tailProperty: TReadOnlyProperty<Vector2>;
    if (options.tailProperty) {
      tailProperty = options.tailProperty;
    } else {
      ownedTailProperty = new Property(Vector2.ZERO);
      tailProperty = ownedTailProperty;
    }
    this.ownedTailProperty = ownedTailProperty;

    // Same constant-Property trick for the label's keep-away point.
    let ownedAwayFromProperty: Property<Vector2 | null> | null = null;
    let awayFromProperty: TReadOnlyProperty<Vector2 | null>;
    if (options.labelAwayFromProperty) {
      awayFromProperty = options.labelAwayFromProperty;
    } else {
      ownedAwayFromProperty = new Property<Vector2 | null>(null);
      awayFromProperty = ownedAwayFromProperty;
    }
    this.ownedAwayFromProperty = ownedAwayFromProperty;

    // A zero phasor (e.g. the current with a 0 V source) has nothing to show:
    // hide the arrow head, label and projection rather than leave a stray head.
    const drawnParts = [this.arrowNode, labelNode, projectionLine].filter((part) => part !== null);
    const setDrawn = (drawn: boolean): void => {
      for (const part of drawnParts) {
        part.visible = drawn;
      }
    };

    this.updateMultilink = Multilink.multilink(
      [phasorProperty, tailProperty, awayFromProperty],
      (phasor, modelTail, modelAwayFrom) => {
        const tail = modelViewTransform.modelToViewPosition(modelTail);
        const tip = modelViewTransform.modelToViewPosition(modelTail.plus(phasor.toVector2()));
        this.arrowNode.setTailAndTip(tail.x, tail.y, tip.x, tip.y);

        setDrawn(phasor.amplitude > 0);

        if (projectionLine) {
          // Drop onto the axis through the phasor's own tail, so a chained phasor
          // projects against where it starts rather than against the origin.
          const foot = showProjection === "real" ? new Vector2(tip.x, tail.y) : new Vector2(tail.x, tip.y);
          projectionLine.setLine(tip.x, tip.y, foot.x, foot.y);
        }

        if (labelNode) {
          const direction = tip.minus(tail);
          if (labelOffset) {
            labelNode.center = tip.plus(labelOffset);
          } else if (modelAwayFrom && direction.magnitude > 1e-6) {
            // Beside the middle of the side, outward. On screen (y down), the
            // perpendicular (−dy, dx) is to the right of the arrow's direction.
            const midpoint = tail.average(tip);
            const right = new Vector2(-direction.y, direction.x).normalized();
            const outward = midpoint.minus(modelViewTransform.modelToViewPosition(modelAwayFrom)).dot(right);
            const side = Math.abs(outward) > 1e-3 ? Math.sign(outward) : labelTieBreakSide;
            const normal = right.timesScalar(side);
            // Clear the label's own half-extent along the normal, plus a gap.
            const clearance =
              LABEL_GAP + 0.5 * (Math.abs(normal.x) * labelNode.width + Math.abs(normal.y) * labelNode.height);
            labelNode.center = midpoint.plus(normal.timesScalar(clearance));
          } else {
            // Nudge the label just beyond the tip, along the arrow direction.
            const push = direction.magnitude > 1e-6 ? direction.normalized().timesScalar(14) : Vector2.ZERO;
            labelNode.center = tip.plus(push);
          }
        }
      },
    );
  }

  public override dispose(): void {
    this.updateMultilink.dispose();
    this.ownedTailProperty?.dispose();
    this.ownedAwayFromProperty?.dispose();
    super.dispose();
  }
}

/**
 * Convenience: a derived Property that projects the tip of a phasor to view
 * coordinates, handy when other nodes must track the same point.
 */
export function phasorTipViewProperty(
  phasorProperty: TReadOnlyProperty<Phasor>,
  modelViewTransform: ModelViewTransform2,
): TReadOnlyProperty<Vector2> {
  return new DerivedProperty([phasorProperty], (phasor) => modelViewTransform.modelToViewPosition(phasor.toVector2()));
}
