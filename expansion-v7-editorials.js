// Source-guided notes for the immutable v7 problem identities. No independent reviewer is claimed.
export const v7EditorialCatalog = [
  {
    "slug": "expansion-v7-current-loop-compliance-budget",
    "title": "Leave enough voltage for the two-wire transmitter",
    "version": 1,
    "signature": "f5dc0fde",
    "method": "interface",
    "difficulty": "Easy",
    "authoredOn": "2026-10-30",
    "trace": [
      "KVL gives 24 V = VTX + I(60 Ω + RLOAD). For any nonnegative receiver resistance, increasing the current reduces the transmitter terminal voltage, so the 20 mA endpoint is limiting.",
      "Reserve 9 V for the transmitter. The total permitted external resistance is (24 − 9)/0.020 = 750 Ω.",
      "The receiver can use only the resistance left after the round-trip wires: RLOAD,max = 750 − 60 = 690 Ω. At this boundary the transmitter has exactly its stipulated 9 V minimum.",
      "For the separate 250 Ω receiver check, the external series resistance is 310 Ω. Its drop at 20 mA is 6.2 V, leaving VTX = 24 − 6.2 = 17.8 V. This is within the defined regulation condition; no below-compliance current model is needed."
    ],
    "formula": "VTX = VS − I(RWIRE + RLOAD); RLOAD,max = (VS − VTX,min)/Imax − RWIRE",
    "inputs": [
      "Loop supply: 24 V DC",
      "Complete round-trip wire resistance: 60 Ω",
      "Minimum transmitter terminal voltage: 9 V",
      "Regulated current range: 4–20 mA",
      "Receiver for separate voltage check: 250 Ω"
    ],
    "verification": "Check KVL at each current endpoint and sweep the permitted receiver resistance. The maximum-load result must give exactly the stated minimum transmitter voltage at 20 mA, while the separate 250 Ω case retains a positive margin.",
    "sources": [
      {
        "title": "Analog Devices AN-1312: Applying the ADE7912/ADE7913 to 4 mA to 20 mA DC Measurements",
        "url": "https://www.analog.com/en/resources/app-notes/an-1312.html",
        "supports": "Series current-loop components consume a finite supply-voltage budget, including transmitter minimum operating voltage and wiring/receiver drops. The original exercise explicitly supplies its own compliance threshold and does not infer below-compliance behavior."
      }
    ]
  },
  {
    "slug": "expansion-v7-quarter-bridge-finite-strain",
    "title": "Keep the finite strain in a quarter bridge",
    "version": 1,
    "signature": "80864cb5",
    "method": "node",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "The specified strain changes the gauge by GF ε = 2 × 0.001 = 0.002 of its nominal resistance. Therefore RG = 1000(1.002) = 1002 Ω.",
      "Zero measurement current lets each vertical arm be treated as an independent divider. VRIGHT = 2.5 V and VLEFT = 5 × 1000/(1002 + 1000) = 2.4975024975 V.",
      "With the requested right-minus-left polarity, the exact output is 2.5 − 2.4975024975 = +0.0024975025 V = +2.4975025 mV. Increasing the upper-left resistance lowers VLEFT.",
      "Writing x = GF ε gives vB = 5x/[2(2 + x)]. Its first-order term is 5x/4 = +0.002500 V = +2.500000 mV. The small difference from the exact output is finite-strain curvature, even under the stipulated linear resistance law."
    ],
    "formula": "RG = R0(1 + GF ε); vB = VS/2 − VS/(2 + GF ε); vB,linear = VS GF ε/4",
    "inputs": [
      "Bridge excitation: 5.000 V",
      "Nominal resistors R0: 1000 Ω",
      "Active arm: Upper left RG",
      "Gauge factor GF: 2.00",
      "Tensile strain ε: +0.001000",
      "Output polarity: VRIGHT − VLEFT"
    ],
    "verification": "Reconstruct both midpoint voltages from independent KCL roots, apply the specified gauge law, and recover the linear sensitivity from a centered small-strain finite difference. Reject output polarity reversal and substitution of the linear estimate for the finite-strain result.",
    "sources": [
      {
        "title": "National Instruments: Measuring Strain with Strain Gages",
        "url": "https://www.ni.com/en/shop/data-acquisition/sensor-fundamentals/measuring-strain-with-strain-gages.html",
        "supports": "Gauge factor relates fractional resistance change to strain, and a Wheatstone bridge converts arm changes into a differential voltage. The original exercise defines its own active upper-left arm and right-minus-left polarity, and separately calculates exact and linearized outputs."
      }
    ]
  },
  {
    "slug": "expansion-v7-balanced-wye-line-power",
    "title": "Separate line voltage from phase voltage in a wye load",
    "version": 1,
    "signature": "2d482214",
    "method": "phasor",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "Balanced line voltages are separated by 120°. Their line-to-line difference has magnitude √3 times the phase voltage, so each branch sees 400/√3 = 230.940108 V RMS.",
      "The branch impedance magnitude is √(24² + 18²) = 30 Ω. Thus each branch current, also its line current in a wye, has RMS magnitude (400/√3)/30 = 7.69800359 A.",
      "Only the 24 Ω real part dissipates average real power. Each branch dissipates I² × 24 = 1422.222222 W, so the three-branch total is 4266.666667 W.",
      "As a separate check, cos φ = 24/30 = 0.8 and Ptotal = √3 × 400 × 7.69800359 × 0.8 = 4266.666667 W. Using the 400 V line-to-line value directly across a branch would overstate current and power."
    ],
    "formula": "Vphase,RMS = VLL,RMS/√3; Iline,RMS = Vphase,RMS/|Z|; Ptotal = 3 Iline,RMS² Re(Z)",
    "inputs": [
      "Source line-to-line magnitude: 400 V RMS",
      "Each wye branch impedance: 24 + j18 Ω",
      "Connection: Balanced wye; isolated star point",
      "Source and wires: Ideal; zero series impedance"
    ],
    "verification": "Reconstruct the square-root-of-three line-to-phase relation from 120-degree phase sinusoids; calculate branch current by complex impedance and integrate the sum of all three instantaneous load powers over a full period.",
    "sources": [
      {
        "title": "Schneider Electric PM1120H User Manual: Total Power Calculation",
        "url": "https://productinfo.se.com/pm1120h/pm1120h-user-manual/PM1120H%20User%20Manual/English/BM_PM1120H_0000155938.ditamap.xml/$/C_VerifyingAccuracy_PowerTotCalcuation_0000034437",
        "supports": "Balanced three-phase real power uses the line voltage, line current and power factor with the square-root-of-three factor. The original wye impedances and isolated balanced star point are stipulated, and phase conventions are independently reconstructed from sinusoidal waveforms."
      }
    ]
  },
  {
    "slug": "expansion-v7-difference-amplifier-ratio-mismatch",
    "title": "A tiny ratio mismatch leaks the common-mode voltage",
    "version": 1,
    "signature": "76a720dd",
    "method": "opamp",
    "difficulty": "Hard",
    "authoredOn": "2026-10-30",
    "trace": [
      "The noninverting divider gives P = kV2 with k = R4/(R3 + R4) = 100.100/110.100. Negative feedback sets N = P. KCL at N gives vOUT = (1 + R2/R1)P − (R2/R1)V1.",
      "Let a = (1 + R2/R1)k = 11k = 10.0009082652. Then vOUT = aV2 − 10V1. Substituting the input definitions yields ACM = a − 10 = +0.0009082652134 V/V and AD = (a + 10)/2 = 10.0004541326 V/V.",
      "For the specified inputs, V1 = 2.495 V and V2 = 2.505 V. Therefore vOUT = ACM × 2.500 + AD × 0.010000 = 0.1022752044 V = +102.2752044 mV.",
      "The ratio is |AD/ACM| = 11010.5 and the circuit CMRR is 20 log10(11010.5) = 80.8361408 dB. The ideal op amp does not remove the external resistor-ratio error; the common-mode input adds a measurable output error."
    ],
    "formula": "k = R4/(R3 + R4); a = (1 + R2/R1)k; ACM = a − R2/R1; AD = (a + R2/R1)/2; CMRR = 20 log10|AD/ACM|",
    "inputs": [
      "Inverting input and feedback: R1 = 10.000 kΩ; R2 = 100.000 kΩ",
      "Noninverting divider: R3 = 10.000 kΩ; R4 = 100.100 kΩ",
      "Common-mode input VCM: 2.500 V",
      "Differential input VD: +10.000 mV",
      "Input convention: V1 = VCM − VD/2; V2 = VCM + VD/2"
    ],
    "verification": "Solve the three simultaneous equations for the two input nodes and output, including input equality and each node KCL. Extract gains with separate common-mode and symmetric differential test excitations; verify their superposition at the specified operating point.",
    "sources": [
      {
        "title": "Texas Instruments SBOA582: Optimizing CMRR in Differential Amplifier Circuits With Precision Matched Resistor Divider Pairs",
        "url": "https://www.ti.com/lit/an/sboa582/sboa582.pdf",
        "supports": "External resistor-ratio mismatch produces finite common-mode rejection even with an ideal amplifier. The original circuit specifies one exact mismatch and symmetric definitions of differential and common-mode inputs; KCL independently determines both gains."
      }
    ]
  },
  {
    "slug": "expansion-v7-rc-timing-tolerance-corners",
    "title": "Guarantee a crossing time at both tolerance corners",
    "version": 1,
    "signature": "a65152fb",
    "method": "firstOrder",
    "difficulty": "Easy",
    "authoredOn": "2026-10-30",
    "trace": [
      "KCL gives C dvX/dt = (5 − vX)/R, hence vX = 5(1 − e^(−t/RC)). At 2.5 V, t = RC ln 2.",
      "The smallest time constant uses both minimum values: Rmin = 9.5 kΩ and Cmin = 90 nF. Their product is 0.855 ms, giving the earliest crossing 0.855 ln 2 = 0.592640839 ms.",
      "The largest time constant uses both maximum values: Rmax = 10.5 kΩ and Cmax = 110 nF. Their product is 1.155 ms, giving the latest crossing 1.155 ln 2 = 0.800584994 ms.",
      "The product bounds are −14.5% and +15.5% relative to nominal RC. Adding ±5% and ±10% would miss the cross term; a statistical combination would not guarantee the stated limits."
    ],
    "formula": "t50 = RC ln 2; tmin = Rnom(1 − 0.05) Cnom(1 − 0.10) ln 2; tmax = Rnom(1 + 0.05) Cnom(1 + 0.10) ln 2",
    "inputs": [
      "Ideal step: 0 → 5.000 V at t = 0",
      "Resistor: 10.0 kΩ ±5%",
      "Capacitor: 100 nF ±10%",
      "Threshold: Exactly 2.500 V",
      "Initial capacitor voltage: 0 V"
    ],
    "verification": "Integrate capacitor KCL and find its threshold crossing separately at all four independent component corners. Check monotonic crossing times and reject nominal-only or additive-percentage bounds.",
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: RC Circuits",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits",
        "supports": "Kirchhoff equations and the capacitor current law yield exponential first-order RC responses and the RC time constant. These principles support the original deterministic tolerance-corner timing exercise; no source exercise wording or values are reused."
      }
    ]
  },
  {
    "slug": "expansion-v7-charge-amplifier-finite-current-pulse",
    "title": "A finite sensor pulse charges and leaks at the same time",
    "version": 1,
    "signature": "abc7b0c7",
    "method": "integration",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "KCL at the summing node is CF dvOUT/dt + vOUT/RF = −IIN. The time constant is RF CF = 1.00 ms; positive current into N drives the output negative.",
      "During the pulse, the initial output is zero and the constant-current target is −IIN RF = −10 V. Thus vOUT(t) = −10(1 − e^(−t/1 ms)) V. At 50.0 μs it is −0.487705755 V = −487.705755 mV.",
      "The current falls to zero without an impulsive charge, so the capacitor voltage and output remain continuous. Thereafter vOUT(t) = vOUT(50 μs)e^(−(t−50 μs)/1 ms).",
      "At t = 1.000 ms the decay interval is 0.950 ms, yielding −0.188615823 V = −188.615823 mV. The lossless charge-only estimate −Q/CF = −500 mV at pulse end is close but misses current simultaneously leaving through RF."
    ],
    "formula": "CF dvOUT/dt + vOUT/RF = −IIN; vOUT,pulse = −IIN RF(1 − e^(−t/(RF CF))); vOUT,after = vEND e^(−(t−TP)/(RF CF))",
    "inputs": [
      "Feedback resistor RF: 1.00 MΩ",
      "Feedback capacitor CF: 1.00 nF, parallel with RF",
      "Sensor current into N: +10.0 μA for 0 ≤ t < 50.0 μs",
      "Initial output: 0 V",
      "Noninverting input: Ground"
    ],
    "verification": "Numerically integrate the virtual-ground KCL during and after the pulse, preserving capacitor-voltage continuity at the pulse boundary. Independently account for input charge shared between the feedback capacitor and simultaneous resistor conduction.",
    "sources": [
      {
        "title": "Texas Instruments SBOA287: Charge Amplifier Circuit",
        "url": "https://www.ti.com/lit/an/sboa287/sboa287.pdf",
        "supports": "An ideal charge amplifier uses a feedback capacitor in parallel with a feedback resistor that sets recovery. The original finite rectangular current pulse is calculated with both feedback branches active and explicit time references, rather than applying a pure charge impulse approximation."
      }
    ]
  },
  {
    "slug": "expansion-v7-interconnect-elmore-area-delay",
    "title": "Measure delay by the area above the RC step response",
    "version": 1,
    "signature": "8c390bb1",
    "method": "integration",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "The source-side equation is (1 − vX)/R1 = C1 dvX/dt + C2 dvY/dt. Integrating from zero to infinity gives TX/R1 = C1 + C2, since both node voltages increase by 1 V.",
      "Therefore TX = R1(C1 + C2) = 1000 × 30 pF = 30 ns. C2 contributes to this metric even though it is separated from X by R2.",
      "At Y, (vX − vY)/R2 = C2 dvY/dt. Integrating yields TY − TX = R2 C2 = 2000 × 20 pF = 40 ns, so TY = 70 ns.",
      "Equivalently, each capacitor is weighted by resistance shared along the path from the source to the observed node. This ladder has two coupled dynamic states, so these response-area integrals are not exact median or 50% crossing times and no factor of ln 2 is required."
    ],
    "formula": "TX = R1(C1 + C2); TY = R1(C1 + C2) + R2 C2; T = ∫₀∞(1 − v/Vfinal) dt",
    "inputs": [
      "R1: source to X: 1.00 kΩ",
      "R2: X to Y: 2.00 kΩ",
      "C1: X to ground: 10.0 pF",
      "C2: Y to ground: 20.0 pF",
      "Source and initial state: 0 → 1 V; both capacitors initially 0 V"
    ],
    "verification": "Integrate the coupled two-node KCL equations with two additional states accumulating the normalized response-error areas. Check resistor charge transport and distinguish these areas from separately located 50% crossings.",
    "sources": [
      {
        "title": "Stanford EE364A: Problems in VLSI Design",
        "url": "https://web.stanford.edu/class/ee364a/lectures/circuits.pdf",
        "supports": "The Elmore delay is the integral of the gap above a normalized step response, or first moment of the impulse response; an RC-tree path formula gives the same value. The original two-node ladder asks for this area explicitly and distinguishes it from a 50% crossing."
      }
    ]
  },
  {
    "slug": "expansion-v7-finite-edge-capacitive-crosstalk",
    "title": "A slower aggressor moves the victim peak away from the edge",
    "version": 1,
    "signature": "bb28cd39",
    "method": "integration",
    "difficulty": "Hard",
    "authoredOn": "2026-10-30",
    "trace": [
      "KCL at X gives (CG + CC) dx/dt + x/R = CC dvA/dt, with x(0) = 0. The victim time constant is R(CG + CC) = 100 ns, while the aggressor time constant is 20 ns.",
      "Solving this driven equation yields x(t) = 0.825[e^(−t/100 ns) − e^(−t/20 ns)] V. Since the aggressor is continuous, x starts at zero without an instantaneous voltage jump, and later decays back to zero.",
      "For the maximum, dx/dt = 0 gives tpeak = [100 × 20/(100 − 20)] ln(100/20) ns = 40.2359478 ns. Substituting this time gives xpeak = 0.441368601 V, so the absolute victim peak is 1.641368601 V.",
      "The falling threshold is x = 1.250 − 1.200 = 0.050 V. Solving 0.825[e^(−t/100 ns) − e^(−t/20 ns)] = 0.050 for t greater than tpeak gives 280.3346888 ns. An ideal-step charge-share jump or the earlier rising root answers a different question."
    ],
    "formula": "(CG + CC) dx/dt + x/R = CC dvA/dt; x = [CC/(CG + CC)] VA τV/(τV − τA) [e^(−t/τV) − e^(−t/τA)]; tpeak = τV τA ln(τV/τA)/(τV − τA)",
    "inputs": [
      "Aggressor waveform for t ≥ 0: 3.300[1 − exp(−t/(20.0 ns))] V",
      "Coupling capacitor CC: A to X: 2.00 pF",
      "Victim capacitor CG: X to ground: 8.00 pF",
      "Victim bias resistor R: 10.0 kΩ",
      "Ideal bias and initial vX: +1.200 V"
    ],
    "verification": "Numerically integrate the victim KCL driven by the specified aggressor derivative, locate the derivative-zero peak, and bracket both threshold crossings. Verify the requested later root and the initial continuity rather than assuming a charge-sharing jump.",
    "sources": [
      {
        "title": "Texas Instruments CapTIvate Technology Guide: Design Guide",
        "url": "https://software-dl.ti.com/msp430/msp430_public_sw/mcu/msp430/CapTIvate_Design_Center/latest/exports/docs/users_guide/html/CapTIvate_Technology_Guide_html/markdown/ch_design_guide.html",
        "supports": "Capacitive coupling allows an aggressor trace transition to disturb a neighboring victim. This reference supports the physical coupling mechanism only; the original exercise stipulates its own ideal lumped topology and independently derives and integrates its two-time-scale forced response."
      }
    ]
  },
  {
    "slug": "expansion-v7-bjt-vbe-multiplier-base-loading",
    "title": "Base current slightly stretches the bias spread",
    "version": 1,
    "signature": "2b1c9fb5",
    "method": "bjtBias",
    "difficulty": "Easy",
    "authoredOn": "2026-10-30",
    "trace": [
      "RBE carries VBE/RBE = 0.650 mA. Base KCL gives IRCB = 0.650 mA + IB, with IRCB flowing from collector to base.",
      "Collector KCL is IT = IC + IRCB = 99IB + 0.650 mA + IB. Thus IB = (2.00 − 0.650)/100 = 0.0135 mA, so IC = 1.3365 mA.",
      "IRCB = 0.6635 mA. The collector voltage is VC = VB + IRCB RCB = 0.650 + 0.0006635 × 2000 = 1.977 V. With VE = 0, VCE = 1.977 V.",
      "VC = 1.977 V exceeds VB = 0.650 V and both branch currents are positive. Neglecting base current would give 1.950 V, slightly understating the bias spread."
    ],
    "formula": "IB = (IT − VBE/RBE)/(β + 1); IC = βIB; VCE = VBE + RCB(VBE/RBE + IB)",
    "inputs": [
      "Injected current: IT = 2.00 mA into collector node",
      "Bias resistors: RCB = 2.00 kΩ; RBE = 1.00 kΩ",
      "Transistor model: VBE = 0.650 V; β = 99; ro → ∞",
      "Reference: Emitter at 0 V; VCE = VC − VE"
    ],
    "verification": "Independently solve simultaneous collector and base KCL, then check positive branch currents and VC > VB for forward-active consistency.",
    "sources": [
      {
        "title": "Texas Instruments: AN-1645 LM4702 Driving a MOSFET Output Stage",
        "url": "https://www.ti.com/lit/an/snaa045a/snaa045a.pdf",
        "supports": "The manufacturer describes a VBE multiplier bias spread set by a base-emitter resistor and collector-base resistor. The authored problem adds finite base-current loading explicitly and derives the resulting current split with KCL."
      }
    ]
  },
  {
    "slug": "expansion-v7-bjt-recombining-storage-charge",
    "title": "Removing stored charge also allows recombination",
    "version": 1,
    "signature": "f87f1baf",
    "method": "chargeControl",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "The solution while charge is positive is Q(t) = (Q0 + IRτs) exp(−t/τs) − IRτs. It begins at Q0 and has a strictly negative derivative.",
      "Setting Q(ts) = 0 gives ts = τs ln(1 + Q0/(IRτs)). For 20.0 mA, IRτs = 80.0 nC and ts = 4.00 ln(2.5) = 3.66516 µs.",
      "For a specified limit T, solve the same boundary equation for IR: IR = Q0/[τs(exp(T/τs) − 1)]. With T = 2.00 µs, this gives 46.2448 mA.",
      "Because ts decreases monotonically with positive IR, equality at 2.00 µs is the minimum drive satisfying the limit. The simpler Q0/IR estimate would omit simultaneous recombination; the model does not predict subsequent collector fall time."
    ],
    "formula": "Q(t) = (Q0 + IRτs)e^(−t/τs) − IRτs; ts = τs ln(1 + Q0/(IRτs)); IR,min = Q0/[τs(e^(T/τs) − 1)]",
    "inputs": [
      "Initial excess charge: Q(0) = 120 nC",
      "Storage lifetime: τs = 4.00 µs",
      "First reverse base drive: IR = 20.0 mA outward from base",
      "Second storage limit: Storage must finish within 2.00 µs"
    ],
    "verification": "Numerically integrate the supplied charge ODE to its first zero and independently bisect extraction current for the required storage bound. Check monotonicity, nonnegative modeled charge and exclusion of post-storage fall time.",
    "sources": [
      {
        "title": "Texas Instruments: Maximum Output Power and Thermal Considerations for UCC28720 and UCC28722",
        "url": "https://www.ti.com/lit/pdf/slua858",
        "supports": "The manufacturer explains that BJT turn-off requires removing stored charge and that reverse base current influences storage delay. The recombination differential equation and all numerical values are supplied educational assumptions in this original problem, rather than attributed device specifications."
      }
    ]
  },
  {
    "slug": "expansion-v7-bjt-collector-shot-noise-referral",
    "title": "Refer collector shot noise back to the input",
    "version": 1,
    "signature": "dad06c03",
    "method": "noise",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "The measurement width is 20,100 − 100 = 20,000 Hz. Current-noise variance is SiB = 2qICB, so in,rms = √(2 × 1.602 × 10^−19 × 0.000500 × 20,000) = 1.78997 nA.",
      "The collector resistor converts that noise current into output voltage: vo,rms = RC in,rms = 4000 × 1.78997 nA = 7.15989 µV. The direction of an individual fluctuation does not make RMS negative.",
      "gm = 0.000500/0.02500 = 0.02000 S. The signed signal gain is −gmRC = −80.0 V/V, so vi,eq,rms = 7.15989/80.0 = 0.0894986 µV.",
      "There is no extra factor of two: Si was supplied as a one-sided density and the positive-frequency passband was integrated once. Real RC also makes thermal noise, which was explicitly excluded to isolate this mechanism."
    ],
    "formula": "B = fH − fL; vo,rms = RC√(2qICB); vi,eq,rms = √(2qICB)/gm; gm = IC/VT",
    "inputs": [
      "Bias and thermal voltage: IC = 0.500 mA; VT = 25.00 mV",
      "Collector load / supply: RC = 4.00 kΩ to +5.00 V; VC = +3.00 V",
      "Only noise source: One-sided Si = 2qIC; q = 1.602 × 10^−19 C",
      "Measurement passband: 100 Hz ≤ f ≤ 20.100 kHz"
    ],
    "verification": "Integrate the one-sided PSD over the actual passband, propagate it through collector impedance and independently refer it through the signal gain. Check RMS positivity and reject duplicated negative-frequency bandwidth.",
    "sources": [
      {
        "title": "Analog Devices: AN-940 Low Noise Amplifier Selection Guide for Optimal Noise Performance",
        "url": "https://www.analog.com/en/resources/app-notes/an-940.html",
        "supports": "The manufacturer explains shot noise and input-referred noise accounting. The original problem explicitly defines one-sided collector-current spectral density, an ideal measurement band and a noiseless remainder of the circuit so no unmentioned resistor or base noise enters the answer."
      }
    ]
  },
  {
    "slug": "expansion-v7-bjt-partial-bypass-pole-zero",
    "title": "A partial emitter bypass creates both a zero and a pole",
    "version": 1,
    "signature": "6f0114e3",
    "method": "bjtSignal",
    "difficulty": "Hard",
    "authoredOn": "2026-10-30",
    "trace": [
      "The collector load is RC ∥ RL = 2.50 kΩ. Put G = gm + 1/rπ = 0.0404 S. Emitter KCL yields vbe/vin = 1/[1 + GZE(s)], with ZE(s) = 100 + 900/(1 + 0.009s) Ω.",
      "Therefore Av(s) = −100(1 + 0.009s)/(41.4 + 0.04536s). The low limit is −100/41.4 = −2.41546 V/V; the high limit is −100/5.04 = −19.84127 V/V. Both invert.",
      "The zero is at s = −1/0.009 and the pole at s = −41.4/0.04536. Thus fp = 41.4/(2π × 0.04536) = 145.260 Hz. Independently CE sees 900 ∥ (100 + 1/0.0404) = 109.565 Ω, giving the same pole.",
      "At ω = 2π × 100, use the magnitudes of both numerator and denominator: |Av| = 100√[1 + (0.009ω)²]/√[41.4² + (0.04536ω)²] = 11.42541 V/V.",
      "The capacitor is neither fully open nor fully short at 100 Hz. Bypassing RE2 gradually reduces degeneration, so magnitude rises between the two limits. The given VC > VB and positive emitter voltage are consistent with the stated forward-active bias."
    ],
    "formula": "Av(s) = −gm(RC ∥ RL)/[1 + (gm + 1/rπ)ZE(s)]; ZE(s) = RE1 + RE2/(1 + sRE2CE)",
    "inputs": [
      "Collector AC load: RC = RL = 5.00 kΩ; supplies are AC ground",
      "Transistor AC model: gm = 40.0 mS; rπ = 2.50 kΩ; ro → ∞",
      "Emitter network: RE1 = 100 Ω; RE2 = 900 Ω; CE = 10.0 µF across RE2",
      "Established bias: IC = 1.00 mA; VE = 1.01 V; VB = 1.71 V; VC = 7.00 V"
    ],
    "verification": "Use a complex two-node KCL solver at several frequencies, independently obtain the capacitor driving-point resistance and verify forward-active DC headroom. Compare the low/high limits with emitter-port test-current analysis.",
    "sources": [
      {
        "title": "Analog Devices: Chapter 9 Single Transistor Amplifier Stages",
        "url": "https://wiki.analog.com/university/courses/electronics/text/chapter-9",
        "supports": "The primary teaching chapter covers partial emitter bypass, its zero/pole behavior and the resistance seen by the bypass capacitor. This authored model retains finite r-pi and separately solves the emitter and bypass nodes rather than applying an infinite-beta simplification."
      }
    ]
  },
  {
    "slug": "expansion-v7-mos-subthreshold-decade-swing",
    "title": "Below threshold does not mean zero current",
    "version": 1,
    "signature": "7b82c728",
    "method": "subthreshold",
    "difficulty": "Easy",
    "authoredOn": "2026-10-30",
    "trace": [
      "nUT = 1.50 × 25.00 = 37.50 mV. At 0.275 V the gate difference from the reference is −75.00 mV, so the exponent is −2.",
      "ID = 1.00 µA × e^(−2) = 0.135335 µA = 135.335 nA. A subthreshold gate bias does not force the supplied exponential current to zero.",
      "For a 100-fold reduction, ID,new/ID,ref = 0.01 = exp(ΔVGS/37.50 mV). Therefore ΔVGS = 37.50 ln(0.01) = −172.694 mV.",
      "The final gate voltage is approximately 0.177306 V, still within the stipulated weak-inversion range. The negative change agrees with reducing positive NMOS drain current at fixed drain bias."
    ],
    "formula": "ID/IREF = exp[(VGS − VREF)/(nUT)]; ΔVGS = nUT ln(ID,new/ID,ref)",
    "inputs": [
      "Weak-inversion reference: IREF = 1.00 µA at VREF = 0.350 V",
      "Slope parameters: n = 1.50; UT = 25.00 mV",
      "Terminal bias: VS = VB = 0 V; VD = +1.00 V",
      "First gate voltage: VGS = 0.275 V"
    ],
    "verification": "Evaluate current ratios using the exponential law and independently solve the signed gate shift from logarithms. Confirm gate reduction reduces positive current and the stipulated drain factor is appropriate for VDS much greater than UT.",
    "sources": [
      {
        "title": "University of California Berkeley: EECS242 Active Technology for Communication Circuits",
        "url": "https://rfic.eecs.berkeley.edu/courses/ee242/pdf/eecs242_lect2_tech.pdf",
        "supports": "The original university lecture material describes weak-inversion exponential current and the slope factor n. The problem supplies its reference current, temperature scale, fixed drain-bias approximation and valid gate range explicitly."
      }
    ]
  },
  {
    "slug": "expansion-v7-mos-transmission-gate-resistance-envelope",
    "title": "Find the weak point of a complementary analog switch",
    "version": 1,
    "signature": "b8274e00",
    "method": "transmissionGate",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "At v = 1.65 V, both overdrives equal 1.05 V. Thus gn = 2.10 mS, gp = 1.05 mS and Ron = 1/3.15 mS = 317.460 Ω.",
      "For 0 ≤ v ≤ 0.600 V, only NMOS conducts and total conductance decreases as v rises. For 0.600 ≤ v ≤ 2.700 V, both conduct and gn + gp = (4.80 − v) mS, again decreasing.",
      "For 2.700 ≤ v ≤ 3.300 V, only PMOS conducts and conductance (v − 0.600) mS increases with v. Therefore the global minimum conductance occurs at the shared boundary v = 2.700 V.",
      "At that voltage NMOS conductance is zero and PMOS conductance is 2.10 mS, giving the largest Ron = 476.190 Ω. The maximum is displaced from midrail because the supplied NMOS coefficient is twice the PMOS coefficient."
    ],
    "formula": "Ron(v) = 1/[gn(v) + gp(v)]; gn = kn max(VDD − v − VTHN, 0); gp = kp max(v − |VTHP|, 0)",
    "inputs": [
      "Control and supply: NMOS gate 3.30 V; PMOS gate 0 V",
      "Body connections: NMOS body 0 V; PMOS body 3.30 V; body effect excluded",
      "Conductance coefficients: kn = 2.00 mS/V; kp = 1.00 mS/V",
      "Threshold magnitudes: VTHN = |VTHP| = 0.600 V"
    ],
    "verification": "Apply an infinitesimal port test voltage to sum both channel currents, enumerate all interval boundaries and analyze the slope of each conductance segment. Independently scan the full common-mode interval to locate the global resistance maximum.",
    "sources": [
      {
        "title": "Analog Devices: Selecting the Right CMOS Analog Switch",
        "url": "https://www.analog.com/en/resources/design-notes/selecting-the-right-cmos-analog-switch.html",
        "supports": "The manufacturer explains the parallel NMOS/PMOS transmission-gate structure and signal-dependent on resistance. The authored exercise supplies exact hypothetical piecewise conductances and explicitly excludes body effect rather than assuming a named part follows a square-law model."
      }
    ]
  },
  {
    "slug": "expansion-v7-mos-nonlinear-output-charge-energy",
    "title": "A capacitance curve has different charge and energy integrals",
    "version": 1,
    "signature": "9751d5f0",
    "method": "integration",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "Q(40) = ∫₀⁴⁰ C0/(1 + V/V0) dV = C0V0 ln(1 + 40/V0). With the supplied values Q = 20.0 nC × ln(5) = 32.1888 nC.",
      "Incremental energy is dE = V dQ = V Cdiff(V)dV. Integration gives E = C0V0[V − V0 ln(1 + V/V0)] evaluated at 40.0 V, so E = 0.478112 µJ.",
      "The ideal charging source supplies I = dQ/dt. Therefore t = Q/I = 32.1888 nC/20.0 mA = 1.60944 µs.",
      "The charge-equivalent capacitance Q/V and energy-equivalent capacitance 2E/V² differ because the differential capacitance falls with voltage. Substituting only Cdiff(40) into CV or ½CV² would not represent either integral."
    ],
    "formula": "Q(V) = ∫₀ⱽ Cdiff(u)du; E(V) = ∫₀ⱽ uCdiff(u)du; t = Q/I",
    "inputs": [
      "Differential capacitance: Cdiff(V) = 2.00 nF/(1 + V/10.0 V)",
      "Voltage excursion: Drain 0 → 40.0 V; source, gate and body at 0 V",
      "Charging current: I = 20.0 mA into the drain",
      "Reference and regime: Q(0) = E(0) = 0; channel off; no loss or breakdown"
    ],
    "verification": "Independently integrate differential charge and energy with numerical quadrature and solve constant-current charging time from accumulated charge. Check positive energy below Vfinal Q, compare distinct effective capacitances and reject endpoint-C approximations.",
    "sources": [
      {
        "title": "Infineon Technologies: FAQ MOSFET Output Capacitance Coss",
        "url": "https://community.infineon.com/t5/Knowledge-Base-Articles/FAQ-MOSFET-Output-Capacitance-Coss/ta-p/374758",
        "supports": "The manufacturer distinguishes voltage-dependent Coss from energy-equivalent and time/charge-equivalent capacitances. The problem supplies a reversible differential capacitance curve, integrating dQ and VdQ separately without claiming that a real named transistor is lossless."
      }
    ]
  },
  {
    "slug": "expansion-v7-mos-common-source-feedforward-zero",
    "title": "Gate-drain feedforward adds a right-half-plane zero",
    "version": 1,
    "signature": "8c0654c7",
    "method": "mosSignal",
    "difficulty": "Hard",
    "authoredOn": "2026-10-30",
    "trace": [
      "Let Gd = 1/RD + 1/ro = 0.100 mS. Gate KCL is (vg − vin)/RG + sCgs vg + sCgd(vg − vd) = 0. Drain KCL is Gd vd + sCL vd + sCgd(vd − vg) + gmvg = 0.",
      "Eliminating vg gives H(s) = (sCgd − gm)/(a s² + b s + Gd), where a = RG[(Cgs + Cgd)(CL + Cgd) − Cgd²] = 3.00 × 10^−16 and b = CL + Cgd + RG[(Cgs + Cgd)Gd + Cgdgm] = 1.40 × 10^−9 in consistent SI units.",
      "H(0) = −gm/Gd = −10.0 V/V. The two roots of the denominator are real and negative, with positive angular magnitudes approximately 72,556.67 rad/s and 4,594,109.99 rad/s. Dividing by 2π gives 11.54775 kHz and 731.17531 kHz.",
      "The numerator vanishes at sz = gm/Cgd = +1.00 × 10^7 s^−1. Its signed coordinate is +1591.54943 kHz, placing it in the right half-plane. A sign change to negative would incorrectly turn this feedforward zero into a minimum-phase zero.",
      "This real positive-s cancellation is not a notch on the imaginary frequency axis. Cgd both couples the nodes and adds a feedforward current opposing the controlled-source path, affecting high-frequency phase and any feedback design around the stage."
    ],
    "formula": "H(s) = (sCgd − gm)/{RG[(Cgs+Cgd)(CL+Cgd)−Cgd²]s² + [CL+Cgd+RG((Cgs+Cgd)Gd+Cgdgm)]s + Gd}; Gd = 1/RD + 1/ro",
    "inputs": [
      "Transistor / bias: gm = 1.00 mS; ro = 20.0 kΩ; VGS = 1.20 V; VTH = 0.60 V; VDS = 2.00 V",
      "External resistors: RG = 10.0 kΩ; RD = 20.0 kΩ",
      "Capacitances: Cgs = Cgd = CL = 100 pF",
      "AC reference: Source, body and supply are AC ground; H = vd/vin"
    ],
    "verification": "Build the nodal matrix directly from component currents, solve its generalized characteristic roots and verify transfer samples against the rational function. Check saturation headroom, both negative-real poles, capacitance-matrix positivity and positive-real-s zero cancellation.",
    "sources": [
      {
        "title": "Boris Murmann: COCOA Frequency Response of the Common-Source Voltage Amplifier",
        "url": "https://bmurmann.github.io/COCOA/contents/partI/partI.3.html",
        "supports": "The primary author-created course presents gate/drain nodal equations retaining Cgd and the common-source feedforward zero. This original exercise specifies an exact constant-capacitance two-node model and independently computes both denominator roots and the signed numerator cancellation."
      }
    ]
  },
  {
    "slug": "expansion-v7-cache-associative-address-fields",
    "title": "A way is not another address-index field",
    "version": 1,
    "signature": "49aac444",
    "method": "address",
    "difficulty": "Easy",
    "authoredOn": "2026-10-30",
    "trace": [
      "Each set contains 8×64 = 512 data bytes, so the cache has 16384/512 = 32 sets. The full cache has 256 lines, but a set index selects a group of eight lines rather than one of all 256 lines.",
      "A 64-byte line needs log₂64 = 6 low byte-offset bits. Thirty-two sets need log₂32 = 5 set-index bits.",
      "The remaining tag width is 32−6−5 = 21 bits. Thus bits [5:0] select a byte, bits [10:6] select a set and bits [31:11] carry the tag.",
      "Checking capacity gives 2⁵ sets × 8 ways × 2⁶ bytes = 16384 bytes. The way is identified by tag matches within the indexed set, so subtracting another three way bits from the address would wrongly shorten the tag."
    ],
    "formula": "sets = data bytes / (ways × bytes/line); offset = log₂(bytes/line); index = log₂(sets); tag = address width − offset − index",
    "inputs": [
      "Physical address: 32 bits; addresses name bytes",
      "Data capacity: 16 KiB = 16384 bytes; metadata excluded",
      "Organization: 8 ways per set; 64 data bytes per line",
      "Address fields: Upper tag, contiguous set index, low byte offset"
    ],
    "verification": "Count data lines and group them into eight ways per set, then derive the address field widths and reconstruct sample and boundary 32-bit byte addresses from independently decoded tag/index/offset coordinates. Capacity reconstruction confirms the way count does not consume incoming address bits.",
    "sources": [
      {
        "title": "MIT Computation Structures, Chris Terman: The Memory Hierarchy",
        "url": "https://computationstructures.org/lectures/caches/caches.html",
        "supports": "Conventional caches separate byte/block offsets, set selection and tags; associativity places multiple compared lines within a set. Ohm supplies its own data-only capacity and address width and independently reconstructs addresses."
      }
    ]
  },
  {
    "slug": "expansion-v7-fixed-point-negative-product-floor",
    "title": "Drop fractional product bits with the stated negative rounding rule",
    "version": 1,
    "signature": "a939f2a5",
    "method": "arithmetic",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "The unsigned encoding 0xF68B is 63115, hence Araw = 63115−65536 = −2421. Braw = 0x0A35 = 2613. The signed full product is P = −2421×2613 = −6326073.",
      "The product has 24 fractional bits and the output keeps eight. Therefore Y = floor(P/2¹⁶) = floor(−96.5282135009765625) = −97. Truncating toward zero would instead give −96, which is a different rule.",
      "The output represents −97/256 = −0.37890625. The exact product represents −6326073/16777216 = −0.377063333988189697265625.",
      "In output LSB units the signed error is (Y/256−P/2²⁴)/(1/256) = Y−P/65536 = −0.4717864990234375 LSB. It is negative and lies above −1 LSB, as expected for a floor quantizer without overflow."
    ],
    "formula": "P = signed16(Araw) × signed16(Braw); Y = floor(P/2^(24−8)); error[LSB] = Y − P/65536",
    "inputs": [
      "Input encodings: Araw = 0xF68B; Braw = 0x0A35; signed 16-bit",
      "Input scaling: Each raw integer / 4096; 12 fractional bits",
      "Product and output: Full signed 32-bit P; signed 16-bit Y with 8 fractional bits",
      "Precision reduction: Y = floor(P / 65536); no rounding to zero or nearest",
      "Error sign: Output minus exact product, in units of 1/256"
    ],
    "verification": "Decode both two's-complement encodings using BigInt, multiply without intermediate truncation, implement a floor quotient from signed integer division and remainder, and derive the LSB error as an exact rational. Check floor-quantizer residual bounds across additional signed pairs and reject toward-zero and sign-reversed answers.",
    "sources": [
      {
        "title": "Arm CMSIS-DSP: Vector Multiplication",
        "url": "https://arm-software.github.io/CMSIS-DSP/v1.11.0/group__BasicMult.html",
        "supports": "Fixed-point multiplication needs an explicit input/output scaling and overflow policy. Ohm's 12-fractional-bit inputs, eight-fractional-bit output and floor quantizer are a supplied custom format, not a claim about a CMSIS routine's exact implementation."
      }
    ]
  },
  {
    "slug": "expansion-v7-sram-write-end-window",
    "title": "Intersect every setup and hold limit before ending the write",
    "version": 1,
    "signature": "22700fa7",
    "method": "timingWindow",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "The lower bounds are T ≥ 3+14 = 17 ns from address setup to end, T ≥ 5+12 = 17 ns from CE#, T ≥ 8+10 = 18 ns from pulse width, and T ≥ 18+6 = 24 ns from data setup. Their intersection starts at 24 ns.",
      "Data hold requires T+2 ≤ 31 ns, giving T ≤ 29 ns. Address hold requires T+1 ≤ 40 ns, giving T ≤ 39 ns. WE# must also end the write before 42 ns. Data hold therefore determines the latest allowed end, 29 ns.",
      "The fixed start requirement is already satisfied: the address is valid 8−3 = 5 ns before WE# falls, exceeding the required 3 ns. OE# stays high as specified, avoiding output contention in this abstract model.",
      "Every T in the closed interval [24,29] ns satisfies all the requirements, including both endpoints. Its width is 29−24 = 5 ns. Using the 31 ns data-change time as the latest write-end would consume the required two-nanosecond hold interval."
    ],
    "formula": "Tmin = max(address start + tAW, CE fall + tCE, WE fall + tPW, data start + tDS); Tmax = min(data end − tDH, address end − tAH), also T < CE rise",
    "inputs": [
      "Address stability: 3…40 ns; 14 ns before end and 1 ns after end",
      "CE# low: 5…42 ns; at least 12 ns before end",
      "WE# pulse: Falls at 8 ns; rises at T < 42 ns; width ≥ 10 ns",
      "Data stability: 18…31 ns; setup ≥ 6 ns; hold ≥ 2 ns",
      "Start and output enable: Address setup to WE# fall ≥ 3 ns; OE# stays high"
    ],
    "verification": "Evaluate every setup, pulse, hold and fixed start inequality directly across a dense candidate-time sweep. Verify both inclusive feasible endpoints and epsilon failures immediately outside them; distinguish setup-derived lower bounds from hold-derived upper bounds and preserve the WE-controlled ending-edge contract.",
    "sources": [
      {
        "title": "Infineon / Cypress CY7C1049CV33 Automotive SRAM datasheet, 001-67511 Rev. C",
        "url": "https://www.infineon.com/dgdl/Infineon-CY7C1049CV33_Automotive_4-Mbit_(512_K_8)_Static_RAM_Datasheet-AdditionalTechnicalInformation-v04_00-EN.pdf?fileId=8ac78c8c7d0d8da4017d0ecb84f04508",
        "supports": "Write timing depends on CE/WE overlap, the terminating edge and data setup/hold relative to that edge; OE high disables output drive. The exercise deliberately uses hypothetical numerical requirements and checks their intersection, rather than substituting these device ratings."
      }
    ]
  },
  {
    "slug": "expansion-v7-burst-page-boundary-segmentation",
    "title": "Split at both the page edge and controller burst cap",
    "version": 1,
    "signature": "81fcc759",
    "method": "burstBoundary",
    "difficulty": "Hard",
    "authoredOn": "2026-10-30",
    "trace": [
      "The next aligned page starts at 0x2000. There are 0x2000−0x1FB0 = 0x50 = 80 bytes left in the initial page, so the first burst is limited to 80/8 = 10 beats, below the sixteen-beat cap. It ends at byte 0x1FFF.",
      "Seventeen beats remain at 0x2000. The next page has ample room, so the second burst uses the cap of 16 beats and covers 128 bytes from 0x2000 through 0x207F.",
      "One beat remains. The third and final burst starts at 0x2080, decimal 8320, and writes through 0x2087, decimal 8327. The burst counts are 10, 16 and 1, totaling 27.",
      "An independent endpoint check gives initial address 8112 plus 27×8−1 = 215, hence final byte 8327. Simply taking ceil(27/16) = 2 bursts omits the first page boundary and cannot satisfy both constraints."
    ],
    "formula": "beats/burst = min(remaining beats, 16, (4096 − (start mod 4096))/8); next start = start + 8×beats; final byte = initial + total bytes − 1",
    "inputs": [
      "Write sequence: 27 beats × 8 bytes, contiguous and aligned",
      "Initial byte address: 0x1FB0, hexadecimal",
      "Controller limit: At most 16 beats per burst",
      "Page rule: No burst crosses a 4096-byte aligned boundary",
      "Splitting policy: Longest legal burst at each step; inclusive last byte"
    ],
    "verification": "Construct the byte sequence burst by burst, prove each burst is aligned, within sixteen beats and confined to a page, and compare the exact emitted bytes against the original contiguous write. A separate shortest-path recurrence proves the minimum burst count for this contract, with exact-edge controls for off-by-one mistakes.",
    "sources": [
      {
        "title": "Arm AMBA AXI and ACE Protocol Specification, IHI 0022H, A3.4.1",
        "url": "https://developer.arm.com/-/media/Arm%20Developer%20Community/PDF/IHI0022H_amba_axi_protocol_spec.pdf",
        "supports": "AXI provides background for page-boundary burst restrictions. Ohm independently defines an aligned eight-byte, incrementing, no-crossing custom controller with a sixteen-beat cap; it does not misstate the larger AXI4 INCR limit as sixteen."
      }
    ]
  },
  {
    "slug": "expansion-v7-hdl-two-phase-pending",
    "title": "A completed toggle must be acknowledged before it is idle",
    "version": 1,
    "signature": "73eec98a",
    "method": "hdlEvents",
    "difficulty": "Easy",
    "authoredOn": "2026-10-30",
    "trace": [
      "When req and ack agree, the acknowledgment has caught up and no event is pending. Both 00 and 11 are idle states.",
      "When the phases differ, exactly one request transition remains unacknowledged. XOR detects both req = 1, ack = 0 and req = 0, ack = 1.",
      "The reporting enable gates that mismatch, giving y = en & (req ^ ack). Disabling reporting suppresses y without consuming the pending event; re-enabling reports it again if ack has not caught up.",
      "A req & ~ack detector would recognize only one transition polarity and lose every other event. This known-bit flag relies on the separately stated synchronization and one-outstanding-event discipline; passing its eight rows does not verify physical CDC safety."
    ],
    "formula": "reported pending = enabled AND (request phase differs from acknowledged phase)",
    "inputs": [
      "Inputs: en, req, ack; settled one-bit values in one domain",
      "Idle: Request and acknowledgment phases equal, either both 0 or both 1",
      "Outstanding event: Source has toggled req; destination has not yet matched ack",
      "Enable: en masks only the flag; it never changes phase state"
    ],
    "verification": "Enumerate all eight known-bit input states from enabled outstanding-event semantics and test a two-event phase trace with delayed acknowledgments, both idle polarities and temporary reporting disable. Reject a one-polarity level detector; synchronization and reset behavior are expressly outside this combinational exercise.",
    "sources": [
      {
        "title": "ETH Zurich / University of Bologna PULP common_cells: cc_cdc_2phase SystemVerilog implementation",
        "url": "https://raw.githubusercontent.com/pulp-platform/common_cells/master/src/cc_cdc_2phase.sv",
        "supports": "The original library implementation uses request/acknowledgment phase equality for source readiness, with separate synchronizers and explicit reset constraints. Ohm isolates a settled same-domain mismatch-reporting predicate and explicitly leaves synchronizers, resets and state updates outside the assignment."
      }
    ]
  },
  {
    "slug": "expansion-v7-hdl-signed-times-four-fit",
    "title": "Check the sign extension before shifting two places",
    "version": 1,
    "signature": "ed0aea91",
    "method": "hdlSigned",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "The exact product fits when −8 ≤ 4A ≤ 7. Since A is an integer, this permits only A ∈ {−2,−1,0,1}.",
      "Those encodings are 1110, 1111, 0000 and 0001. Their top three bits agree; a0 may be either value.",
      "The two equality tests can be written as ~(a3 ^ a2) and ~(a3 ^ a1). ANDing them yields y = ~(a3 ^ a2) & ~(a3 ^ a1), independent of a0.",
      "For A = 2, the exact product 8 exceeds +7 even though retaining four bits yields 1000, interpreted as −8. For A = −2, exact product −8 is valid. Looking only at a wrapped result or at just one shifted-out bit misses the specified overflow condition."
    ],
    "formula": "fit ⇔ −8 ≤ 4A ≤ 7 ⇔ A ∈ {−2,−1,0,1} ⇔ a3 = a2 = a1",
    "inputs": [
      "Input encoding: A = signed four-bit a3 a2 a1 a0; range −8…+7",
      "Operation: Exact mathematical product 4×A",
      "Output: y = 1 iff product fits signed four-bit range without wrap",
      "Workbench: One scalar Boolean assignment; no arithmetic or vector syntax"
    ],
    "verification": "Decode every four-bit input as an exact signed integer and compare four times that value against minus eight and plus seven. Exhaustively compare the independent range predicate with the stored truth rows, reference assignment and a separate equality form, including both valid negative and invalid wrapped cases.",
    "sources": [
      {
        "title": "University of Washington CSE 351, Ellis Haker: Integers II, Summer 2024",
        "url": "https://courses.cs.washington.edu/courses/cse351/24su/lectures/05/CSE351-05-integersII_24su_ink.pdf",
        "supports": "Two's-complement values have finite signed ranges, sign extension preserves value, and left shifts can lose significant bits. Ohm's exact multiply-by-four fit flag is checked against signed integer arithmetic for every four-bit encoding, independently of its Boolean reference."
      }
    ]
  },
  {
    "slug": "expansion-v7-hdl-radix4-booth-negative",
    "title": "A high recoding bit does not always mean a negative partial product",
    "version": 1,
    "signature": "6584808d",
    "method": "hdlLogic",
    "difficulty": "Medium",
    "authoredOn": "2026-10-30",
    "trace": [
      "For h = 0, D = m+l is 0, 1 or 2, so y is zero. For h = 1, the digits for groups 100, 101, 110 and 111 are −2, −1, −1 and 0.",
      "Thus a negative digit needs h = 1 and excludes only the m = l = 1 case. Its Boolean condition is h & ~(m & l).",
      "Applying en gives y = en & h & ~(m & l). Group 100 selects a negative digit with magnitude two; 101 and 110 select magnitude one; 111 selects no partial product.",
      "The overlapping lower bit is part of the signed-digit recoding, not a separate carry-in. Using en & h alone would incorrectly mark 111 as a negative nonzero digit. This expression supplies only the sign decision under the stated digit definition."
    ],
    "formula": "D = −2h + m + l; negative ⇔ h = 1 and (m,l) ≠ (1,1); y = enabled negative flag",
    "inputs": [
      "Inputs: en, h, m, l; four one-bit inputs",
      "Group order: h m l; l overlaps the preceding group",
      "Recoding digit: D = −2h + m + l; signed integer −2…+2",
      "Output: y = enabled negative NONZERO digit flag"
    ],
    "verification": "Derive each expected row by integer evaluation of the supplied signed recoding digit and strict negativity, not by the answer expression. Reconstruct all sixteen signed four-bit multipliers from overlapping radix-four digits and specifically reject the high-bit-only detector at the zero digit 111.",
    "sources": [
      {
        "title": "MIT 6.175: Lab 3, Multipliers, Radix-4 Booth Multiplier",
        "url": "https://csg.csail.mit.edu/6.175/labs/lab3-multipliers.html",
        "supports": "Radix-four Booth recoding uses overlapping groups of three multiplier bits and signed digits from minus two to plus two. The original flag exercise defines its digit algebra directly; tests separately reconstruct every signed four-bit multiplier from its two radix-four digits."
      }
    ]
  },
  {
    "slug": "expansion-v7-hdl-alu-less-equal-flags",
    "title": "Choose signed or unsigned ordering from the same subtraction",
    "version": 1,
    "signature": "35a89466",
    "method": "hdlSigned",
    "difficulty": "Hard",
    "authoredOn": "2026-10-30",
    "trace": [
      "For unsigned operands, c = 1 means A ≥ B. Strict A < B therefore uses ~c, and including equality yields z | ~c.",
      "For signed operands, the correct strict comparison is n ^ v: when the exact signed subtraction overflows, v corrects the retained sign bit. Including equality yields z | (n ^ v).",
      "Select the unsigned path when u is one and the signed path otherwise. Since equality belongs to both, factor z outside the selection: y = z | (u ? ~c : (n ^ v)).",
      "For four-bit operands A = 0111 (+7), B = 1111 (−1 signed, 15 unsigned), the retained difference is 1000 with n = 1, v = 1, c = 0 and z = 0. The signed answer is false while the unsigned answer is true, demonstrating why one unqualified sign test cannot serve both modes.",
      "Equal operands produce z = 1 and must pass either mode. Exhausting flag patterns checks the defined Boolean selection; independently deriving flags from actual operand subtractions checks the arithmetic interpretation and carry convention."
    ],
    "formula": "unsigned ≤ = Z OR NOT(C); signed ≤ = Z OR (N XOR V); select unsigned when u = 1",
    "inputs": [
      "Inputs: u, n, v, c, z; five settled one-bit inputs",
      "Carry convention: c = 1 means NO borrow for A + NOT(B) + 1",
      "Mode: u = 1 unsigned; u = 0 signed two's complement",
      "Output: y = selected A ≤ B, including equality",
      "All-pattern contract: Unsigned: zero or borrow; signed: zero or differing n/v"
    ],
    "verification": "Exhaust all thirty-two explicitly defined flag/mode rows. Separately enumerate every pair of four-bit operands in both modes, derive carry from extended addition and overflow from exact signed subtraction range, and compare the compiled flag function with mathematical signed or unsigned less-than-or-equal.",
    "sources": [
      {
        "title": "Arm, Jacob Bramley: Condition Codes 1, Condition Flags and Codes",
        "url": "https://developer.arm.com/community/arm-community-blogs/b/architectures-and-processors-blog/posts/condition-codes-1-condition-flags-and-codes",
        "supports": "Subtraction flags distinguish signed from unsigned comparison: signed ordering needs overflow correction, while unsigned ordering depends on the no-borrow carry convention; equality uses zero. Ohm specifies all scalar checker rows and independently derives real four-bit subtraction flags and exact comparisons."
      }
    ]
  }
];
