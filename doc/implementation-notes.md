# Implementation Notes - AC Phasor

An AC phasor simulation with resistor (R), inductor (L), and capacitor (C) across
four screens: Intro, Series RLC, Resonance, and Power. Screens 2–4 share
`RlcCircuitModel` for the series loop.

## Architecture Overview

```
main.ts
  ├─ IntroScreen              (single component + rotating phasor clock)
  │    ├─ IntroModel
  │    └─ IntroScreenView
  ├─ SeriesRlcScreen          (series RLC + voltage / impedance triangles)
  │    ├─ SeriesRlcModel
  │    └─ SeriesRlcScreenView
  ├─ ResonanceScreen          (frequency sweep + resonance-peak curves)
  │    ├─ ResonanceModel
  │    └─ ResonanceScreenView
  └─ PowerScreen              (p(t) = v·i, real/reactive power, power factor)
       ├─ PowerModel
       └─ PowerScreenView

src/common/model/
  ├─ Phasor.ts                immutable A·cos(ωt+φ) over dot's Complex
  ├─ Impedance.ts             Z_R / Z_L / Z_C, series and resonance helpers
  ├─ ACSourceModel.ts         composable sinusoidal source
  └─ RlcCircuitModel.ts       series RLC loop shared by screens 2–4
                              (element voltages, Z, I, φ, f₀, Q, half-power band,
                               off-frequency currentAmplitudeAt / phaseAt)

src/common/view/
  ├─ PhasorDiagramNode.ts     complex-plane backdrop; supplies the transform
  ├─ PhasorNode.ts            one arrow, with optional free tail and projection line
  ├─ PhasorChainNode.ts       an ordered set of phasors, head-to-tail or from the origin
  ├─ PhaseArcNode.ts          the labelled wedge between two angles
  ├─ WaveformNode.ts          multi-trace, dual-axis oscilloscope with a playhead;
                              a trace may ride a DC offset and shade to zero in two colors
  ├─ FrequencyResponseNode.ts quantity vs. log frequency; operating-point marker,
                              f₀ line, half-power band
  ├─ CircuitDiagramNode.ts    pictorial loop with flowing charge
  ├─ ResistorNode / InductorNode / CapacitorNode / ACSourceNode
  ├─ CircuitSymbols.ts        schematic R / L / C glyphs
  ├─ ACPhasorNumberControl.ts      pre-themed NumberControl, linear or logarithmic
  └─ ACPhasorReadout.ts            one "label + value badge" row

src/common/
  ├─ ACPhasorScreenIcons.ts   home / nav icons for all four screens
  ├─ ACPhasorPanel.ts              pre-themed panel (uses ACPhasorColors)
  ├─ ACPhasorButtonOptions.ts      flat button / combo-box option bundles
  └─ TimeModel.ts             composable play/pause + elapsed time
```

Data flows Model → View through AXON `Property` objects. The view never integrates
physics; the model never imports scenery.

## Screen intents

| Screen | Purpose | State |
|---|---|---|
| Intro | Pick R, L, or C; rotating V/I phasor clock with the phase angle marked and each tip projected onto the real axis, beside a dual-trace v(t)/i(t) scope | Built |
| Series RLC | Rotating voltage triangle and the static impedance triangle it is similar to, switchable between head-to-tail and common-origin, plus a scope and a resonance callout | Built |
| Resonance | Same RLC circuit across the frequency dial: stacked \|I\| and φ vs. log f (`FrequencyResponseNode`), f₀ and half-power band, impedance triangle, logarithmic auto-sweep (`isSweepingProperty`) | Built |
| Power | Dual scopes for v/i and shaded p(t)=v·i (2ω swing on a P offset), power triangle P+jQ=S via `PhasorChainNode`, power-factor readout | Built |

Resonance opens on dedicated element defaults (`RESONANCE_SCREEN_*` in
`ACPhasorConstants.ts`) so Q is high enough for a visible peak. The sweep reads
progress back out of the frequency Property (log travel over
`FREQUENCY_SWEEP_DURATION_S`), so grabbing the slider mid-sweep continues from
wherever it was left. Power derives P, Q, S, and cos φ from the shared circuit’s
peak V, I, and φ; amplitudes are peak throughout, hence the factors of ½.

## Invariants worth preserving

Three pieces of this codebase exist to stop the layout moving while the physics does.
Breaking any of them shows up as the whole screen jittering once per cycle.

1. **`WaveformNode` freezes its `localBounds` at construction** and clips traces to the
   chart. An auto-scaling axis, a changing tick label, and a retuned time window
   therefore never resize it. Its vertical scale also snaps to a 1–2–5 sequence rather
   than tracking the amplitude, so the axis holds still through small changes.
2. **`CircuitDiagramNode` freezes its footprint at the worst case** — every element of
   every slot visible, every capacitor at full plate size — before applying visibility
   bindings. Anything new that can grow the bounds must be built before that point.
3. **`InductorNode` freezes its own `localBounds` to include the full flux extent.**
   The field loops are hidden at low current, and hidden children are out of bounds, so
   without this the part (and the diagram that sized itself from it) would breathe.

`tests/WaveformNode.test.ts` guards the first of these directly.

## Two decorations that carry the physics

- **The inductor's field loops** (`InductorNode.setFluxState`) sit at radius
  `inner + (k + |i|/i_peak)·spacing`. Their *position* is therefore the field and their
  radial *speed* is `spacing · d|i|/dt`, proportional to |v_L| = |L·di/dt|. The loops
  hang motionless at the current peak, exactly where the ± EMF marks vanish, and race
  through the zero crossing where those marks are strongest. Being a pure function of
  the instantaneous field, it survives pause, step-forward and reset without drifting.
- **The carriers in `CircuitDiagramNode`** are displaced by q(t) = ∫i dt, so their
  velocity is the current. A capacitor cuts the loop and they queue against the plate,
  which makes the visible pile the stored charge.

## Next steps

1. Preferences → Simulation is hidden until the sim has real preferences; add preferences
   model/node hooks when needed.
2. Optional: shaded regions under a `WaveformNode` trace beyond the two-color-to-zero
   lobes already used on the Power screen.
