# Model - AC Phasor

Educator-facing description of the physics.

## Goal

Help learners connect time-domain AC signals on R, L, and C to rotating phasors in
the complex plane, for single components and for series RLC circuits.

## Screens

1. **Intro** — one component at a time (resistor, inductor, or capacitor) driven by
   a sinusoidal AC source; voltage and current phasors.
2. **Series RLC** — R, L, and C in series; the voltage triangle and the impedance
   triangle it is similar to.
3. **Resonance** — the same series RLC circuit swept in frequency; stacked
   current- and phase-versus-frequency curves on a shared log‑\(f\) axis, with
   \(f_0\) and the half-power band marked, plus an auto-sweep of the drive.
4. **Power** — instantaneous \(p(t) = v\cdot i\), the power triangle
   \(P + jQ = S\), and the power factor \(\cos\phi\).

## Relations (SI)

- Resistor: \(Z_R = R\), current in phase with voltage.
- Inductor: \(Z_L = j\omega L\), current lags voltage by \(90^\circ\).
- Capacitor: \(Z_C = 1/(j\omega C)\), current leads voltage by \(90^\circ\).
- Series: \(Z = Z_R + Z_L + Z_C = R + j(\omega L - 1/\omega C)\).
- Ohm's law in the frequency domain: \(\mathbf{I} = \mathbf{V}/Z\), \(\mathbf{V}_k = \mathbf{I}Z_k\).
- Kirchhoff's voltage law: \(\mathbf{V}_R + \mathbf{V}_L + \mathbf{V}_C = \mathbf{V}\).
- Resonance: \(\omega_0 = 1/\sqrt{LC}\), i.e. \(f_0 = 1/(2\pi\sqrt{LC})\);
  quality factor \(Q = (1/R)\sqrt{L/C}\); half-power bandwidth \(\Delta f = f_0/Q\).
- Instantaneous power (peak amplitudes):  
  \(p(t) = v(t)\,i(t) = \tfrac12 VI\cos\phi + \tfrac12 VI\cos(2\omega t - \phi)\).  
  Real power \(P = \tfrac12 VI\cos\phi\) (W), reactive \(Q = \tfrac12 VI\sin\phi\) (var),
  apparent \(S = \tfrac12 VI\) (VA), power factor \(\cos\phi\).

Dividing every voltage phasor by the common current \(\mathbf{I}\) turns the voltage
triangle into the impedance triangle \(R + jX = Z\). Scaling that impedance
triangle by \(\tfrac12 I^2\) yields the power triangle on the Power screen. The
three are similar; Series RLC draws voltage and impedance together, and Power
draws \(P\), \(Q\), and \(S\).

## Ranges and defaults

| Quantity | Default | Range |
|---|---|---|
| Source amplitude (peak) | 5 V | 0 – 10 V |
| Source frequency | 1 Hz | 0.02 – 5 Hz (logarithmic slider) |
| Resistance | 10 Ω | 1 – 100 Ω |
| Inductance | 1 H | 0.1 – 10 H |
| Capacitance | 1 F | 0.1 – 10 F |

**Why the frequency range starts at 0.02 Hz.** Across the L and C ranges above,
\(f_0\) spans 0.0159 Hz (both at maximum) to 1.59 Hz (both at minimum) — almost
entirely *below* 1 Hz. A floor of 0.02 Hz brings resonance within reach nearly
everywhere in the L–C plane; the sole exception is the exact L = C = 10 corner,
which lands a hair under it. The span is 2.4 decades, so the frequency control
uses a logarithmic slider — a linear one would spend most of its travel above
1 Hz, where nothing interesting happens. The Resonance screen’s auto-sweep walks
that same log range in about 14 s so the operating point climbs the peak instead
of having to be hunted by hand.

**Resonance-screen defaults.** The shared defaults give \(Q = 0.1\), too broad to
show a clear peak, so Resonance opens at \(R = 2\,\Omega\), \(L = 2.5\,\mathrm{H}\),
\(C = 0.1\,\mathrm{F}\) (a visible peak within the frequency dial).

**What counts as "at resonance".** The badge and the accessible description both fire
when \(|\arg Z| < 5^\circ\). The test is on the phase rather than on the reactance
because the phase is what the learner is looking at (it is the angle of the
triangles) and because it is scale-free — a band in ohms means something quite
different at R = 1 than at R = 100.

## Simplifications

- Components are ideal: no winding resistance, no dielectric leakage, no parasitics.
- The source phase is fixed at zero; it is the reference every other phase is measured
  against.
- Only the steady-state (particular) solution is modelled. Switching transients — the
  response you would see in the first few cycles after closing the circuit — are not.
- Values are far from laboratory scale (farads and henries rather than microfarads and
  millihenries) so that the resulting frequencies are slow enough to watch.
