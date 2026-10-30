// Source-guided notes for immutable v8 identities. No independent reviewer is claimed.
export const v8EditorialCatalog = [
  {
    "slug": "expansion-v8-diode-rail-clamp-piecewise-check",
    "title": "A rail clamp is active only after its own inequality is met",
    "version": 1,
    "signature": "c2eba09b",
    "method": "node",
    "difficulty": "Easy",
    "authoredOn": "2026-10-30",
    "trace": [
      "For VIN = 3 V with the diode off, the divider gives vX = 3 × 1000/(2000 + 1000) = 1.000 V. The diode voltage is 1.000 − 2.500 = −1.500 V, below 0.600 V, so the off assumption is consistent.",
      "For VIN = 12 V, the off-state divider would predict 4.000 V, placing 1.500 V across the diode. That violates its off-state inequality, so the diode must conduct.",
      "In the on state, vX = 2.500 + 0.600 = 3.100 V. RS supplies (12 − 3.100)/2000 = 4.450 mA while RL draws 3.100/1000 = 3.100 mA.",
      "The difference is ID = 4.450 − 3.100 = +1.350 mA into the reference, satisfying ID ≥ 0. A fixed clamp voltage is valid only in the conducting case; a reference unable to sink current would require a different model."
    ],
    "formula": "Off: vX = VIN RL/(RS + RL), check vX − VREF ≤ VD; on: vX = VREF + VD, ID = (VIN − vX)/RS − vX/RL ≥ 0",
    "inputs": [
      "Input path: VIN through RS = 2.00 kΩ to X",
      "Load: RL = 1.00 kΩ from X to ground",
      "Diode orientation: Anode X; cathode +2.500 V reference",
      "Exact on-state drop: 0.600 V; ID ≥ 0 from X into reference",
      "Two separate inputs: +3.000 V and +12.000 V"
    ],
    "verification": "Enumerate both diode states at each input voltage, solve the linear node KCL for each, and retain only solutions satisfying the corresponding forward-voltage and nonnegative-current constraints. Recheck the source, load and reference current budget.",
    "sources": [
      {
        "title": "MIT 6.071J: Diodes, Offset Voltage Models and Rectifiers",
        "url": "https://ocw.mit.edu/courses/6-071j-introduction-to-electronics-signals-and-measurement-spring-2006/9b3b5a9eef65ffb51e8288887a79c2ef_17_diodes1.pdf",
        "supports": "Offset diode models require conducting-state voltage and nonnegative-current checks; bridge rectifiers reverse alternating input polarity through two conducting diodes. The two original questions stipulate exact drops, wiring and loads and independently verify their own piecewise states and waveform integrals."
      }
    ]
  },
  {
    "slug": "expansion-v8-constant-power-dc-operating-points",
    "title": "A constant-power load can intersect the source twice",
    "version": 1,
    "signature": "d5e005bc",
    "method": "node",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "KCL gives (12 − vX)/2 = 12/vX. Multiplying by vX > 0 yields vX² − 12vX + 24 = 0.",
      "The discriminant is 144 − 96 = 48, so the two positive solutions are vX = (12 ± √48)/2 = 6 ± √12: 9.464101615 V and 2.535898385 V. Both satisfy the defined static current law.",
      "For general P, the equation is vX² − VS vX + RS P = 0. Real solutions require VS² − 4RS P ≥ 0, so Pmax = VS²/(4RS) = 18.000 W. At that limit the voltage is 6 V.",
      "Equivalently the source can deliver P(vX) = vX(12 − vX)/2, a downward-opening parabola with its maximum at 6 V. This is an existence limit for the given static model; no claim about startup or stable branches follows without adding a state and its dynamics."
    ],
    "formula": "vX² − VS vX + RS P = 0; vX = [VS ± √(VS² − 4RS P)]/2; Pmax = VS²/(4RS)",
    "inputs": [
      "Ideal source VS: 12.00 V",
      "Series resistance RS: 2.000 Ω",
      "Initial constant load power P: 12.00 W",
      "Load law: ILOAD = P/vX for vX > 0",
      "Scope: Static operating points only; dynamics unspecified"
    ],
    "verification": "Locate both positive intersections using independent source-current and P/V load-current equations. Sweep the continuous available-power parabola and verify the discriminant boundary at the coalesced root, without making a dynamic stability claim.",
    "sources": [
      {
        "title": "Texas Instruments SSZT993: Help! My Power Supply Unit Is Unstable—Part 2",
        "url": "https://www.ti.com/document-viewer/lit/html/SSZT993/GUID-8C378DA9-6731-471A-A0AC-A1DBFEB15F28",
        "supports": "Regulated loads can act as constant-power inputs with decreasing current as voltage increases. The original exercise defines an exact static P/V load and derives only its algebraic DC existence limit; it does not infer dynamics or commercial converter behavior from the source article."
      }
    ]
  },
  {
    "slug": "expansion-v8-tia-capacitance-noise-gain-shape",
    "title": "Sensor capacitance raises noise gain before feedback flattens it",
    "version": 1,
    "signature": "c6ebd1d6",
    "method": "opamp",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "At N, (en − vOUT)(1/RF + sCF) + sCI en = 0. Rearranging gives NG(s) = 1 + sCI/(1/RF + sCF) = [1 + sRF(CI + CF)]/[1 + sRF CF].",
      "The zero is at s = −1/[RF(CI + CF)], so its positive frequency magnitude is fZ = 1/[2π × 100000 × 110 pF] = 14.46863119 kHz. Using CI alone would be an approximation, not the exact requested value.",
      "The pole is at s = −1/(RF CF), giving fP = 159.1549431 kHz. The DC noise gain is 1 and its high-frequency limit is (CI + CF)/CF = 11.",
      "At 100.0 kHz, evaluate the complex ratio: |NG| = √[1 + (ωRF(CI + CF))²]/√[1 + (ωRF CF)²] = 5.913136559 V/V. A current-input signal follows a different transfer; this voltage-error amplification cannot be inferred from only the DC transimpedance."
    ],
    "formula": "NG(s) = [1 + sRF(CI + CF)]/[1 + sRF CF]; fZ = 1/[2πRF(CI + CF)]; fP = 1/(2πRF CF)",
    "inputs": [
      "Feedback RF: 100.0 kΩ from output to N",
      "Feedback CF: 10.00 pF, parallel with RF",
      "Input CI: 100.0 pF from N to ground",
      "Voltage test: en at noninverting input; sensor current source open",
      "Op-amp model: Ideal linear; zero input currents and unlimited bandwidth"
    ],
    "verification": "Solve the complex inverting-node KCL directly with a unit noninverting voltage test, evaluate transfer magnitude and the exact real numerator and denominator roots, and check its DC and high-frequency limits against the full capacitive divider.",
    "sources": [
      {
        "title": "Texas Instruments SSZTBC4: What You Need to Know about Transimpedance Amplifiers—Part 1",
        "url": "https://www.ti.com/lit/pdf/SSZTBC4",
        "supports": "Input capacitance raises a transimpedance front end’s noise gain, while a capacitor parallel to the feedback resistor adds a pole. The original ideal voltage-test circuit derives its exact numerator including both capacitances and avoids predicting finite-bandwidth amplifier stability."
      }
    ]
  },
  {
    "slug": "expansion-v8-bridge-rectifier-conduction-average-rms",
    "title": "A rectifier’s average output does not determine resistor heating",
    "version": 1,
    "signature": "44bfb1ea",
    "method": "integration",
    "difficulty": "Hard",
    "authoredOn": "2026-10-30",
    "trace": [
      "Let VM = 5√2 V and VD,total = 1.400 V. On a positive half-cycle, conduction runs from α to π − α, where α = asin(1.4/VM) = 0.1993067977 rad. The identical rectified half-cycles make the conducting fraction (π − 2α)/π = 87.31173518%.",
      "For α < θ < π − α, iL = (VM sin θ − 1.4)/(1100 Ω), and iL = 0 elsewhere. Thus the period-average current is [2VM cos α − 1.4(π − 2α)]/(π × 1100) A.",
      "Multiplying that average current by RL gives the average load voltage 2.900094774 V. This waveform still has both rectified ripple and zero-current gaps, since no capacitor is present.",
      "The mean-square current is {VM²[(π − 2α)/2 + sin(2α)/2] − 4VM(1.4)cos α + 1.4²(π − 2α)}/(π × 1100²). This gives iL,rms = 3.434518488 mA and PL = RL〈iL²〉 = 11.79591724 mW.",
      "The square of the mean voltage would predict only about 8.41055 mW, underestimating heating because it discards waveform variation. The finite conduction threshold and RS must be included in both integrals; an ideal zero-drop rectifier is a different model."
    ],
    "formula": "α = asin(2VD/VM); conducting fraction = (π − 2α)/π; iL = max(|vS| − 2VD, 0)/(RS + RL); 〈vL〉 = RL〈iL〉; PL = RL〈iL²〉",
    "inputs": [
      "Source: 5.000 V RMS sine, 100 Hz; peak 5.000√2 V",
      "Series source resistance RS: 100.0 Ω on the AC side",
      "Bridge diodes: Four; each exact 0.700 V forward drop",
      "Load RL: 1.000 kΩ; no smoothing capacitor",
      "Output polarity: Bridge positive output minus negative output"
    ],
    "verification": "Numerically integrate the clipped rectifier current and current squared over complete source periods and count the nonzero-conduction interval. Independently check source power against resistor and constant-drop diode dissipation.",
    "sources": [
      {
        "title": "MIT 6.071J: Diodes, Offset Voltage Models and Rectifiers",
        "url": "https://ocw.mit.edu/courses/6-071j-introduction-to-electronics-signals-and-measurement-spring-2006/9b3b5a9eef65ffb51e8288887a79c2ef_17_diodes1.pdf",
        "supports": "Offset diode models require conducting-state voltage and nonnegative-current checks; bridge rectifiers reverse alternating input polarity through two conducting diodes. The two original questions stipulate exact drops, wiring and loads and independently verify their own piecewise states and waveform integrals."
      }
    ]
  },
  {
    "slug": "expansion-v8-sampled-capacitor-thermal-noise-floor",
    "title": "Reducing switch resistance does not remove the settled noise floor",
    "version": 1,
    "signature": "7d682d60",
    "method": "noiseSpectrum",
    "difficulty": "Easy",
    "authoredOn": "2026-10-30",
    "trace": [
      "The integrated resistor-noise variance is kBT/C. For 100 pF at 300 K, σV² = (1.380649 × 10^−23 × 300)/(100 × 10^−12) = 4.141947 × 10^−11 V².",
      "The positive RMS sample noise is √(4.141947 × 10^−11) = 6.435795988 µV. The ideal opening preserves that random capacitor voltage; it does not reset the stored noise to zero.",
      "To guarantee σV ≤ 10.00 µV in this model, C ≥ kBT/(10.00 µV)² = 41.419470 pF. Equality meets the stated RMS bound.",
      "The resistor disappears from the equilibrium variance because its 4kBTR density increases with R while the integrated RC noise bandwidth decreases in the same proportion. This cancellation assumes complete settling and the stated ideal bandwidth model; changing R alone does not reduce the settled kT/C floor."
    ],
    "formula": "σV = √(kBT/C); Cmin = kBT/σV,max²; ∫₀∞4kBTR/[1 + (2πfRC)²] df = kBT/C",
    "inputs": [
      "Switch model: R = 10.00 kΩ; only noise source",
      "Absolute temperature: 300.0 K",
      "Initial capacitor choice: 100.0 pF",
      "Boltzmann constant kB: 1.380649 × 10^−23 J/K",
      "Equilibrium sample variance: σV² = kBT/C; no later load or injection"
    ],
    "verification": "Numerically integrate the stipulated one-sided resistor-voltage PSD through the squared RC transfer over positive frequency and compare with thermal equipartition. Repeat with different resistance to check the bandwidth-density cancellation and verify the minimum capacitor inequality.",
    "sources": [
      {
        "title": "Analog Devices: Managing Noise in the Signal Chain, Part 2",
        "url": "https://www.analog.com/en/resources/technical-articles/managing-noise-in-the-signal-chain-part-2-noise-and-distortion-in-data-converters.html",
        "supports": "Equilibrium resistor noise filtered onto a sample capacitor gives RMS voltage sqrt(kT/C); resistance changes density and noise bandwidth in cancelling proportions. The original question specifies absolute temperature, complete settling and ideal sampling, excluding other errors."
      }
    ]
  },
  {
    "slug": "expansion-v8-identify-one-pole-from-three-samples",
    "title": "Three exact samples reveal both the target and time constant",
    "version": 1,
    "signature": "0771970a",
    "method": "firstOrder",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "For sample interval Δ = 1 ms, let r = e^(−Δ/τ). The two increments are 3 − 1 = 2 V and 4 − 3 = 1 V. Their ratio is r = 1/2, since each next increment is the previous one times r.",
      "The one-step equation is v1 = VS + (v0 − VS)r. With v0 = 1, v1 = 3 and r = 0.5, this is 3 = 0.5VS + 0.5, so VS = 5.000 V.",
      "The time constant is τ = −Δ/ln r = (1 ms)/ln 2 = 1.442695041 ms. Since C = 100 nF, R = τ/C = 14.42695041 kΩ.",
      "Back-substitution gives vX(t) = 5 − 4e^(−t/τ), reproducing 1, 3 and 4 V at the three specified times. This exact identification relies on the stated single-pole model and exact samples; real noisy measurements would require a fit and uncertainty analysis."
    ],
    "formula": "r = (v2 − v1)/(v1 − v0); VS = (v1 − rv0)/(1 − r); τ = −Δt/ln r; R = τ/C",
    "inputs": [
      "Known capacitor: C = 100.0 nF",
      "Source model: Unknown constant VS through unknown R > 0",
      "Exact sample at 0: 1.000 V",
      "Exact sample at 1.000 ms: 3.000 V",
      "Exact sample at 2.000 ms: 4.000 V"
    ],
    "verification": "Infer the one-step contraction from exact successive increments, then independently integrate KCL using the recovered source and resistance to reproduce all three observations. Check the recovered source lies above the rising measured values and resistance is positive.",
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: RC Circuits",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits",
        "supports": "A constant source and a single resistor-capacitor state yield an exponential response with time constant RC. The original inverse problem uses exact equally spaced observations to infer both its initially unknown target and positive time constant; no source exercise values or wording are copied."
      }
    ]
  },
  {
    "slug": "expansion-v8-rc-group-delay-versus-phase-delay",
    "title": "The envelope delay differs from the carrier phase delay",
    "version": 1,
    "signature": "ac883c7b",
    "method": "filter",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "The time constant is RC = 100.0 µs. The unloaded divider is H(jω) = 1/(1 + jωτ), with φ = −atan(ωτ). At 2 kHz, ωτ = 1.256637061.",
      "The voltage-gain magnitude is 1/√[1 + (ωτ)²] = 0.6226769923 V/V. Its phase is approximately −0.8986370931 radians.",
      "Using the defined phase delay gives tp = atan(ωτ)/ω = 71.51126770 µs. Using the derivative instead gives tg = τ/[1 + (ωτ)²] = 38.77266367 µs.",
      "The two delays coincide in the low-frequency limit but differ at this carrier. The group delay follows the local phase slope for a very narrow modulation band; it is not the time constant, an exact step crossing, or the phase delay of that carrier."
    ],
    "formula": "H(jω) = 1/(1 + jωRC); tp = atan(ωRC)/ω; tg = RC/[1 + (ωRC)²]",
    "inputs": [
      "Series resistor R: 10.00 kΩ",
      "Shunt capacitor C: 10.00 nF",
      "Carrier frequency f0: 2.000 kHz",
      "Phase convention: Continuous φ(ω), radians, with φ(0) = 0",
      "Defined delays: tp = −φ/ω; tg = −dφ/dω at ω0"
    ],
    "verification": "Reconstruct the complex RC divider at the carrier and neighboring frequencies; compare a centered finite difference of its continuous phase with the group delay and the direct phase ratio with phase delay. Keep radians and angular-frequency units explicit.",
    "sources": [
      {
        "title": "MathWorks: Group Delay and Phase Delay",
        "url": "https://www.mathworks.com/help/signal/ug/delay.html",
        "supports": "Group delay is the negative phase derivative with respect to angular frequency, while phase delay is negative phase divided by angular frequency. The original continuous-time RC exercise explicitly defines both and independently differentiates its own analog-divider response."
      }
    ]
  },
  {
    "slug": "expansion-v8-finite-bandwidth-active-guard-overshoot",
    "title": "A finite-bandwidth guard can make a capacitive input overshoot",
    "version": 1,
    "signature": "abd3f61b",
    "method": "coupledStates",
    "difficulty": "Hard",
    "authoredOn": "2026-10-30",
    "trace": [
      "KCL at X is (vIN − vX)/R = (CG + CC)dvX/dt − CC dvG/dt. Together with τG dvG/dt + vG = k vX, this gives H(s) = (1 + sτG)/{1 + s[τG + R(CG + CC) − R CC k] + s²τG R(CG + CC)}.",
      "The coefficients are a = 1.0000 × 10^−8 s² and b = 110.90 µs. Thus ζ = b/(2√a) = 0.554500. Both coefficients are positive, so the specified poles are stable; ζ < 1 makes them a complex conjugate pair despite the absence of an inductor.",
      "Let α = b/(2a) = 5545 s^−1 and ωd = √(1/a − α²) = 8321.837237 s^−1. For the 1 V step, vX(t) = 1 + e^(−αt)[−cos(ωdt) + B sin(ωdt)] V, where B = (τG/a − α)/ωd = 0.5353385164. This satisfies vX(0) = 0 and initial slope 1/[R(CG + CC)].",
      "Setting the derivative of that complete expression to zero and taking its first positive root gives tpeak = 247.8194926 µs. Substitution gives the first absolute peak vX = 1.238863144 V. Later extrema decay because the poles are stable, so the first positive overshoot is the largest.",
      "Replacing the driver by the instantaneous rule vG = k vX would reduce the apparent capacitance to CG + (1 − k)CC and predict a monotone first-order step. That shortcut omits the specified lag, the active energy exchange and the transfer zero responsible for this different peak timing."
    ],
    "formula": "H(s) = (1 + sτG)/(a s² + b s + 1); a = τG R(CG + CC); b = τG + R(CG + CC) − R CC k; ζ = b/(2√a)",
    "inputs": [
      "Source and series resistance: 0 → 1.000 V step through R = 1.000 MΩ",
      "Sensing-node ground capacitance CG: 10.00 pF",
      "Coupling capacitance CC: 90.00 pF from X to actively driven G",
      "Guard law: 100.0 µs × dvG/dt + vG = 0.9900 vX",
      "Initial conditions: vX(0−) = vG(0−) = 0 V"
    ],
    "verification": "Integrate the two physical capacitor/guard state equations from their specified zero state, locate the first derivative-zero event, and compare with independently reconstructed transfer coefficients. Verify DC recovery, stable complex poles and the failure of a static effective-capacitance approximation.",
    "sources": [
      {
        "title": "Analog Devices AD549 Data Sheet: Guarding and AC Response with High Source Resistance",
        "url": "https://www.analog.com/media/en/technical-documentation/data-sheets/AD549.pdf",
        "supports": "Driving a surrounding guard near the input potential reduces parasitic input capacitance and leakage, and capacitive input loading can affect AC response. This reference supports the physical guarding concept only. The original exercise supplies its own ideal active-driver state law and verifies its forced coupled response; it is not a performance model of the AD549."
      }
    ]
  },
  {
    "slug": "expansion-v8-bjt-exact-one-pole-current-gain",
    "title": "Unity current gain is different from the beta pole",
    "version": 1,
    "signature": "6d721dae",
    "method": "bjtSignal",
    "difficulty": "Easy",
    "authoredOn": "2026-10-30",
    "trace": [
      "For the supplied model, |β| = β0/√[1 + (f/fβ)²]. The measured ratio β0/|β| is 2.00, so (2.00 MHz/fβ)² = 2² − 1 = 3.",
      "Thus fβ = 2.00/√3 = 1.1547005 MHz. At this pole the magnitude is β0/√2, not unity.",
      "Set 1 = 10.0/√[1 + (fT/fβ)²]. Then fT = fβ√(10.0² − 1) = 11.4891253 MHz.",
      "The approximation β0fβ = 11.5470054 MHz is close but is not the exact crossing of the stated one-pole transfer. Actual device fT characterization may include additional high-frequency effects excluded here."
    ],
    "formula": "|β(j2πf)| = β0/√[1 + (f/fβ)²]; fT = fβ√(β0² − 1)",
    "inputs": [
      "Low-frequency gain: β0 = 10.0 A/A",
      "Measured magnitude: |β| = 5.00 A/A at 2.00 MHz",
      "Transfer model: β(s) = β0/[1 + s/(2πfβ)]",
      "Measurement condition: Forward-active bias; collector at AC ground only"
    ],
    "verification": "Numerically locate the pole parameter that reproduces the independent complex-magnitude measurement, then root-find the unity-current-gain crossing directly. Verify the exact crossing differs materially from beta0 times the pole at the authored tolerance.",
    "sources": [
      {
        "title": "MIT 6.012 Recitation 21: Intrinsic Frequency Response of CS and CE Amplifiers",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/80258d4d234f52610226ea43a3ca455a_MIT6_012S09_rec21.pdf",
        "supports": "The primary course note defines fT by unity short-circuit current gain and distinguishes the current-gain response from asymptotic approximations. This original exercise supplies a deliberately exact one-pole model and solves its finite-beta crossing without asserting a measured commercial-device model."
      }
    ]
  },
  {
    "slug": "expansion-v8-bjt-follower-output-port-test",
    "title": "Test the emitter port with the input turned off",
    "version": 1,
    "signature": "70fb9f6f",
    "method": "port",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "With emitter test voltage vx, base KCL gives vb = vx RB/(RB + rπ). Therefore vx − vb = vx rπ/(RB + rπ). The test source supplies both base/emitter and controlled-source contributions.",
      "The transistor emitter-port conductance is (gm + 1/rπ)rπ/(RB + rπ) = (gm rπ + 1)/(RB + rπ) = 101/10,000 S. Add 1/ro and 1/RE, giving total conductance 0.01112 S.",
      "Rout = 1/0.01112 = 89.92806 Ω. RE remains part of the amplifier, while the unloaded condition removes only external RL.",
      "With RL = 220 Ω, the effective output resistance is Rout ∥ RL = 63.83473 Ω. An added outward current of 10.0 µA produces Δve = −10.0 µA × 63.83473 Ω = −638.3473 µV.",
      "The stated DC collector voltage exceeds the base voltage, consistent with forward-active operation. Replacing the base by an ideal AC ground would change the port resistance; the finite RB is essential here."
    ],
    "formula": "Rout⁻¹ = (gm rπ + 1)/(RB + rπ) + 1/ro + 1/RE; Δve = −Δi(Rout ∥ RL)",
    "inputs": [
      "Transistor local model: gm = 40.0 mS; rπ = 2.50 kΩ; ro = 50.0 kΩ",
      "Zero-input base network: RB = 7.50 kΩ to AC ground",
      "Emitter resistances: RE = 1.00 kΩ; second case adds AC-only RL = 220 Ω",
      "Load perturbation / bias: Additional sink +10.0 µA; VE = 1.01 V; VB = 1.71 V; VC = 5.00 V"
    ],
    "verification": "Inject a small test current and solve the separate base and emitter node equations including finite r-pi, ro and RE. Repeat with the added AC load and negative injected current, confirming the sign and every current balance without treating the base as an ideal ground.",
    "sources": [
      {
        "title": "Brian Hong: Generalized Gain and Impedance Expressions for Single-Transistor Amplifiers",
        "url": "https://arxiv.org/html/2309.09190v1",
        "supports": "This original research tutorial derives common-collector terminal impedances with finite current gain and output resistance. The authored emitter-port exercise supplies its own topology and values and reconstructs both base and emitter KCL rather than copying a source example."
      }
    ]
  },
  {
    "slug": "expansion-v8-bjt-source-noise-optimum-bias",
    "title": "More collector current does not always reduce total input noise",
    "version": 1,
    "signature": "5a5c634b",
    "method": "noiseSpectrum",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "Write Stotal = A/IC + BIC + C, where A = 2qVT², B = 2qRS²/β and C = 4kTRS. Differentiating gives −A/IC² + B = 0.",
      "The positive stationary point is IC,opt = VT√β/RS = 25.875 µA. The second derivative 2A/IC³ is positive, so this is the unique minimum for positive current; it lies inside the allowed 5.00–200 µA interval.",
      "At that current the two internal contributions are equal. Their sum is 1.656 × 10^−17 V²/Hz; RS thermal noise contributes 1.656 × 10^−16 V²/Hz, giving Stotal = 1.8216 × 10^−16 V²/Hz.",
      "The passband width is 11,000 − 1000 = 10,000 Hz. Total variance is 1.8216 × 10^−12 V² and RMS noise is 1.3496666 µV.",
      "Increasing IC beyond the optimum lowers the stipulated voltage-noise density but raises the source-impedance conversion of current noise. This optimum belongs to the supplied uncorrelated input model, not a universal bias rule for every transistor amplifier."
    ],
    "formula": "Stotal = 2qVT²/IC + (2qIC/β)RS² + 4kTRS; IC,opt = VT√β/RS; vn,rms = √[Stotal(fH − fL)]",
    "inputs": [
      "Source / bias range: RS = 10.0 kΩ; 5.00 µA ≤ IC ≤ 200 µA; VCE = 2.00 V",
      "Current gain / thermal scale: β = 100; T = 300 K; VT = 25.875 mV",
      "Constants: k = 1.38 × 10^−23 J/K; q = 1.60 × 10^−19 C",
      "Measurement band: 1.00 kHz ≤ f ≤ 11.00 kHz; all sources independent and one-sided"
    ],
    "verification": "Minimize the stipulated summed PSD numerically over the permitted positive-current interval, independently integrate each one-sided source contribution over the actual band, and confirm the optimum is interior and the source thermal noise is retained.",
    "sources": [
      {
        "title": "Analog Devices MT-047: Op Amp Noise",
        "url": "https://www.analog.com/media/en/training-seminars/tutorials/MT-047.pdf",
        "supports": "The tutorial explains input-referred voltage and current generators, source-impedance conversion, independent mean-square addition, resistor thermal noise and junction shot noise. The authored BJT question explicitly stipulates its uncorrelated spectral model; its numerical optimum is independently derived from that model."
      },
      {
        "title": "Analog Devices MT-048: Noise Relationships and Equivalent Noise Bandwidth",
        "url": "https://www.analog.com/media/en/training-seminars/tutorials/MT-048.pdf",
        "supports": "Integrated noise is obtained over the specified frequency band, distinguishing white spectral density from RMS noise. The original calculation uses a stipulated positive-frequency brick-wall interval and excludes flicker noise rather than importing an unrelated equivalent-bandwidth factor."
      }
    ]
  },
  {
    "slug": "expansion-v8-bjt-tail-capacitance-cmrr",
    "title": "A capacitive tail weakens common-mode rejection at high frequency",
    "version": 1,
    "signature": "6740398b",
    "method": "differential",
    "difficulty": "Hard",
    "authoredOn": "2026-10-30",
    "trace": [
      "Put G = gm + 1/rπ = 0.0404 S and YT(s) = 1/RT + sCT. Emitter KCL gives [YT + 2G]vE = G(v1 + v2). For differential drive v1 + v2 = 0, hence vE = 0.",
      "The collector voltages are vc1 = −gmRC1(v1 − vE) and vc2 = −gmRC2(v2 − vE). Thus Ad = −gm(RC1 + RC2)/2 = −195.0 V/V.",
      "For common drive, vcm − vE = vcm YT/(YT + 2G), giving Acm(s) = −gm(RC1 − RC2)YT/(YT + 2G). At DC this is −10/8081 = −0.0012374706 V/V; therefore DC CMRR is 103.94999 dB.",
      "At 100 kHz, YT = 0.0000100 + j0.000628319 S. The resulting Acm is approximately −0.00184191 − j0.07773825 V/V, whose magnitude gives CMRR = 67.98556 dB.",
      "The capacitor lowers tail impedance at high frequency, so the shared emitter tracks common drive less accurately. Finite common-mode collector-current changes combine with unequal loads to create differential output. Both DC collector voltages remain above their bases, consistent with the stated active-region bias."
    ],
    "formula": "Ad = −gm(RC1 + RC2)/2; Acm(s) = −gm(RC1 − RC2)YT/[YT + 2(gm + 1/rπ)]; YT = 1/RT + sCT; CMRRdB = 20log10|Ad/Acm|",
    "inputs": [
      "Matched transistor models: Each gm = 40.0 mS; rπ = 2.50 kΩ; ro → ∞",
      "Unequal collector loads: RC1 = 5.00 kΩ; RC2 = 4.75 kΩ",
      "Incremental tail network: RT = 100 kΩ ∥ CT = 1.00 nF; DC tail sink 2.02 mA",
      "Signal definitions: vod = vc1 − vc2; v1,2 = ±vd/2 for Ad; v1 = v2 for Acm"
    ],
    "verification": "Solve a complex three-node KCL system for the shared emitter and both collectors under differential and common-mode drives. Check DC headroom, zero mismatch, high-frequency limiting conversion and the finite-r-pi contribution before forming magnitude CMRR.",
    "sources": [
      {
        "title": "M. B. Patil, IIT Bombay: BJT Differential Amplifier",
        "url": "https://www.ee.iitb.ac.in/~sequel/ee230/mbpth_diff_1.pdf",
        "supports": "The primary teaching material defines common and differential excitation, differential output and CMRR, and treats a differential pair through its shared emitter node. The original question adds explicitly specified collector-load mismatch and tail capacitance, retaining finite r-pi in its own complex KCL solution."
      }
    ]
  },
  {
    "slug": "expansion-v8-mos-source-inductance-die-vgs",
    "title": "The driver voltage is not always the die gate-source voltage",
    "version": 1,
    "signature": "3d6c5439",
    "method": "gateDrive",
    "difficulty": "Easy",
    "authoredOn": "2026-10-30",
    "trace": [
      "The turn-on slope is +0.600 × 10^9 A/s. Thus vSD = 2.00 × 10^−9 × 0.600 × 10^9 = +1.20 V, and die VGS = 5.00 − 1.20 = 3.80 V.",
      "At the commanded-off instant the slope is −1.20 × 10^9 A/s, so vSD = −2.40 V. Although the gate is at external ground, VGS = 0 − (−2.40) = +2.40 V.",
      "The signed margin is M = 1.80 − 2.40 = −0.600 V. It flags onset under the stipulated threshold test; the zero-volt driver command alone does not guarantee the die gate-source voltage stays below threshold.",
      "The die body follows SD, so there is no body-effect shift in this check. A Kelvin source return can reduce shared power-current inductance in the gate reference. This instantaneous model does not calculate the resulting false-turn-on current."
    ],
    "formula": "vSD = LS diS/dt; VGS,die = vG − vSD; Moff = VTH − VGS,die",
    "inputs": [
      "Source reference: LS = 2.00 nH from die source SD to external GND",
      "Current convention: Positive iS flows from SD toward GND",
      "Turn-on snapshot: vG = +5.00 V; diS/dt = +0.600 A/ns",
      "Commanded-off snapshot: vG = 0 V; diS/dt = −1.20 A/ns; VTH = 1.80 V"
    ],
    "verification": "Reconstruct the die-source voltage from the signed current derivative in the defined source-to-ground direction, then subtract that moving reference from each driver voltage. Check the body-diode polarity and distinguish threshold onset from any subsequent channel-current prediction.",
    "sources": [
      {
        "title": "Texas Instruments SLUA964: Improving Efficiency of DC-DC Conversion through Layout",
        "url": "https://www.ti.com/lit/pdf/slua964",
        "supports": "The manufacturer describes parasitic source and gate-path inductance and their effects on gate drive. The original snapshot problem fixes the inductor current direction and imposes its current slopes, using v = L di/dt and die-referenced gate voltage without predicting a full nonlinear switching trajectory."
      }
    ]
  },
  {
    "slug": "expansion-v8-mos-pair-mismatch-integer-cell-area",
    "title": "Size matched devices by pair variance, then round up the cell count",
    "version": 1,
    "signature": "697c7e05",
    "method": "matching",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "Var(ε) = σδβ² + (2/VOV)²σδVT² = [Aβ² + (2AVT/VOV)²]/A. The numerator is 0.0100² + 0.0300² = 0.001000 µm².",
      "For N = 1, A = 25.0 µm², so σε = √(0.001000/25.0) = 0.00632456 as a fraction, or 0.6324555%.",
      "For N cells, σε = 0.00632456/√N. The target 3σε ≤ 0.0100 requires N ≥ 3.60, so the smallest allowed integer is N = 4 per device.",
      "At N = 3 the 3σ mismatch is 1.09545%, which fails; at N = 4 it is 0.948683%, which passes. Both devices use the same N, and their nominal currents scale with N at the specified fixed overdrive.",
      "No extra √2 appears because both supplied coefficients already refer to pair differences. The model excludes spatial gradients and correlation; a statistical 3σ design target is not a deterministic worst-case bound."
    ],
    "formula": "σε² = [Aβ² + (2AVT/VOV)²]/(25N); Nmin = ceil{9[Aβ² + (2AVT/VOV)²]/[25(0.0100)²]}",
    "inputs": [
      "Each complete device: N parallel cells, each 25.0 µm²; A = 25.0N µm²",
      "Bias / region: VOV = 0.200 V; VD = +1.00 V; source and body at 0 V",
      "Pair-difference coefficients: Aβ = 0.0100 µm; AVT = 0.00300 V·µm",
      "Statistical target: Independent zero-mean parameter pair differences; 3σε ≤ 1.00%"
    ],
    "verification": "Independently enumerate zero-mean parameter signs to reconstruct the two variance contributions, evaluate successive integer parallel-cell counts and verify that the selected count passes while the preceding integer fails. Retain the already-paired coefficient convention and saturation headroom.",
    "sources": [
      {
        "title": "Pelgrom, Duinmaijer and Welbers: Matching Properties of MOS Transistors (1989)",
        "url": "https://ewh.ieee.org/r5/denver/sscs/References/1989_10_Pelgrom.pdf",
        "supports": "The original research relates MOS parameter mismatch to area and propagates threshold and current-factor variances into current-pair mismatch. This authored exercise declares its coefficients as pair differences, its cell area and independence assumptions, and checks an integer statistical bound rather than claiming a fabrication guarantee."
      }
    ]
  },
  {
    "slug": "expansion-v8-mos-two-slope-body-diode-recovery",
    "title": "Recover the body-diode triangle before budgeting switching loss",
    "version": 1,
    "signature": "6264fc7a",
    "method": "integration",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "trr = ta(1 + S), so ta = 70.0/2.80 = 25.0 ns and tb = 45.0 ns. These intervals both occur after the diode current first crosses zero.",
      "IRM = a ta = 120 A/µs × 0.0250 µs = 3.00 A. The actual diode current at the peak is −3.00 A under the defined forward-current convention.",
      "Qrr = ∫IRdt = ½ × 3.00 A × 70.0 ns = 105 nC. The separate rising and falling areas add to this total.",
      "Under the explicitly supplied loss model, Eadd = 48.0 V × 105 nC = 5.04 µJ per event. One event each 100 kHz cycle gives Padd = 5.04 µJ × 100 kHz = 0.504 W.",
      "The loss result uses the stipulated extra bus-current triangle and allocation. It is not a universal formula for the diode’s own dissipated energy; real recovery depends on operating current, temperature, voltage waveform and commutation rate."
    ],
    "formula": " ta = trr/(1 + S); IRM = a ta; Qrr = ½IRM trr; Eadd = VBUS Qrr; Padd = Eadd fsw",
    "inputs": [
      "Reverse interval: trr = ta + tb = 70.0 ns; starts at diode-current zero crossing",
      "Rise slope / softness: a = 120 A/µs; S = tb/ta = 1.80",
      "Bus / event rate: VBUS = 48.0 V; one recovery event per 100 kHz cycle",
      "Current and loss conventions: IR = positive reverse magnitude; Eadd = VBUS ∫IR dt"
    ],
    "verification": "Integrate the supplied two-segment reverse-current waveform numerically after its zero crossing, reconstruct its rise slope and softness, then independently average the allocated bus power over a full switching period containing one event and an otherwise zero extra current.",
    "sources": [
      {
        "title": "Power Integrations AN-301: Reverse Recovery Charge, Current and Time",
        "url": "https://www.power.com/sites/default/files/documents/AN-301.pdf",
        "supports": "This manufacturer note defines reverse recovery charge as the recovery-current integral and softness as tb/ta. The authored problem supplies an ideal triangular current and explicitly allocates bus energy to the opposite switch; it does not attribute a universal real-device energy partition to this reference."
      }
    ]
  },
  {
    "slug": "expansion-v8-mos-gate-loop-overshoot-resistor-bound",
    "title": "Damp the gate loop enough to meet the peak-voltage limit",
    "version": 1,
    "signature": "52df1086",
    "method": "secondOrder",
    "difficulty": "Hard",
    "authoredOn": "2026-10-30",
    "trace": [
      "The natural angular frequency is ω0 = 1/√(LGCG) = 1.58113883 × 10^8 rad/s. With total R = 2.00 Ω, ζ = (R/2)√(CG/LG) = 0.3162278, so the response is underdamped and ωd = ω0√(1 − ζ²) = 1.50 × 10^8 rad/s.",
      "The first peak is at tp = π/ωd = 20.943951 ns. Fractional overshoot is exp[−πζ/√(1 − ζ²)] = exp(−π/3), giving VGS,peak = 10.0[1 + exp(−π/3)] = 13.509198 V.",
      "The target allows fractional overshoot M = (11.50 − 10.0)/10.0 = 0.150. Put u = −ln(M); inversion gives ζmin = u/√(π² + u²) = 0.5169309.",
      "Required total resistance is Rmin = 2ζmin√(LG/CG) = 3.2693579 Ω, so REXT,min = Rmin − RDRV = 2.2693579 Ω. This threshold is still underdamped; larger damping reduces the largest overshoot, while critically damped or overdamped responses are monotonic.",
      "Only the external resistance is the requested design variable. The driver resistance already contributes damping and must not be counted twice. The linear gate-network result isolates ringing; real voltage-dependent capacitance and power-loop coupling need separate characterization."
    ],
    "formula": "ω0 = 1/√(LGCG); ζ = (RDRV + REXT)√(CG/LG)/2; tp = π/[ω0√(1 − ζ²)]; Mp = e^[−πζ/√(1 − ζ²)]",
    "inputs": [
      "Drive / initial state: Step 0 → 10.0 V; VGS(0−) = 0 V; iL(0−) = 0 A",
      "Gate-loop elements: LG = 20.0 nH; CG = 2.00 nF constant",
      "Series resistances: RDRV = 1.00 Ω; first case REXT = 1.00 Ω",
      "Design target: VGS(t) ≤ 11.50 V at all times; REXT ≥ 0"
    ],
    "verification": "Integrate the original inductor-current and capacitor-voltage states from zero initial energy, locate the first positive current-zero event, and numerically bisect external resistance against the largest gate-voltage peak. Compare nearby resistances and retain the driver resistance in the damping total.",
    "sources": [
      {
        "title": "Infineon AN2015-06: EiceDRIVER Gate Resistor for Power Devices",
        "url": "https://www.infineon.com/assets/row/public/documents/24/42/infineon-eicedriver-gate-resistor-for-power-devices-applicationnotes-en.pdf",
        "supports": "The manufacturer describes gate-loop ringing, parasitic elements and damping through gate resistance. The authored problem supplies a constant-capacitance linear RLC characterization; its exact peak and resistor boundary follow from that stipulated model, not a named MOSFET rating or a complete switching simulation."
      }
    ]
  },
  {
    "slug": "expansion-v8-shortened-secded-storage",
    "title": "Count the check bits before packing the memory word",
    "version": 1,
    "signature": "2f4aa77a",
    "method": "coding",
    "difficulty": "Easy",
    "authoredOn": "2026-10-30",
    "trace": [
      "With r = 4, there are only 16 syndrome values, fewer than 24+4+1 = 29 required cases. With r = 5, 32 values cover 24+5+1 = 30 cases, so the minimum is five Hamming check bits.",
      "The shortened Hamming word contains 24+5 = 29 positions. Appending the independent overall parity bit gives 30 stored bits. Unused syndrome values do not require padding this to 32 bits.",
      "Payload efficiency is 100×24/30 = 80%. The six stored check bits are overhead, including both the five Hamming bits and the one overall bit.",
      "The extra parity check distinguishes odd and even error counts under the stated SECDED model. It is distinct from the syndrome-location budget and must not be omitted or counted twice."
    ],
    "formula": "2ʳ ≥ m+r+1 with minimum integer r; stored = m+r+1; efficiency = 100m/(m+r+1)",
    "inputs": [
      "Payload: 24 bits per independently protected word",
      "Hamming check bits r: Smallest r with 2ʳ ≥ 24 + r + 1",
      "SECDED extension: One additional overall parity bit per word",
      "Packing: No metadata, padding, or byte-width rounding"
    ],
    "verification": "Search integer syndrome widths for the smallest feasible code, construct all 29 ordinary column labels plus the separate overall bit, and verify distinct single-error signatures and detectable two-error signatures. Reconstruct storage and efficiency without applying byte-width padding.",
    "sources": [
      {
        "title": "CHIPS Alliance VeeR EL2 Programmer's Reference Manual: Memory Error Protection",
        "url": "https://chipsalliance.github.io/Cores-VeeR-EL2/html/main/docs_rendered/html/error-protection.html",
        "supports": "Hamming SECDED storage uses ordinary syndrome-location check bits plus an extra parity check for double-error detection. Ohm sizes a distinct shortened 24-payload-bit word using an explicit minimum-bit inequality, excludes padding and checks one- and two-error signatures independently."
      }
    ]
  },
  {
    "slug": "expansion-v8-clock-gate-enable-phase",
    "title": "An enable change during clock high can cut a pulse short",
    "version": 1,
    "signature": "756749e5",
    "method": "timing",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "Enable is high on [2,13) ns. The raw AND therefore produces high intervals [2,5) and [10,13), each three nanoseconds long. Its first rising edge is created in the middle of a source-clock high phase.",
      "L holds its initial zero throughout [0,5), so the latched gate produces no pulse there. When clk falls at 5 ns, the latch becomes transparent and adopts en = 1 while the gated output is already low.",
      "At 10 ns the latch closes holding one, so gated rises at 10 ns. The en fall at 13 ns cannot change L during clock high. The output stays high until clk falls at 15 ns, giving a complete five-nanosecond pulse.",
      "During the low phase starting at 15 ns, L follows en back to zero, suppressing the [20,25) source pulse. Thus the latched model emits only [10,15). Real clock-gating hardware additionally requires its characterized enable timing and clock-routing rules."
    ],
    "formula": "raw high intervals = clock-high ∩ enable-high; L follows en only in clock-low phases; high-pulse width = end − start",
    "inputs": [
      "Clock high intervals: [0,5), [10,15), [20,25) ns",
      "Enable waveform: 0 initially; rises at 2 ns; falls at 13 ns",
      "Raw clock gate: raw = clk AND en",
      "Latched clock gate: gated = clk AND L; L transparent only while clk is LOW",
      "Initial latch and delays: L = 0 before t = 0; all modeled delays zero"
    ],
    "verification": "Trace the union of clock and enable event times, updating a low-transparent latch only in its permitted phase. Extract maximal high intervals from each output trace and independently evaluate points immediately before and after the mid-high enable transitions.",
    "sources": [
      {
        "title": "Microchip PolarFire Family Clocking Resources: Clock Gating",
        "url": "https://onlinedocs.microchip.com/oxy/GUID-8F0CC4C0-0317-4262-89CA-CE7773ED1931-en-US-13/GUID-34A62246-6CB9-47E1-A743-D3E10C3AEA25.html",
        "supports": "The documented gating structure holds enable with a latch that is transparent during clock low and holds during clock high, with real device setup/hold requirements. Ohm supplies ideal zero-delay waveforms and keeps physical clock distribution and implementation signoff outside the exercise."
      }
    ]
  },
  {
    "slug": "expansion-v8-branch-flush-pipeline-drain",
    "title": "Flush younger work without discarding the branch",
    "version": 1,
    "signature": "09a7f822",
    "method": "state",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "Only W0 and W1 are younger wrong-path work at resolution, so two instructions are squashed. I0, I1 and B remain useful; the branch is not itself discarded.",
      "The targets are fetched during cycles 6 through 10. T0 advances through D7, E8, C9; T4 advances through F10, D11, E12, C13.",
      "T4 commits at the end of cycle 13, so the complete run occupies 13 cycles or 13×4 = 52 ns. Measuring only until T4 is fetched would omit the last three pipeline stages.",
      "There are eight useful committed instructions: I0, I1, B and five targets. An ideal four-stage run without the two wrong-path fetch slots would need 8+3 = 11 cycles; adding the two lost slots independently confirms 13. This penalty follows the supplied four-stage redirect schedule, not a universal processor rule."
    ],
    "formula": "commit cycle = fetch cycle + 3; total elapsed time = final commit cycle × 4 ns; useful instructions = 3 + 5",
    "inputs": [
      "Stages and cycle: F → D → E → C; one 4 ns cycle per stage",
      "Initial fetches: I0: cycle 1; I1: cycle 2; B: cycle 3",
      "Wrong-path fetches: W0: cycle 4; W1: cycle 5",
      "Redirect: B resolves at end of E in cycle 5; target T0 fetched in cycle 6",
      "Useful target sequence: T0, T1, T2, T3, T4; stop fetching after T4"
    ],
    "verification": "Simulate four stage slots using pre-cycle state, resolve the branch only at the supplied end-of-execute boundary, and record committed and squashed identities. Confirm that the final target drains through commit and the branch remains in the useful instruction count.",
    "sources": [
      {
        "title": "UC Berkeley CS 61C Course Notes: Control Hazards",
        "url": "https://notes.cs61c.org/content/pipeline-hazards/control-hazards/",
        "supports": "A wrong branch prediction requires discarding younger wrong-path instructions once resolution redirects fetch. Ohm specifies its own four-stage pipeline, resolution boundary, first target-fetch cycle and end-of-cycle commitment rather than importing the five-stage example's penalty."
      }
    ]
  },
  {
    "slug": "expansion-v8-majority-voter-common-cause",
    "title": "A majority vote does not remove the common-cause term",
    "version": 1,
    "signature": "e84c375c",
    "method": "reliability",
    "difficulty": "Hard",
    "authoredOn": "2026-10-30",
    "trace": [
      "Given no common cause, the wrong-majority cases are A and B only, A and C only, B and C only, or all three. Their probability is .01×.03×.98 + .01×.02×.97 + .03×.02×.99 + .01×.03×.02 = .001088, or 0.1088%.",
      "The two top-level branches are disjoint. Thus P(wrong) = .002×1 + .998×.001088 = .003085824, or 0.3085824%. Adding .002 directly to the unweighted conditional result would double-count the conditioning boundary.",
      "Common cause always produces a wrong vote here, so P(C and wrong) = .002. Bayes' rule gives P(C | wrong) = .002/.003085824 = .6481251037, or 64.81251037%.",
      "A separate algebraic check for the conditional majority term is pA pB + pA pC + pB pC − 2pA pB pC. The common-cause term alone already imposes a 0.2% floor on total error, even if every conditional channel error were eliminated."
    ],
    "formula": "qind = pA pB(1−pC) + pA pC(1−pB) + pB pC(1−pA) + pA pB pC; Pwrong = qcommon + (1−qcommon)qind; P(common|wrong) = qcommon/Pwrong",
    "inputs": [
      "Common-cause probability: P(C) = 0.002 per decision; guarantees all three reports wrong",
      "When C is absent: Independent conditional flips: A 0.010, B 0.030, C 0.020",
      "Voter: Perfect binary majority of the three reports",
      "Fault behavior: A failed report complements the intended bit; no erasures"
    ],
    "verification": "Enumerate the eight independent conditional channel-flip outcomes with exact rational weights, then add the separate common-cause branch using its own probability. Recover the posterior common-cause fraction and verify normalization, total-probability bounds and the irreducible common-cause floor.",
    "sources": [
      {
        "title": "NASA-GB-8719.13: NASA Software Safety Guidebook, Majority Voting and Fault Containment",
        "url": "https://standards.nasa.gov/sites/default/files/standards/NASA/Baseline/0/nasa-gb-871913.pdf",
        "supports": "Majority voting among three redundant reports can tolerate one incorrect report, while shared failure mechanisms need explicit consideration. Ohm's binary flips, perfect voter and disjoint common-cause/conditionally independent probability branches are hypothetical supplied assumptions, not a certified reliability claim."
      }
    ]
  },
  {
    "slug": "expansion-v8-hdl-natural-alignment-valid",
    "title": "Reject an unaligned transfer and the reserved size code",
    "version": 1,
    "signature": "2b0d4724",
    "method": "address",
    "difficulty": "Easy",
    "authoredOn": "2026-10-30",
    "trace": [
      "For s1 s0 = 00, every address is valid. For 01, only even addresses pass, giving condition ~a0.",
      "For size 10, the address must be divisible by four, requiring ~a1 & ~a0. Size 11 is rejected regardless of the address.",
      "Combining the byte and halfword cases gives ~s1 & (~s0 | ~a0). OR this with the word case s1 & ~s0 & ~a1 & ~a0 to obtain the reference expression.",
      "Higher address bits contribute multiples of four, so they cannot alter any requested alignment decision. Merely testing a0 would incorrectly accept a four-byte request at low address 10 and could accept the reserved size."
    ],
    "formula": "valid ⇔ size code ≠ 11 AND (byte address mod requested bytes) = 0",
    "inputs": [
      "Inputs: s1, s0, a1, a0; one settled bit each",
      "Size encoding: 00: 1 byte; 01: 2 bytes; 10: 4 bytes; 11: reserved",
      "Address bits: a1 a0 are the lowest two unsigned byte-address bits",
      "Output: y = legal size AND natural alignment"
    ],
    "verification": "Derive expected rows by integer address modulo the explicitly decoded transfer size, with separate rejection of the reserved code. Sweep multiple upper-address values to prove that only the two supplied low bits influence any legal size's alignment.",
    "sources": [
      {
        "title": "Arm AMBA AXI and ACE Protocol Specification IHI 0022H: Address Structure and Unaligned Transfers",
        "url": "https://developer.arm.com/-/media/Arm%20Developer%20Community/PDF/IHI0022H_amba_axi_protocol_spec.pdf",
        "supports": "Natural transfer alignment depends on transfer size and low-order byte-address bits. AXI can also permit unaligned transfers; Ohm explicitly defines a separate custom port that rejects them and a reserved size encoding, without misrepresenting that policy as a universal bus rule."
      }
    ]
  },
  {
    "slug": "expansion-v8-hdl-two-consumer-fork-release",
    "title": "Keep a forked beat until both consumers have accepted it",
    "version": 1,
    "signature": "09f81778",
    "method": "hdlEvents",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "When valid is one, consumer i is done by this edge if ai was already one or an unacknowledged ready consumer accepts now. The condition simplifies from ai | (~ai & ri) to ai | ri.",
      "Both consumers must be done, so release is valid & (a0 | r0) & (a1 | r1). The leading valid factor suppresses release for every no-beat pattern, even with stale acknowledgment bits.",
      "For example, a0 = 1, a1 = 0, r0 = 0, r1 = 1 releases the beat: consumer 0 finished earlier and consumer 1 finishes now. Requiring r0 & r1 would retain an already completed beat unnecessarily.",
      "If a0 = a1 = 0 and only r0 is high, do not release; record consumer 0's acceptance in the separate state. The data remains stable for consumer 1 and consumer 0 must not receive a duplicate. This expression checks completion only, not the entire sequential fork."
    ],
    "formula": "doneᵢ by edge = aᵢ OR (NOT(aᵢ) AND rᵢ), for valid beat; release = valid AND done0 AND done1",
    "inputs": [
      "Inputs: valid, a0, a1, r0, r1; one known bit each",
      "Prior completion state: ai = 1 means consumer i already accepted this beat",
      "New acceptance at next edge: valid AND NOT(ai) AND ri",
      "Output: y releases the beat when both consumers are done by this edge"
    ],
    "verification": "For every input row, build the set of consumers that have previously accepted, add independently computed new handshakes, and release only a valid beat completed by both. Simulate noncoincident consumer acceptances and verify one delivery per consumer with no premature release.",
    "sources": [
      {
        "title": "ETH Zurich / University of Bologna PULP common_cells: cc_stream_fork RTL",
        "url": "https://raw.githubusercontent.com/pulp-platform/common_cells/master/src/cc_stream_fork.sv",
        "supports": "A stream fork can retain per-consumer completion state and delay the upstream handshake until all outputs have accepted, avoiding duplicate output deliveries. Ohm's original two-consumer completion predicate explicitly supplies prior acknowledgment state and upcoming readiness; its state register and complete fork remain separate."
      }
    ]
  },
  {
    "slug": "expansion-v8-hdl-crc3-enabled-middle-state",
    "title": "Advance a streaming CRC tap only when a bit is accepted",
    "version": 1,
    "signature": "8773710e",
    "method": "hdlEvents",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "Before reduction, xR + d x³ = (q2 XOR d)x³ + q1 x² + q0 x. Because G = 0 in the remainder algebra, x³ is equivalent to x+1.",
      "Let f = q2 XOR d. The enabled next polynomial is q1 x² + (q0 XOR f)x + f, so its middle bit is q0 XOR q2 XOR d.",
      "The enable chooses that update or the old middle bit: y = en ? (q0 ^ q2 ^ d) : q1. It does not clear q1 when disabled and it uses pre-edge q2, not a newly updated state.",
      "Starting from zero and consuming a finite message most significant bit first, this recurrence produces the remainder of the message polynomial times x³. Inserting disabled edges leaves that result unchanged because no bit is consumed. A direct low-bit insertion recurrence without this augmentation convention computes a different state sequence."
    ],
    "formula": "f = q2 XOR d; enabled next R = q1 x² + (q0 XOR f)x + f; y = en ? (q0 XOR f) : q1",
    "inputs": [
      "Inputs: en, q2, q1, q0, d; one pre-edge known bit each",
      "Generator: G(x) = x³ + x + 1; coefficients in GF(2)",
      "Enabled next polynomial: remainder of xR(x) + d x³ modulo G(x)",
      "Disabled behavior: Hold state, do not accept d",
      "Output: y = coefficient of x in the NEXT state only"
    ],
    "verification": "Calculate next-state middle bits through an independent GF(2) long-division routine for xR+d x³, holding the old bit when disabled. Exhaust messages through eight bits and insert disabled edges, then compare complete state trajectories to direct message-polynomial augmentation and remainder.",
    "sources": [
      {
        "title": "Microchip AN730: CRC Generating and Checking",
        "url": "https://ww1.microchip.com/downloads/en/AppNotes/00730a.pdf",
        "supports": "CRC arithmetic reduces polynomials over GF(2) and can be implemented by shift registers and XOR feedback; input ordering and processing conventions matter. Ohm defines a custom CRC-3 polynomial recurrence and enable-hold behavior exactly, and checks streaming state against independent long polynomial division."
      }
    ]
  },
  {
    "slug": "expansion-v8-hdl-gray-fifo-next-full",
    "title": "Compare the next Gray pointer against a full-distance target",
    "version": 1,
    "signature": "b219cf8f",
    "method": "cdc",
    "difficulty": "Hard",
    "authoredOn": "2026-10-30",
    "trace": [
      "For a three-bit binary pointer, adding four modulo eight toggles B2 and keeps B1 and B0. Reflected Gray encoding therefore toggles G2 = B2 and G1 = B2 XOR B1, while G0 = B1 XOR B0 remains unchanged.",
      "The full-distance Gray target is consequently NOT(r2), NOT(r1), r0. Equality to that target requires wn2 XOR r2 = 1, wn1 XOR r1 = 1 and wn0 = r0.",
      "Using the supplied eq0 yields y = (wn2 ^ r2) & (wn1 ^ r1) & eq0. Inverting only the top Gray bit or all three Gray bits would test the wrong distance.",
      "For example, read binary 0 encodes 000 and its four-ahead binary target 4 encodes 110. A synchronized read snapshot can be older than the real read position, so this local comparison may conservatively retain full status after remote space is freed. It does not promise an immediate update across clock domains.",
      "This flag compares a candidate NEXT pointer, which lets separate sequential logic register the next full state. Applying it to a current pointer without preserving that convention shifts the admission decision by one entry."
    ],
    "formula": "full-distance Gray target = {NOT(r2), NOT(r1), r0}; next-full = upper-bit mismatches AND supplied low-bit equality",
    "inputs": [
      "FIFO depth and pointers: 4 entries; binary pointers modulo 8, encoded as reflected 3-bit Gray",
      "Next write upper bits: wn2, wn1; from the already-computed NEXT pointer",
      "Synchronized read upper bits: r2, r1; a write-domain snapshot that may lag",
      "Supplied low-bit comparison: eq0 = 1 iff wn0 = r0",
      "Flag definition: Next write binary pointer is exactly 4 ahead modulo 8 of snapshot"
    ],
    "verification": "Exhaust all 64 binary next-write/read-pointer pairs, encode them independently into reflected Gray, derive supplied low-bit equality, and compare the expression against a four-entry modulo-eight distance. Exhaust all 32 scalar input rows and distinguish current/next and delayed snapshot conventions.",
    "sources": [
      {
        "title": "ETH Zurich / University of Bologna PULP common_cells: cc_cdc_fifo_gray RTL and Architecture Notes",
        "url": "https://raw.githubusercontent.com/pulp-platform/common_cells/master/src/cc_cdc_fifo_gray.sv",
        "supports": "Gray-coded FIFO pointers are synchronized between clock domains, and local admission uses a potentially delayed remote-pointer snapshot. Ohm independently derives the exact four-entry reflected-Gray distance comparison from binary pointers, supplies the low-bit equality, and does not claim zero-latency remote visibility or full CDC verification."
      }
    ]
  }
];
