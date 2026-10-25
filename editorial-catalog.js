// Released problem identities and worked traces. Source problem data is immutable.
// These are source-guided teaching notes, not 216 independent editorial reviews.
export const editorialCatalog = [
  {
    "slug": "one-loop-two-resistors",
    "title": "One loop, two resistors",
    "version": 1,
    "signature": "a714880e",
    "method": "series",
    "difficulty": "Easy",
    "trace": [
      "The total series resistance is 6 kΩ.",
      "KVL gives I = 12 V / 6 kΩ = 2 mA."
    ],
    "formula": "I = V / (R₁ + R₂)",
    "inputs": [
      "Source: 12 V",
      "R₁: 2 kΩ",
      "R₂: 4 kΩ"
    ],
    "sources": []
  },
  {
    "slug": "balance-the-node",
    "title": "Balance the node",
    "version": 1,
    "signature": "a90b42ab",
    "method": "node",
    "difficulty": "Easy",
    "trace": [
      "KCL requires 8 mA to leave the node because 8 mA enters.",
      "The unknown branch carries 8 − 3 = 5 mA out of the node."
    ],
    "formula": "Σ I_entering = Σ I_leaving",
    "inputs": [
      "Entering currents: 6 mA, 2 mA",
      "Known leaving current: 3 mA"
    ],
    "sources": []
  },
  {
    "slug": "loaded-voltage-divider",
    "title": "A divider under load",
    "version": 1,
    "signature": "3acd3e3f",
    "method": "node",
    "difficulty": "Medium",
    "trace": [
      "The two ground-connected resistors combine to 2 kΩ.",
      "The loaded divider gives Vout = 12 × 2 / (3 + 2) = 4.8 V."
    ],
    "formula": "Vout = Vs (R₂ || RL) / [R₁ + (R₂ || RL)]",
    "inputs": [
      "Supply: 12 V",
      "Top resistor: 3 kΩ",
      "Bottom resistor: 6 kΩ",
      "Load: 3 kΩ"
    ],
    "sources": []
  },
  {
    "slug": "floating-source-supernode",
    "title": "The floating source",
    "version": 1,
    "signature": "16ca6b8e",
    "method": "supernode",
    "difficulty": "Hard",
    "trace": [
      "KCL for the supernode gives VA + 2VB = 12.",
      "Substitute VA = VB + 3 to get 3VB = 9, so VB = 3 V.",
      "Therefore VA = 6 V. Its resistor carries 1 mA, and the B resistor carries the remaining 1 mA."
    ],
    "formula": "VA/RA + VB/RB = Is; VA − VB = Vs",
    "inputs": [
      "A to ground: 6 kΩ",
      "B to ground: 3 kΩ",
      "Floating source: VA − VB = 3 V",
      "Injected into A: 2 mA"
    ],
    "sources": []
  },
  {
    "slug": "rc-time-constant",
    "title": "Find the time constant",
    "version": 1,
    "signature": "5875c405",
    "method": "firstOrder",
    "difficulty": "Easy",
    "trace": [
      "τ = RC = 4700 × 10 × 10⁻⁶ = 0.047 s.",
      "The time constant is 47 ms."
    ],
    "formula": "τ = RC",
    "inputs": [
      "R: 4.7 kΩ",
      "C: 10 μF"
    ],
    "sources": []
  },
  {
    "slug": "charging-after-one-tau",
    "title": "One time constant later",
    "version": 1,
    "signature": "6cc081cf",
    "method": "firstOrder",
    "difficulty": "Medium",
    "trace": [
      "The time constant is 10 kΩ × 20 μF = 200 ms.",
      "At one time constant, vC = 5(1 − e⁻¹) ≈ 3.1606 V."
    ],
    "formula": "vC(t) = Vf + (V₀ − Vf)e^(−t/τ)",
    "inputs": [
      "Final source voltage: 5 V",
      "R: 10 kΩ",
      "C: 20 μF",
      "Initial voltage: 0 V",
      "Elapsed time: 200 ms"
    ],
    "sources": []
  },
  {
    "slug": "discharge-to-quarter-voltage",
    "title": "Discharge to one quarter",
    "version": 1,
    "signature": "0f763d7f",
    "method": "firstOrder",
    "difficulty": "Medium",
    "trace": [
      "The time constant is 300 ms.",
      "The voltage ratio is 2/8 = 1/4, so t = 300 ln(4) ≈ 415.888 ms."
    ],
    "formula": "t = RC ln(V₀ / Vtarget)",
    "inputs": [
      "Initial voltage: 8 V",
      "Target voltage: 2 V",
      "R: 3 kΩ",
      "C: 100 μF"
    ],
    "sources": []
  },
  {
    "slug": "loaded-rc-transient",
    "title": "An RC node with a load",
    "version": 1,
    "signature": "a2b6c19f",
    "method": "firstOrder",
    "difficulty": "Hard",
    "trace": [
      "At DC steady state the capacitor is open, giving Vf = 12 × 3/(6 + 3) = 4 V.",
      "The resistance seen by the capacitor is 2 kΩ, so τ = 20 ms.",
      "Capacitor voltage is continuous: vC(0⁺) = 1 V. Therefore vC(40 ms) = 4 + (1 − 4)e⁻² ≈ 3.59399 V."
    ],
    "formula": "vC(t) = Vf + [vC(0⁺) − Vf]e^(−t/(Rth C))",
    "inputs": [
      "Supply: 12 V",
      "Supply to node: 6 kΩ",
      "Node to ground: 3 kΩ",
      "C: 10 μF",
      "vC(0⁻): 1 V",
      "Time: 40 ms"
    ],
    "sources": []
  },
  {
    "slug": "bjt-current-gain",
    "title": "From base to collector",
    "version": 1,
    "signature": "963b0451",
    "method": "bjtCurrent",
    "difficulty": "Easy",
    "trace": [
      "IC = βIB = 120 × 25 μA = 3000 μA.",
      "The collector current is 3 mA."
    ],
    "formula": "IC = βIB",
    "inputs": [
      "β: 120",
      "IB: 25 μA",
      "Operating region: Forward active"
    ],
    "sources": []
  },
  {
    "slug": "bjt-switch-current-limit",
    "title": "A switch reaches saturation",
    "version": 1,
    "signature": "d2484614",
    "method": "bjtSwitch",
    "difficulty": "Medium",
    "trace": [
      "The forward-active estimate is 10 mA, exceeding the load's limit.",
      "The transistor saturates in the specified model, so IC = 4.8 V / 1 kΩ = 4.8 mA."
    ],
    "formula": "IC = min[βIB, (VCC − VCE(sat))/RC]",
    "inputs": [
      "VCC: 5 V",
      "RC: 1 kΩ",
      "IB: 100 μA",
      "β: 100",
      "VCE(sat): 0.20 V"
    ],
    "sources": []
  },
  {
    "slug": "emitter-resistor-bias",
    "title": "Bias with emitter feedback",
    "version": 1,
    "signature": "0517c563",
    "method": "bjtBias",
    "difficulty": "Hard",
    "trace": [
      "The base-emitter loop gives IB = 4.3 V / [43 kΩ + 100 × 1 kΩ] = 30.0699 μA.",
      "IE ≈ 3.00699 mA, so VE ≈ 3.00699 V and VB ≈ 3.70699 V.",
      "IC ≈ 2.97692 mA gives VC ≈ 6.04615 V. Since VC > VB and the base-emitter junction is forward biased, forward-active operation is consistent."
    ],
    "formula": "IB = (VBB − VBE) / [RB + (β + 1)RE]",
    "inputs": [
      "Base supply: 5 V",
      "RB: 43 kΩ",
      "RE: 1 kΩ",
      "Collector supply / RC: 12 V / 2 kΩ",
      "β / VBE: 99 / 0.70 V"
    ],
    "sources": []
  },
  {
    "slug": "bjt-transconductance",
    "title": "Small-signal transconductance",
    "version": 1,
    "signature": "eee3945b",
    "method": "bjtSignal",
    "difficulty": "Medium",
    "trace": [
      "Differentiating IC = IS exp(VBE/VT) gives gm = IC/VT.",
      "gm = 0.002/0.025 = 0.08 S = 80 mS."
    ],
    "formula": "gm = IC / VT",
    "inputs": [
      "IC: 2 mA",
      "VT: 25 mV"
    ],
    "sources": []
  },
  {
    "slug": "identify-nmos-region",
    "title": "Which NMOS region?",
    "version": 1,
    "signature": "81b9575c",
    "method": "mosBias",
    "difficulty": "Easy",
    "trace": [
      "VGS > VTH, so the NMOS is on.",
      "VDS = 1.5 V exceeds the 1.3 V overdrive, placing the device in saturation."
    ],
    "formula": "Saturation: VGS > VTH and VDS ≥ VGS − VTH",
    "inputs": [
      "VGS: 2.0 V",
      "VDS: 1.5 V",
      "VTH: 0.7 V"
    ],
    "sources": []
  },
  {
    "slug": "nmos-saturation-current",
    "title": "Square-law drain current",
    "version": 1,
    "signature": "d1b8849a",
    "method": "mosBias",
    "difficulty": "Medium",
    "trace": [
      "VOV = 1.4 − 0.6 = 0.8 V. Since VDS ≥ VOV, the saturation model applies.",
      "ID = (2/2) × 0.8² = 0.64 mA."
    ],
    "formula": "ID = (k/2)(VGS − VTH)²",
    "inputs": [
      "VGS: 1.4 V",
      "VDS: 2.0 V",
      "VTH: 0.6 V",
      "k: 2 mA/V²"
    ],
    "sources": []
  },
  {
    "slug": "nmos-triode-current",
    "title": "Inside the triode region",
    "version": 1,
    "signature": "85376624",
    "method": "mosBias",
    "difficulty": "Medium",
    "trace": [
      "The overdrive is 1.2 V, which is larger than VDS = 0.2 V, so triode operation is consistent.",
      "ID = 2[0.24 − 0.02] = 0.44 mA."
    ],
    "formula": "ID = k[(VGS − VTH)VDS − VDS²/2]",
    "inputs": [
      "VGS: 1.8 V",
      "VDS: 0.2 V",
      "VTH: 0.6 V",
      "k: 2 mA/V²"
    ],
    "sources": []
  },
  {
    "slug": "nmos-source-self-bias",
    "title": "Solve a self-biased NMOS",
    "version": 1,
    "signature": "b7e9136c",
    "method": "mosBias",
    "difficulty": "Hard",
    "trace": [
      "With x = ID in mA, VS = x V and gate overdrive is 1 − x V.",
      "Solve x² − 3x + 1 = 0. The roots are (3 ± √5)/2, approximately 0.381966 and 2.618034.",
      "The larger root produces negative overdrive and violates the model's on-state condition. For the smaller root, VDS ≈ 4.618 V exceeds VOV ≈ 0.618 V, confirming saturation."
    ],
    "formula": "ID = (k/2)(VG − ID RS − VTH)²",
    "inputs": [
      "Gate / drain: 2 V / 5 V",
      "RS: 1 kΩ",
      "VTH: 1 V",
      "k: 2 mA/V²"
    ],
    "sources": []
  },
  {
    "slug": "boolean-absorption",
    "title": "Simplify the enable logic",
    "version": 1,
    "signature": "fb49fecf",
    "method": "boolean",
    "difficulty": "Easy",
    "trace": [
      "If A = 1, F = 1. If A = 0, F = B.",
      "These are exactly the two cases of A OR B."
    ],
    "formula": "A + A′B = A + B",
    "inputs": [
      "Function: A OR ((NOT A) AND B)",
      "Input domain: A, B ∈ {0, 1}"
    ],
    "sources": []
  },
  {
    "slug": "full-adder-output",
    "title": "Read a full adder",
    "version": 1,
    "signature": "0b442d4b",
    "method": "boolean",
    "difficulty": "Easy",
    "trace": [
      "The integer input sum is 2.",
      "Writing 2 as 2 × 1 + 0 gives Cout = 1 and Sum = 0, so the requested pair is (0, 1)."
    ],
    "formula": "Sum = A XOR B XOR Cin; Cout = AB OR ACin OR BCin",
    "inputs": [
      "A: 1",
      "B: 1",
      "Cin: 0"
    ],
    "sources": []
  },
  {
    "slug": "signed-addition-overflow",
    "title": "The sign bit flips",
    "version": 1,
    "signature": "7215d768",
    "method": "arithmetic",
    "difficulty": "Medium",
    "trace": [
      "The operands are +118 and +30, with exact sum +148.",
      "The retained bit pattern 10010100 represents 148 − 256 = −108 in two's complement.",
      "Because +148 exceeds +127, signed overflow occurred."
    ],
    "formula": "Signed value = unsigned value − 256 when bit 7 is 1",
    "inputs": [
      "Operand A: 01110110₂",
      "Operand B: 00011110₂",
      "Result width: 8 bits"
    ],
    "sources": []
  },
  {
    "slug": "setup-time-budget",
    "title": "Close the setup path",
    "version": 1,
    "signature": "f61034a1",
    "method": "timing",
    "difficulty": "Hard",
    "trace": [
      "The latest data arrival is 80 + 310 + 40 = 430 ps after launch.",
      "The setup deadline is T − 20 − 70 = T − 90 ps.",
      "Thus 430 ≤ T − 90, giving a minimum T of 520 ps."
    ],
    "formula": "Tmin = tCQ,max + tlogic,max + twire,max + tsetup + 20 ps",
    "inputs": [
      "Clock-to-Q max: 80 ps",
      "Logic max: 310 ps",
      "Data interconnect max: 40 ps",
      "Setup: 70 ps",
      "Capture arrival: T − 20 ps"
    ],
    "sources": []
  },
  {
    "slug": "write-a-two-input-xor",
    "title": "Write a two-input XOR",
    "version": 1,
    "signature": "9079ab25",
    "method": "hdlLogic",
    "difficulty": "Easy",
    "trace": [
      "The one-bit XOR a ^ b is 1 exactly when the inputs differ.",
      "assign y = a ^ b; drives y continuously for every input change."
    ],
    "formula": "00 → 0; 01 → 1; 10 → 1; 11 → 0",
    "inputs": [
      "Inputs: wire a, wire b (1 bit each)",
      "Output: wire y (1 bit)",
      "Interface: One statement: assign y = expression;"
    ],
    "sources": []
  },
  {
    "slug": "write-a-two-to-one-mux",
    "title": "Write a 2:1 multiplexer",
    "version": 1,
    "signature": "c364f86a",
    "method": "hdlLogic",
    "difficulty": "Easy",
    "trace": [
      "In s ? b : a, a true select chooses b and a false select chooses a.",
      "assign y = s ? b : a; implements the required combinational multiplexer."
    ],
    "formula": "s = 0 → y = a; s = 1 → y = b",
    "inputs": [
      "Data inputs: wire a, wire b (1 bit each)",
      "Select: wire s (1 bit)",
      "Output: wire y (1 bit)",
      "Interface: One statement: assign y = expression;"
    ],
    "sources": []
  },
  {
    "slug": "nonblocking-pipeline-step",
    "title": "One edge through a pipeline",
    "version": 1,
    "signature": "7b2221c4",
    "method": "hdlEvents",
    "difficulty": "Medium",
    "trace": [
      "At the edge, q1 schedules an update to the current d value, 1.",
      "q2 independently schedules an update to the pre-edge q1 value, 0.",
      "After both updates, (q1, q2) = (1, 0)."
    ],
    "formula": "",
    "inputs": [
      "Before edge: q1 = 0, q2 = 1, d = 1",
      "Clocked statements: q1 <= d; q2 <= q1;"
    ],
    "sources": []
  },
  {
    "slug": "repair-combinational-sensitivity",
    "title": "The missing sensitivity input",
    "version": 1,
    "signature": "bae7c570",
    "method": "hdlEvents",
    "difficulty": "Medium",
    "trace": [
      "The original simulation does not reevaluate when only b changes, so y remains stale at 0.",
      "always @* automatically includes both source inputs for this expression.",
      "With the corrected block, changing b to 1 while a = 1 reevaluates the AND and updates y to 1."
    ],
    "formula": "",
    "inputs": [
      "Current block: always @(a) y = a & b;",
      "Only transition: b: 0 → 1; a remains 1",
      "Intended function: Combinational AND"
    ],
    "sources": []
  },
  {
    "slug": "expansion-three-way-current-divider",
    "title": "Three branches share a source",
    "version": 1,
    "signature": "20d145bd",
    "method": "node",
    "difficulty": "Easy",
    "trace": [
      "The total conductance is 1/2 + 1/3 + 1/6 = 1 mS.",
      "KCL gives VA = 9 mA / 1 mS = 9 V.",
      "The requested downward current is 9 V / 3 kΩ = 3 mA. The other branches carry 4.5 and 1.5 mA, totaling 9 mA."
    ],
    "formula": "I₃ = Is (1/R₃) / (1/R₁ + 1/R₃ + 1/R₆)",
    "inputs": [
      "Injected current: 9 mA",
      "Parallel resistors: 2 kΩ, 3 kΩ, 6 kΩ"
    ],
    "sources": [
      {
        "title": "MIT 6.01SC: Circuits",
        "url": "https://ocw.mit.edu/courses/6-01sc-introduction-to-electrical-engineering-and-computer-science-i-spring-2011/pages/unit-3-circuits/circuits/",
        "supports": "KCL, KVL, nodal and mesh analysis."
      }
    ]
  },
  {
    "slug": "expansion-two-mesh-shared-resistor",
    "title": "The shared mesh resistor",
    "version": 1,
    "signature": "0a712fc1",
    "method": "mesh",
    "difficulty": "Medium",
    "trace": [
      "For the left mesh, KVL gives 2iL + 2(iL − iR) = 10.",
      "For the right mesh, traversal goes downward through the 4 V source, so 4iR + 2(iR − iL) = −4.",
      "Solving the simultaneous equations gives iL = 2.6 mA and iR = 0.2 mA.",
      "The middle current is iL − iR = 2.4 mA downward. As a check, VA = 4.8 V and (10 − 4.8)/2 = 2.6 mA enters from the left."
    ],
    "formula": "Ishared = iL − iR; (RL + RM)iL − RM iR = VL; −RM iL + (RR + RM)iR = −VR",
    "inputs": [
      "Left branch: 2 kΩ above a +10 V node",
      "Middle branch: 2 kΩ to ground",
      "Right branch: 4 kΩ above a +4 V node"
    ],
    "sources": [
      {
        "title": "MIT 6.01SC: Circuits",
        "url": "https://ocw.mit.edu/courses/6-01sc-introduction-to-electrical-engineering-and-computer-science-i-spring-2011/pages/unit-3-circuits/circuits/",
        "supports": "KCL, KVL, nodal and mesh analysis."
      }
    ]
  },
  {
    "slug": "expansion-thevenin-port-resistance",
    "title": "Look back into the port",
    "version": 1,
    "signature": "a22fcecf",
    "method": "port",
    "difficulty": "Medium",
    "trace": [
      "Shorting the ideal 18 V source makes its former positive terminal ground.",
      "The resistance from A to ground becomes 3 kΩ || 6 kΩ = (3 × 6)/(3 + 6) = 2 kΩ.",
      "Current entering P must pass through the separate 2 kΩ resistor before reaching that parallel combination.",
      "Thus Rth = 2 + 2 = 4 kΩ. The port resistor cannot be omitted merely because its open-circuit current was zero."
    ],
    "formula": "Rth = Rport + (Rtop || Rbottom)",
    "inputs": [
      "Supply to A: 18 V through 3 kΩ",
      "A to ground: 6 kΩ",
      "A to P: 2 kΩ"
    ],
    "sources": [
      {
        "title": "MIT 6.002: Superposition, Thévenin and Norton",
        "url": "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/resources/lecture-3/",
        "supports": "Linear terminal equivalents, source deactivation, and Norton short-circuit current. Maximum load power follows by differentiating Vth² RL/(Rth + RL)²."
      }
    ]
  },
  {
    "slug": "expansion-norton-short-circuit-current",
    "title": "Short the Norton port",
    "version": 1,
    "signature": "c6bfa9a9",
    "method": "port",
    "difficulty": "Easy",
    "trace": [
      "The short sets VP = 0 V.",
      "The 6 kΩ branch carries 0/6 = 0 mA, while the 3 kΩ branch supplies 9/3 = 3 mA.",
      "KCL therefore gives 3 mA through the short from P to ground. This is the Norton short-circuit current in the stated direction."
    ],
    "formula": "IN = Isc = Vs / Rseries",
    "inputs": [
      "Source: 9 V",
      "Source to P: 3 kΩ",
      "P to ground: 6 kΩ",
      "Port condition: P shorted to ground"
    ],
    "sources": [
      {
        "title": "MIT 6.002: Superposition, Thévenin and Norton",
        "url": "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/resources/lecture-3/",
        "supports": "Linear terminal equivalents, source deactivation, and Norton short-circuit current. Maximum load power follows by differentiating Vth² RL/(Rth + RL)²."
      }
    ]
  },
  {
    "slug": "expansion-maximum-load-power",
    "title": "Match the load for power",
    "version": 1,
    "signature": "119d8fb1",
    "method": "power",
    "difficulty": "Medium",
    "trace": [
      "With RL disconnected, the divider gives Vth = 12 V.",
      "With the 20 V source shorted, Rth = (4 × 6)/(4 + 6) = 2.4 kΩ.",
      "The maximizing load is RL = 2.4 kΩ, producing load voltage Vth/2 = 6 V.",
      "The load power is 6²/2.4 = 15 mW, equivalently Vth²/(4Rth). This is only the variable load power, not the total resistor dissipation."
    ],
    "formula": "RL,opt = Rth; PL,max = Vth² / (4Rth)",
    "inputs": [
      "Supply: 20 V",
      "Source to A: 4 kΩ",
      "Fixed A to ground: 6 kΩ",
      "Variable load: RL from A to ground"
    ],
    "sources": [
      {
        "title": "MIT 6.002: Superposition, Thévenin and Norton",
        "url": "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/resources/lecture-3/",
        "supports": "Linear terminal equivalents, source deactivation, and Norton short-circuit current. Maximum load power follows by differentiating Vth² RL/(Rth + RL)²."
      }
    ]
  },
  {
    "slug": "expansion-dependent-source-node",
    "title": "A node with controlled injection",
    "version": 1,
    "signature": "93fc5ddb",
    "method": "node",
    "difficulty": "Hard",
    "trace": [
      "The controlled source injects current into A, so its contribution to a sum of leaving currents is −0.10VA mA.",
      "KCL gives (1/4 + 1/6 − 1/10)VA = 3, or (19/60)VA = 3.",
      "Thus VA = 180/19 ≈ 9.473684 V.",
      "As a check, the 4 kΩ branch injects 0.631579 mA and the dependent source injects 0.947368 mA. Their sum equals the 6 kΩ current, 1.578947 mA."
    ],
    "formula": "VA = (Vs/R₁) / (1/R₁ + 1/R₂ − gm)",
    "inputs": [
      "Supply to A: 12 V through 4 kΩ",
      "A to ground: 6 kΩ",
      "Controlled injection: (0.10 mS)VA from ground into A"
    ],
    "sources": [
      {
        "title": "MIT 6.01SC: Circuits",
        "url": "https://ocw.mit.edu/courses/6-01sc-introduction-to-electrical-engineering-and-computer-science-i-spring-2011/pages/unit-3-circuits/circuits/",
        "supports": "KCL, KVL, nodal and mesh analysis."
      }
    ]
  },
  {
    "slug": "expansion-rc-polarity-reversal",
    "title": "Reverse the charging target",
    "version": 1,
    "signature": "e1ed92f5",
    "method": "firstOrder",
    "difficulty": "Medium",
    "trace": [
      "The initial capacitor voltage remains +6 V at t = 0⁺ because the resistor limits current.",
      "The final voltage is −3 V, and τ = 2 kΩ × 10 μF = 20 ms.",
      "At t = τ, vC = −3 + 9e⁻¹ ≈ +0.310915 V. The voltage has not yet crossed zero."
    ],
    "formula": "vC(t) = Vf + (V₀ − Vf)e^(−t/RC)",
    "inputs": [
      "C: 10 μF",
      "R: 2 kΩ",
      "Initial voltage: +6 V",
      "Final source voltage: −3 V",
      "Time: 20 ms"
    ],
    "sources": [
      {
        "title": "MIT 6.200: RC Circuits Primer",
        "url": "https://circuits.mit.edu/F25/psets/04/rc_tutorial",
        "supports": "Capacitor voltage/current law, first-order response, and retaining initial conditions across finite-resistance switching."
      }
    ]
  },
  {
    "slug": "expansion-rc-charging-threshold",
    "title": "When does the threshold trip?",
    "version": 1,
    "signature": "e7d28ab0",
    "method": "firstOrder",
    "difficulty": "Medium",
    "trace": [
      "The time constant is τ = 10 kΩ × 4.7 μF = 47 ms.",
      "The voltage is vC(t) = 5 − 4e^(−t/47 ms).",
      "At the threshold, the remaining gap is 1 V rather than its initial 4 V, so e^(−t/47 ms) = 1/4.",
      "Thus t = 47 ln(4) ≈ 65.155835 ms. The comparator adds no delay in the stated ideal model."
    ],
    "formula": "ttrip = RC ln[(Vf − V₀)/(Vf − Vthreshold)]",
    "inputs": [
      "Initial voltage: 1 V",
      "Final voltage: 5 V",
      "Comparator threshold: 4 V",
      "R: 10 kΩ",
      "C: 4.7 μF"
    ],
    "sources": [
      {
        "title": "MIT 6.200: RC Circuits Primer",
        "url": "https://circuits.mit.edu/F25/psets/04/rc_tutorial",
        "supports": "Capacitor voltage/current law, first-order response, and retaining initial conditions across finite-resistance switching."
      }
    ]
  },
  {
    "slug": "expansion-rc-initial-reverse-current",
    "title": "The first instant of current",
    "version": 1,
    "signature": "fe06c769",
    "method": "firstOrder",
    "difficulty": "Easy",
    "trace": [
      "Finite resistor current means capacitor voltage cannot jump: vC(0⁺) = 8 V.",
      "The resistor voltage in the defined current direction is 3 − 8 = −5 V.",
      "Hence iR(0⁺) = −5/2.5 = −2 mA. The negative sign means current initially flows from the capacitor toward the source."
    ],
    "formula": "iR(0⁺) = [Vs − vC(0⁻)]/R",
    "inputs": [
      "vC(0⁻): +8 V",
      "Source: +3 V",
      "R: 2.5 kΩ",
      "C: 20 μF",
      "Positive iR: Source toward capacitor"
    ],
    "sources": [
      {
        "title": "MIT 6.200: RC Circuits Primer",
        "url": "https://circuits.mit.edu/F25/psets/04/rc_tutorial",
        "supports": "Capacitor voltage/current law, first-order response, and retaining initial conditions across finite-resistance switching."
      }
    ]
  },
  {
    "slug": "expansion-rc-energy-released",
    "title": "Energy released before a threshold",
    "version": 1,
    "signature": "7c4acbf3",
    "method": "integration",
    "difficulty": "Easy",
    "trace": [
      "Initially, EC = (1/2)(50 × 10⁻⁶)(6²) = 0.0009 J = 0.9 mJ.",
      "At 2 V, EC = (1/2)(50 × 10⁻⁶)(2²) = 0.0001 J = 0.1 mJ.",
      "The resistor dissipates the difference, 0.8 mJ. Its resistance sets how long this takes, but not the energy difference for the specified endpoint voltages."
    ],
    "formula": "ER = (1/2)C(Vinitial² − Vfinal²)",
    "inputs": [
      "C: 50 μF",
      "Initial voltage: 6 V",
      "Final interval voltage: 2 V",
      "Discharge resistor: 10 kΩ"
    ],
    "sources": [
      {
        "title": "MIT 6.622: Power Electronics, Lecture 32 transcript",
        "url": "https://ocw.mit.edu/courses/6-622-power-electronics-spring-2023/1JimzDcKHjTLgNN3Whan36afmCih5US9A_transcript.pdf",
        "supports": "Stored capacitor energy (1/2)CV² and resistor energy loss by conservation."
      }
    ]
  },
  {
    "slug": "expansion-rc-lowpass-cutoff",
    "title": "Set a passive filter corner",
    "version": 1,
    "signature": "185a0bc1",
    "method": "filter",
    "difficulty": "Medium",
    "trace": [
      "The transfer function is H(jω) = 1/(1 + jωRC), with DC magnitude 1.",
      "A magnitude of 1/√2 requires ωRC = 1, so fc = 1/(2πRC).",
      "Here RC = 3300 × 22 × 10⁻⁹ = 72.6 μs.",
      "Thus fc ≈ 2192.217 Hz, or about 2.19 kHz."
    ],
    "formula": "fc = 1/(2πRC)",
    "inputs": [
      "Series R: 3.3 kΩ",
      "Shunt C: 22 nF",
      "Output: Across capacitor",
      "Loading: None"
    ],
    "sources": [
      {
        "title": "Analog Devices: An Introduction to Electrical Filters",
        "url": "https://wiki.analog.com/university/courses/engineering_discovery/lab_5",
        "supports": "Unloaded RC low-pass transfer, cutoff 1/(2πRC), and 1/√2 voltage ratio."
      }
    ]
  },
  {
    "slug": "expansion-rc-charge-then-discharge",
    "title": "Two switch positions, one capacitor",
    "version": 1,
    "signature": "f7661d8f",
    "method": "firstOrder",
    "difficulty": "Hard",
    "trace": [
      "During charging, τ₁ = 1 kΩ × 10 μF = 10 ms. Thus vC(10 ms⁻) = 5(1 − e⁻¹) ≈ 3.160603 V.",
      "Capacitor voltage is continuous at the second switching event, so vC(10 ms⁺) has that same value.",
      "The discharge time constant is τ₂ = 2 kΩ × 10 μF = 20 ms. Only 20 ms of discharge has elapsed at t = 30 ms.",
      "Therefore vC(30 ms) = 5(1 − e⁻¹)e⁻¹ ≈ 1.162721 V."
    ],
    "formula": "vC(t ≥ ts) = Vs[1 − e^(−ts/(Rcharge C))]e^(−(t − ts)/(Rdischarge C))",
    "inputs": [
      "C / vC(0⁻): 10 μF / 0 V",
      "First interval: 5 V through 1 kΩ for 10 ms",
      "Second interval: Discharge through 2 kΩ",
      "Observation time: 30 ms after the first switch"
    ],
    "sources": [
      {
        "title": "MIT 6.200: RC Circuits Primer",
        "url": "https://circuits.mit.edu/F25/psets/04/rc_tutorial",
        "supports": "Capacitor voltage/current law, first-order response, and retaining initial conditions across finite-resistance switching."
      }
    ]
  },
  {
    "slug": "expansion-bjt-loaded-common-emitter",
    "title": "A common-emitter stage under load",
    "version": 1,
    "signature": "88fac846",
    "method": "bjtSignal",
    "difficulty": "Medium",
    "trace": [
      "At the bias point, VC = 10 − (1 mA)(4 kΩ) = 6 V > VB = 0.70 V, consistent with forward-active operation.",
      "gm = 1 mA/25 mV = 40 mS and rπ = 100/0.040 = 2.5 kΩ.",
      "The input divider gives vbe/vs = 2.5/(2.5 + 2.5) = 0.5. The effective collector load is 4 kΩ || 4 kΩ = 2 kΩ.",
      "The total gain is −0.040 × 2000 × 0.5 = −40 V/V; the minus sign indicates inversion."
    ],
    "formula": "Av = −gm(RC || RL) rπ/(Rs + rπ)",
    "inputs": [
      "IC / β / VT: 1 mA / 100 / 25 mV",
      "RC / RL: 4 kΩ / 4 kΩ",
      "Source resistance: 2.5 kΩ",
      "VCC / VBE: 10 V / 0.70 V"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Recitation 18: BJT Regions of Operation and Small Signal Model",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/0df1f43ca9d2ef82dafbf858d8414d3f_MIT6_012S09_rec18.pdf",
        "supports": "Hybrid-pi input resistance; transconductance; exact Early-effect conductance; forward-active junction conditions."
      },
      {
        "title": "MIT 6.012 Recitation 19: Common Emitter Amplifier",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/4de233716b7beba25af7622930741a54_MIT6_012S09_rec19.pdf",
        "supports": "Common-emitter gain, source and load effects, and small-signal resistance analysis."
      }
    ]
  },
  {
    "slug": "expansion-bjt-input-resistance-bias-network",
    "title": "What resistance does the source see?",
    "version": 1,
    "signature": "9f0eced9",
    "method": "bjtSignal",
    "difficulty": "Easy",
    "trace": [
      "gm = 0.0015/0.025 = 0.060 S.",
      "The transistor input resistance is rπ = 120/0.060 = 2000 Ω = 2 kΩ.",
      "The source sees Rin = 2 kΩ || 10 kΩ = 20/12 kΩ ≈ 1.66667 kΩ."
    ],
    "formula": "Rin = (βVT/IC) || Rbias",
    "inputs": [
      "IC: 1.5 mA",
      "β / VT: 120 / 25 mV",
      "Bias-network resistance: 10 kΩ",
      "Emitter: AC ground"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Recitation 18: BJT Regions of Operation and Small Signal Model",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/0df1f43ca9d2ef82dafbf858d8414d3f_MIT6_012S09_rec18.pdf",
        "supports": "Hybrid-pi input resistance; transconductance; exact Early-effect conductance; forward-active junction conditions."
      }
    ]
  },
  {
    "slug": "expansion-bjt-exact-early-resistance",
    "title": "The exact Early-effect slope",
    "version": 1,
    "signature": "3cfed957",
    "method": "bjtSignal",
    "difficulty": "Medium",
    "trace": [
      "At fixed VBE, write IC = I0(1 + VCE/VA). The measured 1 mA includes the Early-effect factor.",
      "Differentiating gives go = I0/VA = IC/(VA + VCE).",
      "Therefore ro = (50 + 2) V/(1 mA) = 52 kΩ. The approximate VA/IC result would be 50 kΩ."
    ],
    "formula": "ro = (∂IC/∂VCE)⁻¹ at fixed VBE = (VA + VCE)/IC",
    "inputs": [
      "IC at the bias point: 1 mA",
      "VCE / VA: 2 V / 50 V",
      "Model: IC = IS exp(VBE/VT)(1 + VCE/VA)",
      "Derivative constraint: Hold VBE fixed"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Recitation 18: BJT Regions of Operation and Small Signal Model",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/0df1f43ca9d2ef82dafbf858d8414d3f_MIT6_012S09_rec18.pdf",
        "supports": "Hybrid-pi input resistance; transconductance; exact Early-effect conductance; forward-active junction conditions."
      }
    ]
  },
  {
    "slug": "expansion-bjt-forced-beta-resistor",
    "title": "Size a switch base resistor",
    "version": 1,
    "signature": "f7b8378f",
    "method": "bjtSwitch",
    "difficulty": "Easy",
    "trace": [
      "The load current is IC = 11.8 V/590 Ω = 20 mA.",
      "The required base current is at least 20 mA/10 = 2 mA.",
      "At the limiting design point RB = (3.3 − 0.80) V/(2 mA) = 1.25 kΩ.",
      "Larger RB would reduce base drive below the stated requirement; the forced ratio is a design constraint, not the transistor’s forward-active β."
    ],
    "formula": "RB,max = (Vdrive − VBE(sat)) βforced / IC",
    "inputs": [
      "Supply / load: 12 V / 590 Ω",
      "Logic high: 3.3 V",
      "VCE(sat) / VBE(sat): 0.20 V / 0.80 V",
      "Maximum forced IC/IB: 10"
    ],
    "sources": [
      {
        "title": "onsemi TND6093/D: Low VCE(sat) BJT design guidance",
        "url": "https://www.onsemi.com/download/white-papers/pdf/tnd6093-d.pdf",
        "supports": "Base drive must provide sufficient current for a saturated BJT switch; base resistor sizing is constrained by drive capability."
      }
    ]
  },
  {
    "slug": "expansion-bjt-follower-source-loading",
    "title": "An emitter follower with a real source",
    "version": 1,
    "signature": "9fa7f0b3",
    "method": "bjtSignal",
    "difficulty": "Hard",
    "trace": [
      "The DC emitter current is (100/99)(1 mA) ≈ 1.0101 mA, so VE ≈ 1.0101 V and VB ≈ 1.7101 V. The 5 V collector is above the base, confirming forward-active bias.",
      "gm = 40 mS and rπ = 99/0.040 = 2475 Ω. The AC emitter load is 500 Ω.",
      "An input base current ib produces vout = (99 + 1)ib(500 Ω) = 50000ib.",
      "The required source signal is vs = ib(2500 + 2475 + 50000) Ω. Thus vout/vs = 50000/54975 ≈ 0.909504 V/V."
    ],
    "formula": "Av = (β + 1)(RE || RL) / [Rs + rπ + (β + 1)(RE || RL)]",
    "inputs": [
      "IC / β / VT: 1 mA / 99 / 25 mV",
      "RE / AC load: 1 kΩ / 1 kΩ",
      "Source resistance: 2.5 kΩ",
      "Collector supply: 5 V"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Recitation 18: BJT Regions of Operation and Small Signal Model",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/0df1f43ca9d2ef82dafbf858d8414d3f_MIT6_012S09_rec18.pdf",
        "supports": "Hybrid-pi input resistance; transconductance; exact Early-effect conductance; forward-active junction conditions."
      }
    ]
  },
  {
    "slug": "expansion-bjt-unbypassed-emitter-gain",
    "title": "Gain with emitter degeneration",
    "version": 1,
    "signature": "ab21d0a3",
    "method": "bjtSignal",
    "difficulty": "Hard",
    "trace": [
      "DC checks give IE = 1.01 mA, VE = 0.2525 V, VB = 0.9525 V, and VC = 5 V, so the bias is forward active.",
      "gm = 40 mS and rπ = 2.5 kΩ. The collector’s AC load is 2.5 kΩ.",
      "The input is vin = ib[2500 + 101(250)] = 27750ib, while vout = −100ib(2500) = −250000ib.",
      "Therefore Av = −250000/27750 ≈ −9.00901 V/V. The unbypassed emitter resistor reduces gain through negative feedback."
    ],
    "formula": "Av = −β(RC || RL) / [rπ + (β + 1)RE]",
    "inputs": [
      "IC / β / VT: 1 mA / 100 / 25 mV",
      "RC / RL: 5 kΩ / 5 kΩ",
      "Unbypassed RE: 250 Ω",
      "VCC: 10 V"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Recitation 18: BJT Regions of Operation and Small Signal Model",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/0df1f43ca9d2ef82dafbf858d8414d3f_MIT6_012S09_rec18.pdf",
        "supports": "Hybrid-pi input resistance; transconductance; exact Early-effect conductance; forward-active junction conditions."
      },
      {
        "title": "MIT 6.012 Recitation 19: Common Emitter Amplifier",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/4de233716b7beba25af7622930741a54_MIT6_012S09_rec19.pdf",
        "supports": "Common-emitter gain, source and load effects, and small-signal resistance analysis."
      }
    ]
  },
  {
    "slug": "expansion-mos-transconductance-overdrive",
    "title": "Transconductance from overdrive",
    "version": 1,
    "signature": "568c2f97",
    "method": "mosSignal",
    "difficulty": "Easy",
    "trace": [
      "The overdrive is 1.1 − 0.6 = 0.5 V. Since VDS = 2 V exceeds 0.5 V, saturation is consistent.",
      "The model gives gm = kVOV = 2ID/VOV.",
      "Thus gm = 2(2 mA)/(0.5 V) = 8 mS."
    ],
    "formula": "gm = 2ID/(VGS − VTH)",
    "inputs": [
      "ID: 2 mA",
      "VGS / VTH: 1.1 V / 0.6 V",
      "VDS: 2 V",
      "Model: ID = (k/2)(VGS − VTH)²"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Recitation 9: MOSFET VI Characteristics",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/908ce7edc329bf6d8a628d8a2b1cb3c9_MIT6_012S09_rec09.pdf",
        "supports": "MOSFET region conditions and current models, including PMOS sign conventions."
      }
    ]
  },
  {
    "slug": "expansion-mos-channel-modulation-resistance",
    "title": "Output resistance beyond the approximation",
    "version": 1,
    "signature": "6069cf25",
    "method": "mosSignal",
    "difficulty": "Medium",
    "trace": [
      "VOV = 1.0 V and VDS = 5 V, so the saturation condition holds.",
      "The unmodulated current is I0 = (2/2)(1)² = 1 mA; the actual bias current is 1(1 + 0.04×5) = 1.2 mA.",
      "The output conductance is go = λI0 = 0.04(1 mA) = 0.04 mS.",
      "Therefore ro = 1/go = 25 kΩ. Equivalently ro = (1 + λVDS)/(λID) for this exact model."
    ],
    "formula": "ro = 1/(λI0) = (1 + λVDS)/(λID)",
    "inputs": [
      "VGS / VTH: 1.6 V / 0.6 V",
      "VDS: 5 V",
      "k: 2 mA/V²",
      "λ: 0.04 V⁻¹"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Recitation 9: MOSFET VI Characteristics",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/908ce7edc329bf6d8a628d8a2b1cb3c9_MIT6_012S09_rec09.pdf",
        "supports": "MOSFET region conditions and current models, including PMOS sign conventions."
      }
    ]
  },
  {
    "slug": "expansion-mos-loaded-common-source-gain",
    "title": "Three resistances at the drain",
    "version": 1,
    "signature": "76ab4859",
    "method": "mosSignal",
    "difficulty": "Medium",
    "trace": [
      "The DC drain voltage is 12 − (0.8 mA)(10 kΩ) = 4 V. This exceeds the 0.4 V overdrive, consistent with saturation.",
      "The effective signal load is 10 kΩ || 10 kΩ || 100 kΩ = 4.76190 kΩ.",
      "Since the source is grounded, vgs = vin and Av = −gmReff = −0.004(4761.90) ≈ −19.0476 V/V."
    ],
    "formula": "Av = −gm(RD || RL || ro)",
    "inputs": [
      "gm / ro: 4 mS / 100 kΩ",
      "RD / RL: 10 kΩ / 10 kΩ",
      "VDD / ID: 12 V / 0.8 mA",
      "VGS / VTH: 1.0 V / 0.6 V"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Lecture 18: Single Transistor Amplifier Stages",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/18a2d9a52234f9e962d74b5599759767_MIT6_012F09_lec18.pdf",
        "supports": "Common-source loading and source-follower gain including body effect, transistor output conductance and current-source output conductance."
      }
    ]
  },
  {
    "slug": "expansion-mos-follower-body-effect",
    "title": "A follower loses gain through its body",
    "version": 1,
    "signature": "b3e25c36",
    "method": "mosBody",
    "difficulty": "Hard",
    "trace": [
      "The DC overdrive is 3.2 − 2 − 0.6 = 0.6 V. VDS = 3 V exceeds this, so saturation is consistent.",
      "KCL gives gm(vin − vout) − gmb vout − vout/ro = vout(1/RL + 1/rbias).",
      "Collecting terms, Av = gm/[gm + gmb + 1/ro + 1/rbias + 1/RL].",
      "The denominator is 5 + 1 + 0.01 + 0.01 + 0.5 = 6.52 mS, giving Av = 5/6.52 ≈ 0.766871 V/V."
    ],
    "formula": "Av = gm / (gm + gmb + 1/ro + 1/rbias + 1/RL)",
    "inputs": [
      "gm / gmb: 5 mS / 1 mS",
      "ro / rbias: 100 kΩ / 100 kΩ",
      "AC load: 2 kΩ",
      "VG / VS / VD: 3.2 V / 2 V / 5 V",
      "Effective VTH: 0.6 V"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Lecture 18: Single Transistor Amplifier Stages",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/18a2d9a52234f9e962d74b5599759767_MIT6_012F09_lec18.pdf",
        "supports": "Common-source loading and source-follower gain including body effect, transistor output conductance and current-source output conductance."
      }
    ]
  },
  {
    "slug": "expansion-pmos-moving-drain-regions",
    "title": "A PMOS drain moves toward its source",
    "version": 1,
    "signature": "e5623eb0",
    "method": "mosBias",
    "difficulty": "Medium",
    "trace": [
      "VSG = 5 − 2.5 = 2.5 V exceeds |VTP| = 0.7 V, so the device is on at both drain voltages.",
      "At VD = 2.0 V, VSD = 3.0 V ≥ 1.8 V, giving saturation.",
      "At VD = 4.0 V, VSD = 1.0 V < 1.8 V, giving triode. Raising the PMOS drain toward its source reduces available channel voltage."
    ],
    "formula": "PMOS saturation: VSG > |VTP| and VSD ≥ VSG − |VTP|",
    "inputs": [
      "VS / VG: 5 V / 2.5 V",
      "VTP: −0.7 V",
      "Drain voltages: 2.0 V, then 4.0 V",
      "Body connection: Tied to source"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Recitation 9: MOSFET VI Characteristics",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/908ce7edc329bf6d8a628d8a2b1cb3c9_MIT6_012S09_rec09.pdf",
        "supports": "MOSFET region conditions and current models, including PMOS sign conventions."
      }
    ]
  },
  {
    "slug": "expansion-mos-miller-plateau-time",
    "title": "Time spent on the Miller plateau",
    "version": 1,
    "signature": "aa8ba9ff",
    "method": "gateDrive",
    "difficulty": "Medium",
    "trace": [
      "The resistance driving the gate is 2 + 8 = 10 Ω.",
      "During the plateau, the driving voltage across that resistance is 10 − 4 = 6 V, giving IG = 0.6 A.",
      "The interval lasts t = 12 nC/0.6 A = 20 ns. This estimates only the specified drain-voltage transition, not the entire turn-on event."
    ],
    "formula": "tplateau = QGD(Rdriver + Rgate)/(Vdrive − Vplateau)",
    "inputs": [
      "Driver voltage: 10 V",
      "Miller plateau: 4 V",
      "Driver / external resistance: 2 Ω / 8 Ω",
      "Plateau gate charge QGD: 12 nC"
    ],
    "sources": [
      {
        "title": "Texas Instruments SLUA618A: Fundamentals of MOSFET and IGBT Gate Driver Circuits",
        "url": "https://www.ti.com/lit/ml/slua618a/slua618a.pdf",
        "supports": "Miller interval, gate-charge timing, and plateau gate current set by voltage difference and gate-path series resistances."
      }
    ]
  },
  {
    "slug": "expansion-counter-width",
    "title": "Size a modulo-1000 counter",
    "version": 1,
    "signature": "bb436af6",
    "method": "storageWidth",
    "difficulty": "Easy",
    "trace": [
      "There are 1000 distinct states, from 0 to 999.",
      "Nine bits represent only 512 states, so nine flip-flops are insufficient.",
      "Ten bits represent 1024 states, which includes all required values. The reset logic handles the unused values separately."
    ],
    "formula": "n = ceil(log₂ N)",
    "inputs": [
      "First state: 0",
      "Last state: 999",
      "Encoding: Unsigned binary"
    ],
    "sources": [
      {
        "title": "MIT 6.004: Sequential Logic Worksheet",
        "url": "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/778bc70f7cb2efe51582d90a1228472c_sequential_answers.pdf",
        "supports": "Register timing and state storage; original timing and counter examples."
      }
    ]
  },
  {
    "slug": "expansion-hold-buffer-skew",
    "title": "Repair a hold violation",
    "version": 1,
    "signature": "84199bf8",
    "method": "timing",
    "difficulty": "Hard",
    "trace": [
      "The capture edge is at 0.05 ns relative to launch. Its hold window ends at 0.05 + 0.12 = 0.17 ns.",
      "Without a delay element, new data can arrive at 0.08 + 0.04 = 0.12 ns.",
      "The path is short by 0.17 − 0.12 = 0.05 ns, which is the minimum added delay.",
      "This only checks the hold constraint; a real repair must also be checked against setup timing."
    ],
    "formula": "tCQ,min + tlogic,min + tadded ≥ tskew + thold",
    "inputs": [
      "tCQ,min: 0.08 ns",
      "tlogic,min: 0.04 ns",
      "Capture clock lateness: +0.05 ns",
      "Hold time: 0.12 ns"
    ],
    "sources": [
      {
        "title": "MIT 6.004: Sequential Logic Worksheet",
        "url": "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/778bc70f7cb2efe51582d90a1228472c_sequential_answers.pdf",
        "supports": "Register timing and state storage; original timing and counter examples."
      }
    ]
  },
  {
    "slug": "expansion-pipeline-throughput",
    "title": "Find the pipeline bottleneck",
    "version": 1,
    "signature": "73ab4afc",
    "method": "throughput",
    "difficulty": "Medium",
    "trace": [
      "The largest combinational delay is 2.4 ns.",
      "The minimum valid clock period is 2.4 + 0.6 = 3.0 ns.",
      "With one new sample accepted each cycle, throughput is 1/(3 ns) = 333.333 million samples/s.",
      "The four stages affect latency, but they do not divide steady-state throughput by four."
    ],
    "formula": "Throughput = 1 / (max(stage delay) + register overhead)",
    "inputs": [
      "Stage logic delays: 2.4, 1.6, 2.0, 1.2 ns",
      "Register overhead: 0.6 ns per stage",
      "Initiation interval: 1 cycle"
    ],
    "sources": [
      {
        "title": "MIT 6.004: Sequential Logic Worksheet",
        "url": "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/778bc70f7cb2efe51582d90a1228472c_sequential_answers.pdf",
        "supports": "Register timing and state storage; original timing and counter examples."
      }
    ]
  },
  {
    "slug": "expansion-binary-gray-conversion",
    "title": "Convert a binary position to Gray code",
    "version": 1,
    "signature": "7db8ab3a",
    "method": "arithmetic",
    "difficulty": "Easy",
    "trace": [
      "The input bits, from most to least significant, are 1, 0, 1, 1, 0.",
      "The leading Gray bit is 1. The remaining bits are 1 XOR 0 = 1, 0 XOR 1 = 1, 1 XOR 1 = 0, and 1 XOR 0 = 1.",
      "The resulting word is 11101. Equivalently, 10110 XOR 01011 = 11101."
    ],
    "formula": "Gray = binary XOR (binary >> 1)",
    "inputs": [
      "Binary input: 10110",
      "Bit order: Most significant bit on the left"
    ],
    "sources": [
      {
        "title": "MIT 6.004: Combinational Logic",
        "url": "https://www.ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c2/c2s1/",
        "supports": "Boolean functional specification and exhaustive input combinations; original arithmetic, mux, parity, and encoder exercises."
      }
    ]
  },
  {
    "slug": "expansion-mux-shannon-decomposition",
    "title": "Build a function with one multiplexer",
    "version": 1,
    "signature": "d8d4310d",
    "method": "boolean",
    "difficulty": "Medium",
    "trace": [
      "With b = 0, the term ab vanishes, so D0 = (NOT a) AND c.",
      "With b = 1, F = a OR ((NOT a) AND c).",
      "Using absorption/distributivity, a OR ((NOT a) AND c) = a OR c, so D1 = a OR c.",
      "The selected data expression now agrees with F for both values of b."
    ],
    "formula": "F = (NOT b)·F|b=0 + b·F|b=1",
    "inputs": [
      "Target: F = ab + a̅c",
      "Select: s = b",
      "MUX convention: b = 0 selects D0"
    ],
    "sources": [
      {
        "title": "MIT 6.004: Combinational Logic",
        "url": "https://www.ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c2/c2s1/",
        "supports": "Boolean functional specification and exhaustive input combinations; original arithmetic, mux, parity, and encoder exercises."
      }
    ]
  },
  {
    "slug": "expansion-unsigned-adder-carry",
    "title": "Separate carry from the stored sum",
    "version": 1,
    "signature": "125f3930",
    "method": "arithmetic",
    "difficulty": "Medium",
    "trace": [
      "The full result is 300.",
      "Since 300 = 256 + 44, the low eight bits represent 44.",
      "The ninth bit is 1, so carry-out is 1. Carry-out is distinct from a signed-overflow flag."
    ],
    "formula": "Sum = (A + B) mod 256",
    "inputs": [
      "Operand A: 200",
      "Operand B: 100",
      "Sum width: 8 bits"
    ],
    "sources": [
      {
        "title": "MIT 6.004: Combinational Logic",
        "url": "https://www.ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c2/c2s1/",
        "supports": "Boolean functional specification and exhaustive input combinations; original arithmetic, mux, parity, and encoder exercises."
      }
    ]
  },
  {
    "slug": "expansion-hdl-full-adder-carry",
    "title": "Write the full-adder carry",
    "version": 1,
    "signature": "b8bf7c90",
    "method": "hdlLogic",
    "difficulty": "Medium",
    "trace": [
      "The possible integer sums are 0, 1, 2, and 3.",
      "The carry-out is 1 for sums 2 or 3, and 0 otherwise.",
      "The expression (a & b) | (a & cin) | (b & cin) detects all cases with at least two high inputs."
    ],
    "formula": "Cout = ab + a·cin + b·cin",
    "inputs": [
      "Inputs: a, b, cin",
      "Output: y = carry-out",
      "Values: 0 or 1 only"
    ],
    "sources": [
      {
        "title": "MIT 6.004: Combinational Logic",
        "url": "https://www.ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c2/c2s1/",
        "supports": "Boolean functional specification and exhaustive input combinations; original arithmetic, mux, parity, and encoder exercises."
      }
    ]
  },
  {
    "slug": "expansion-hdl-two-bit-equality",
    "title": "Compare two two-bit words",
    "version": 1,
    "signature": "fbb1021e",
    "method": "hdlLogic",
    "difficulty": "Medium",
    "trace": [
      "Two two-bit words are equal only if their most significant bits match and their least significant bits match.",
      "The expressions (a1 == b1) and (a0 == b0) each produce 1 when that pair matches.",
      "ANDing those results produces y = 1 only when the complete words match."
    ],
    "formula": "y = XNOR(a1,b1) AND XNOR(a0,b0)",
    "inputs": [
      "Word A: a1 a0",
      "Word B: b1 b0",
      "Output: y = 1 exactly when A = B"
    ],
    "sources": [
      {
        "title": "MIT 6.004: Combinational Logic",
        "url": "https://www.ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c2/c2s1/",
        "supports": "Boolean functional specification and exhaustive input combinations; original arithmetic, mux, parity, and encoder exercises."
      }
    ]
  },
  {
    "slug": "expansion-hdl-even-parity-bit",
    "title": "Generate an even-parity bit",
    "version": 1,
    "signature": "445b3342",
    "method": "hdlLogic",
    "difficulty": "Easy",
    "trace": [
      "An even-weight payload needs y = 0, and an odd-weight payload needs y = 1.",
      "a XOR b XOR c is 1 exactly for an odd-weight payload.",
      "Therefore y = a ^ b ^ c makes the total number of ones even in all eight cases."
    ],
    "formula": "a XOR b XOR c XOR y = 0",
    "inputs": [
      "Payload: a, b, c",
      "Parity rule: Even number of ones including y"
    ],
    "sources": [
      {
        "title": "MIT 6.004: Combinational Logic",
        "url": "https://www.ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c2/c2s1/",
        "supports": "Boolean functional specification and exhaustive input combinations; original arithmetic, mux, parity, and encoder exercises."
      }
    ]
  },
  {
    "slug": "expansion-hdl-priority-encoder-lsb",
    "title": "Encode the highest-priority request",
    "version": 1,
    "signature": "72bca23a",
    "method": "hdlLogic",
    "difficulty": "Hard",
    "trace": [
      "When r3 is 1, the winning code is 11, so y must be 1 regardless of lower requests.",
      "When r3 is 0 and r2 is 1, the winning code is 10, so y must be 0.",
      "When both higher requests are 0, y equals r1; r0 and no request both produce a low code bit of 0.",
      "The simplified expression r3 | (~r2 & r1) implements these cases. r0 does not affect this particular output bit."
    ],
    "formula": "y = r3 OR ((NOT r2) AND r1)",
    "inputs": [
      "Priority: r3 highest, r0 lowest",
      "Codes: r3: 11; r2: 10; r1: 01; r0: 00",
      "No request: 00"
    ],
    "sources": [
      {
        "title": "MIT 6.004: Combinational Logic",
        "url": "https://www.ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c2/c2s1/",
        "supports": "Boolean functional specification and exhaustive input combinations; original arithmetic, mux, parity, and encoder exercises."
      }
    ]
  },
  {
    "slug": "expansion-hdl-inferred-latch",
    "title": "Spot the inferred storage",
    "version": 1,
    "signature": "fa794d17",
    "method": "hdlEvents",
    "difficulty": "Medium",
    "trace": [
      "When en is high, the process assigns d to q and q follows changes in d.",
      "When en is low, no assignment is executed, so q retains its previous value.",
      "Transparency while en is high and retention while en is low describe an active-high latch. Assigning q on every path is required for purely combinational behavior."
    ],
    "formula": "",
    "inputs": [
      "Process: always @*",
      "Assignment: if (en) q = d;",
      "Missing branch: No else assignment"
    ],
    "sources": [
      {
        "title": "Altera Quartus Prime: Avoid Unintentional Latch Generation",
        "url": "https://docs.altera.com/r/docs/683082/25.1/quartus-prime-pro-edition-user-guide/avoid-unintentional-latch-generation?contentId=g4myfPN17LOqGwC86ezgtw",
        "supports": "Missing assignments in combinational blocks infer retained state."
      }
    ]
  },
  {
    "slug": "expansion-hdl-signed-shift",
    "title": "Read an arithmetic right shift",
    "version": 1,
    "signature": "3427facc",
    "method": "hdlSigned",
    "difficulty": "Medium",
    "trace": [
      "The eight-bit representation of −16 is 11110000.",
      "An arithmetic right shift by two fills the high positions with ones, yielding 11111100.",
      "As an eight-bit two’s-complement value, 11111100 is −4. A logical right shift would fill with zeros instead."
    ],
    "formula": "",
    "inputs": [
      "x: signed 8-bit −16",
      "Expression: x >>> 2",
      "y: signed 8-bit result"
    ],
    "sources": [
      {
        "title": "Cornell ECE 4750: Tutorial 3, Verilog Hardware Description Language (section 3.3)",
        "url": "https://web.csl.cornell.edu/courses/ece4750/handouts/ece4750-tut3-verilog.pdf",
        "supports": "Arithmetic right shift replicates the sign bit when its left operand is signed. The original numeric example is checked independently."
      }
    ]
  },
  {
    "slug": "expansion-v2-superposition-current-contribution",
    "title": "Isolate one source's contribution",
    "version": 1,
    "signature": "8178452c",
    "method": "superposition",
    "difficulty": "Easy",
    "trace": [
      "With the voltage source set to zero, its positive terminal becomes ground and the resistors are in parallel.",
      "Their equivalent resistance is 2 kΩ || 3 kΩ = 1.2 kΩ, so the current source produces VA = 4 mA × 1.2 kΩ = 4.8 V.",
      "In the defined direction, the 2 kΩ current contribution is (0 − 4.8)/2 = −2.4 mA. It actually flows from A toward the deactivated voltage source.",
      "This is one superposition contribution, not the current with both sources active."
    ],
    "formula": "i₂,Is = −Is R₃/(R₂ + R₃)",
    "inputs": [
      "Voltage source: 10 V",
      "Source to A: 2 kΩ",
      "A to ground: 3 kΩ",
      "Injected current: 4 mA",
      "Requested contribution: Current source acting alone"
    ],
    "sources": [
      {
        "title": "MIT 6.002 Lecture 3: Superposition, Thévenin and Norton",
        "url": "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/resources/lecture-3/",
        "supports": "Independent-source superposition and linear port equivalents; meter-loading limits follow from the equivalent voltage divider."
      }
    ]
  },
  {
    "slug": "expansion-v2-unbalanced-bridge-current",
    "title": "Current across an unbalanced bridge",
    "version": 1,
    "signature": "9d013623",
    "method": "node",
    "difficulty": "Hard",
    "trace": [
      "Multiply each KCL equation by 4 to obtain 4VA − VB = 24 and −VA + 4VB = 12.",
      "Solving gives VA = 7.2 V and VB = 4.8 V.",
      "The bridge voltage from A to B is 2.4 V. Thus Ibridge = (7.2 − 4.8)/4 = +0.6 mA.",
      "At A, the upper resistor supplies 2.4 mA while 1.8 mA goes to ground and 0.6 mA goes to B, satisfying KCL."
    ],
    "formula": "Ibridge = (VA − VB)/Rbridge",
    "inputs": [
      "Top node T: 12 V",
      "Left leg T–A / A–ground: 2 kΩ / 4 kΩ",
      "Right leg T–B / B–ground: 4 kΩ / 2 kΩ",
      "Bridge A–B: 4 kΩ"
    ],
    "sources": [
      {
        "title": "MIT 6.002 Lecture 2: Basic Circuit Analysis Method",
        "url": "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/resources/lecture-2/",
        "supports": "KCL, circuit analysis and the passive sign convention for power."
      }
    ]
  },
  {
    "slug": "expansion-v2-source-absorbed-power",
    "title": "Is the source absorbing power?",
    "version": 1,
    "signature": "f4f55ff6",
    "method": "power",
    "difficulty": "Easy",
    "trace": [
      "The resistor carries 7 V / 350 Ω = 0.020 A from the 12 V source toward the 5 V source.",
      "The current entering the 12 V source's positive terminal is therefore −0.020 A.",
      "Its absorbed power is 12 × (−0.020) = −0.240 W = −240 mW, so it delivers 240 mW.",
      "As an energy check, the 5 V source absorbs 100 mW and the resistor dissipates (0.020)² × 350 = 140 mW."
    ],
    "formula": "Pabsorbed = V Ientering-positive",
    "inputs": [
      "Source A: 12 V",
      "Source B: 5 V",
      "Connecting resistor: 350 Ω"
    ],
    "sources": [
      {
        "title": "MIT 6.002 Lecture 2: Basic Circuit Analysis Method",
        "url": "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/resources/lecture-2/",
        "supports": "KCL, circuit analysis and the passive sign convention for power."
      }
    ]
  },
  {
    "slug": "expansion-v2-controlled-source-port-resistance",
    "title": "Measure a controlled-source port",
    "version": 1,
    "signature": "c5a9abbf",
    "method": "port",
    "difficulty": "Medium",
    "trace": [
      "Apply Vtest = 1 V. The resistor draws 0.5 mA from P to ground.",
      "The controlled source injects 0.20 mA back into P, so the test source supplies only 0.30 mA.",
      "Rport = 1 V / 0.30 mA = 3.333333 kΩ.",
      "Turning off the dependent source would incorrectly give 2 kΩ. Its controlled response is part of the network's port behavior."
    ],
    "formula": "Rport = 1/(1/R − gm)",
    "inputs": [
      "Port resistor: 2 kΩ",
      "Controlled injection: (0.20 mS)VP, ground to P",
      "Resistance definition: Rport = Vtest / Itest"
    ],
    "sources": [
      {
        "title": "MIT 6.200: Dependent Sources and Two-Port Networks",
        "url": "https://circuits.mit.edu/_static/F24/handouts/lec05a/lec05a.pdf",
        "supports": "Controlled sources stay active when a test source is applied to determine port resistance."
      }
    ]
  },
  {
    "slug": "expansion-v2-voltmeter-loading-limit",
    "title": "Choose a meter that barely loads",
    "version": 1,
    "signature": "31cb8575",
    "method": "node",
    "difficulty": "Medium",
    "trace": [
      "Without the meter, VA = 10 × 100/(100 + 100) = 5 V.",
      "With the ideal supply shorted, the resistance seen at A is Rth = 100 kΩ || 100 kΩ = 50 kΩ.",
      "The 1% loading limit requires RM/(50 kΩ + RM) ≥ 0.99, or 0.01 RM ≥ 49.5 kΩ.",
      "Thus RM ≥ 4.95 MΩ. At the minimum value, the reading is exactly 4.95 V."
    ],
    "formula": "RM,min = [q/(1 − q)]Rth, where q = 0.99",
    "inputs": [
      "Supply: 10 V",
      "Top / bottom resistors: 100 kΩ / 100 kΩ",
      "Minimum reading ratio: Vmeasured / Vunloaded ≥ 0.99"
    ],
    "sources": [
      {
        "title": "MIT 6.002 Lecture 3: Superposition, Thévenin and Norton",
        "url": "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/resources/lecture-3/",
        "supports": "Independent-source superposition and linear port equivalents; meter-loading limits follow from the equivalent voltage divider."
      }
    ]
  },
  {
    "slug": "expansion-v2-weighted-opamp-summer",
    "title": "A weighted voltage summer",
    "version": 1,
    "signature": "1ba7d9cd",
    "method": "opamp",
    "difficulty": "Medium",
    "trace": [
      "The inverting node is held at 0 V by ideal negative feedback.",
      "The input branches each inject 0.1 mA: 1/10 = 0.1 mA and 2/20 = 0.1 mA.",
      "KCL requires 0.2 mA to leave the summing node through the 30 kΩ feedback resistor. Thus (0 − Vout)/30 = 0.2, using kΩ and mA.",
      "Vout = −6 V, which lies inside the ±12 V rails and is consistent with the assumed linear state."
    ],
    "formula": "Vout = −Rf(V₁/R₁ + V₂/R₂)",
    "inputs": [
      "First input / resistor: +1 V / 10 kΩ",
      "Second input / resistor: +2 V / 20 kΩ",
      "Feedback resistor: 30 kΩ",
      "Supply rails: −12 V, +12 V"
    ],
    "sources": [
      {
        "title": "Texas Instruments SBOA092B: Handbook of Operational Amplifier Applications",
        "url": "https://www.ti.com/lit/an/sboa092b/sboa092b.pdf",
        "supports": "Ideal op-amp input constraints, negative feedback and weighted inverting summing amplifiers."
      }
    ]
  },
  {
    "slug": "expansion-v2-series-capacitor-charging",
    "title": "Charge two capacitors in series",
    "version": 1,
    "signature": "bfb63409",
    "method": "charge",
    "difficulty": "Medium",
    "trace": [
      "The equivalent series capacitance is (6 × 3)/(6 + 3) = 2 μF, so τ = 5 kΩ × 2 μF = 10 ms.",
      "The total voltage from A to ground at t = τ is 9(1 − e⁻¹) ≈ 5.689085 V.",
      "The 3 μF capacitor receives the fraction Cseries/3 μF = 2/3 of that total voltage, since its charge is Cseries VA.",
      "Therefore v3 = 6(1 − e⁻¹) ≈ 3.792723 V. The remaining 1.896362 V is across the 6 μF capacitor."
    ],
    "formula": "Cseries = C₁C₂/(C₁ + C₂); v₂(t) = (Cseries/C₂)Vs[1 − e^(−t/(RCseries))]",
    "inputs": [
      "Step source / series resistor: 9 V / 5 kΩ",
      "A to M: 6 μF",
      "M to ground: 3 μF",
      "Initial voltages: Both 0 V",
      "Observation time: 10 ms"
    ],
    "sources": [
      {
        "title": "MIT 8.02T Chapter 5: Capacitance and Dielectrics",
        "url": "https://ocw.mit.edu/courses/8-02t-electricity-and-magnetism-spring-2005/99407b81a217613e8ddec21dc3da07de_chap5capacitance.pdf",
        "supports": "Series and parallel capacitor relations and charge conservation. The charge-sharing example includes a finite resistor, which dissipates energy."
      },
      {
        "title": "MIT 6.200: RC Circuits Primer",
        "url": "https://circuits.mit.edu/F25/psets/04/rc_tutorial",
        "supports": "Capacitor current law, continuous capacitor voltage and first-order transient response; original examples apply these relations across switching intervals."
      }
    ]
  },
  {
    "slug": "expansion-v2-charge-sharing-transient",
    "title": "Share charge through a resistor",
    "version": 1,
    "signature": "262d75e9",
    "method": "charge",
    "difficulty": "Hard",
    "trace": [
      "At long times no resistor current flows, so both nodes reach (2 × 8 + 6 × 0)/(2 + 6) = 2 V.",
      "KCL gives d(VA − VB)/dt = −(VA − VB)(1/C1 + 1/C2)/R. Hence τ = 3 kΩ × 1.5 μF = 4.5 ms.",
      "At the requested time, VA − VB = 8e⁻¹ V. Combining this with charge conservation gives VA = 2 + [6/(2 + 6)](VA − VB).",
      "Thus VA = 2 + 6e⁻¹ ≈ 4.207277 V. The resistor limits current, so both capacitor voltages remain continuous at switching."
    ],
    "formula": "Vf = (C₁V₁₀ + C₂V₂₀)/(C₁ + C₂); τ = R C₁C₂/(C₁ + C₂); VA = Vf + [C₂/(C₁ + C₂)](V₁₀ − V₂₀)e^(−t/τ)",
    "inputs": [
      "Capacitor A / VA(0⁻): 2 μF / +8 V",
      "Capacitor B / VB(0⁻): 6 μF / 0 V",
      "A–B resistor: 3 kΩ",
      "Observation time: 4.5 ms"
    ],
    "sources": [
      {
        "title": "MIT 8.02T Chapter 5: Capacitance and Dielectrics",
        "url": "https://ocw.mit.edu/courses/8-02t-electricity-and-magnetism-spring-2005/99407b81a217613e8ddec21dc3da07de_chap5capacitance.pdf",
        "supports": "Series and parallel capacitor relations and charge conservation. The charge-sharing example includes a finite resistor, which dissipates energy."
      },
      {
        "title": "MIT 6.200: RC Circuits Primer",
        "url": "https://circuits.mit.edu/F25/psets/04/rc_tutorial",
        "supports": "Capacitor current law, continuous capacitor voltage and first-order transient response; original examples apply these relations across switching intervals."
      }
    ]
  },
  {
    "slug": "expansion-v2-highpass-falling-pulse",
    "title": "The negative edge of an RC pulse",
    "version": 1,
    "signature": "c4d4479a",
    "method": "firstOrder",
    "difficulty": "Medium",
    "trace": [
      "The time constant is τ = 10 kΩ × 1 μF = 10 ms. Immediately after the first step, VOUT = 4 V because the capacitor voltage remains zero.",
      "Just before the falling edge, VOUT(5 ms⁻) = 4e⁻⁰·⁵ ≈ 2.426123 V.",
      "The −4 V input step must produce the same output step to keep VIN − VOUT continuous.",
      "Therefore VOUT(5 ms⁺) = 4e⁻⁰·⁵ − 4 ≈ −1.573877 V. The output then approaches zero from below."
    ],
    "formula": "VOUT(T⁺) = Vpulse[e^(−T/RC) − 1]",
    "inputs": [
      "Series capacitor: 1 μF",
      "OUT to ground: 10 kΩ",
      "Input pulse: 0 V → 4 V → 0 V",
      "Pulse width: 5 ms"
    ],
    "sources": [
      {
        "title": "MIT 6.200: RC Circuits Primer",
        "url": "https://circuits.mit.edu/F25/psets/04/rc_tutorial",
        "supports": "Capacitor current law, continuous capacitor voltage and first-order transient response; original examples apply these relations across switching intervals."
      },
      {
        "title": "Analog Devices: An Introduction to Electrical Filters",
        "url": "https://wiki.analog.com/university/courses/engineering_discovery/lab_5",
        "supports": "Series-RC impedance division and high-pass response when output is measured across the resistor."
      }
    ]
  },
  {
    "slug": "expansion-v2-highpass-gain-magnitude",
    "title": "How much passes the high-pass?",
    "version": 1,
    "signature": "2f9db654",
    "method": "filter",
    "difficulty": "Medium",
    "trace": [
      "The transfer function is H(jω) = jωRC/(1 + jωRC).",
      "Here RC = 200 μs and ωRC = 2π × 500 × 200 × 10⁻⁶ ≈ 0.628319.",
      "The gain magnitude is 0.628319/√(1 + 0.628319²) ≈ 0.532018 V/V.",
      "The input and output must use the same amplitude convention, such as both RMS or both peak; the ratio is unchanged."
    ],
    "formula": "|H(jω)| = ωRC / √[1 + (ωRC)²]",
    "inputs": [
      "Frequency: 500 Hz",
      "Series capacitor: 100 nF",
      "Shunt resistor: 2 kΩ",
      "Output: Across resistor"
    ],
    "sources": [
      {
        "title": "Analog Devices: An Introduction to Electrical Filters",
        "url": "https://wiki.analog.com/university/courses/engineering_discovery/lab_5",
        "supports": "Series-RC impedance division and high-pass response when output is measured across the resistor."
      }
    ]
  },
  {
    "slug": "expansion-v2-ten-to-ninety-rise-time",
    "title": "Measure the 10–90% rise time",
    "version": 1,
    "signature": "0d67bd99",
    "method": "firstOrder",
    "difficulty": "Easy",
    "trace": [
      "The time constant is τ = 4 kΩ × 25 nF = 100 μs.",
      "From vOUT/Vfinal = 1 − e^(−t/τ), the time to fraction x is tx = −τ ln(1 − x).",
      "Thus t10 ≈ 10.536052 μs and t90 ≈ 230.258509 μs.",
      "Their difference is τ ln(9) ≈ 219.722458 μs, often approximated by 2.2τ."
    ],
    "formula": "tr,10–90 = RC ln(9)",
    "inputs": [
      "Step amplitude: 3.3 V",
      "Series resistor: 4 kΩ",
      "Capacitor: 25 nF",
      "Measurement thresholds: 10% and 90% of final voltage"
    ],
    "sources": [
      {
        "title": "MIT 6.200: RC Circuits Primer",
        "url": "https://circuits.mit.edu/F25/psets/04/rc_tutorial",
        "supports": "Capacitor current law, continuous capacitor voltage and first-order transient response; original examples apply these relations across switching intervals."
      }
    ]
  },
  {
    "slug": "expansion-v2-periodic-rc-ripple",
    "title": "Ripple after many square-wave cycles",
    "version": 1,
    "signature": "1450e8e4",
    "method": "periodic",
    "difficulty": "Hard",
    "trace": [
      "The time constant is 10 ms, so each half-cycle spans one time constant and a = e⁻¹.",
      "During the high interval, the capacitor rises to Vmax = 5(1 − a) + a Vmin. During the low interval it falls to Vmin = a Vmax.",
      "Substitution gives Vmax = 5/(1 + a) ≈ 3.655293 V and Vmin = 5a/(1 + a) ≈ 1.344707 V.",
      "The ripple is 5(1 − a)/(1 + a) ≈ 2.310586 V. The capacitor never reaches either input rail in this periodic state."
    ],
    "formula": "ΔVpp = Vs(1 − e^(−Thalf/RC))/(1 + e^(−Thalf/RC))",
    "inputs": [
      "Input high / low: 5 V / 0 V",
      "High duration / low duration: 10 ms / 10 ms",
      "R / C: 10 kΩ / 1 μF",
      "Operating condition: Periodic steady state"
    ],
    "sources": [
      {
        "title": "MIT 6.200: RC Circuits Primer",
        "url": "https://circuits.mit.edu/F25/psets/04/rc_tutorial",
        "supports": "Capacitor current law, continuous capacitor voltage and first-order transient response; original examples apply these relations across switching intervals."
      }
    ]
  },
  {
    "slug": "expansion-v2-bjt-mirror-base-current-error",
    "title": "The reference current feeds two bases",
    "version": 1,
    "signature": "71570054",
    "method": "bjtBias",
    "difficulty": "Medium",
    "trace": [
      "Let the equal collector currents be I. Each base draws I/100.",
      "The reference source supplies IREF = I + I/100 + I/100 = 1.02I.",
      "Therefore IOUT = 1.02 mA / 1.02 = 1.00 mA. The base currents account for the remaining 0.02 mA."
    ],
    "formula": "IOUT = IREF / (1 + 2/β)",
    "inputs": [
      "IREF: 1.02 mA",
      "β1 = β2: 100",
      "Emitter area ratio Q2/Q1: 1",
      "Q2 collector voltage: 3 V"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Recitation 18: BJT Regions of Operation and Small Signal Model",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/0df1f43ca9d2ef82dafbf858d8414d3f_MIT6_012S09_rec18.pdf",
        "supports": "BJT exponential current, hybrid-π model, and base-collector junction condition. The mirror base-current correction and port resistance follow by KCL."
      },
      {
        "title": "MIT 6.012 Lecture 17: Linear Amplifier Basics; Biasing",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/e99a2858fa78c976288c042e10b9a06c_MIT6_012F09_lec17.pdf",
        "supports": "BJT and MOS current-mirror topology, scaling with device geometry, and saturation compliance. Our BJT calculation explicitly restores the base currents omitted in the lecture approximation."
      }
    ]
  },
  {
    "slug": "expansion-v2-bjt-differential-current-steering",
    "title": "Steer the tail current three to one",
    "version": 1,
    "signature": "e6af79d7",
    "method": "differential",
    "difficulty": "Medium",
    "trace": [
      "The collector-current ratio is exp[ln(3)] = 3.",
      "Thus IC1 = 3IC2 and 4IC2 = 2 mA, so IC2 = 0.5 mA.",
      "Q1 carries 1.5 mA. The small positive base-voltage difference steers most of the tail current into Q1."
    ],
    "formula": "IC1 = IT / [1 + exp(−(VB1 − VB2)/VT)]",
    "inputs": [
      "Tail current: 2 mA",
      "VB1 − VB2: (25 mV) ln(3)",
      "VT: 25 mV",
      "β / Early effect: Infinite / neglected"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Lecture 19: Differential Amplifier Stages",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/9932f87a7b5ec3d088d0e0836a05c622_MIT6_012F09_lec19.pdf",
        "supports": "Emitter-coupled topology, current conservation, differential/common-mode decomposition, and incremental half-circuit analysis. Original numerical examples specify output polarity and bias constraints."
      }
    ]
  },
  {
    "slug": "expansion-v2-bjt-diode-connected-resistance",
    "title": "Look into a diode-connected BJT",
    "version": 1,
    "signature": "0ac276ea",
    "method": "junction",
    "difficulty": "Medium",
    "trace": [
      "With base and collector tied, vbe = vce = vx.",
      "KCL gives ix = vx/rπ + vx/ro + gm vx.",
      "The total conductance is 0.4 mS + 0.02 mS + 40 mS = 40.42 mS.",
      "The port resistance is 1/0.04042 ≈ 24.7402 Ω."
    ],
    "formula": "rdiode = 1 / (gm + 1/rπ + 1/ro)",
    "inputs": [
      "gm: 40 mS",
      "rπ: 2.5 kΩ",
      "ro: 50 kΩ",
      "Port: Joined base/collector to grounded emitter"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Recitation 18: BJT Regions of Operation and Small Signal Model",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/0df1f43ca9d2ef82dafbf858d8414d3f_MIT6_012S09_rec18.pdf",
        "supports": "BJT exponential current, hybrid-π model, and base-collector junction condition. The mirror base-current correction and port resistance follow by KCL."
      }
    ]
  },
  {
    "slug": "expansion-v2-bjt-vbe-current-ratio",
    "title": "Five times the current, a small voltage change",
    "version": 1,
    "signature": "af551524",
    "method": "junction",
    "difficulty": "Easy",
    "trace": [
      "The current ratio is 1.00/0.20 = 5.",
      "The required change is ΔVBE = VT ln(5).",
      "At VT = 25 mV, ΔVBE ≈ 40.2359 mV. This is a voltage increment, not the absolute base-emitter voltage."
    ],
    "formula": "ΔVBE = VT ln(IC2/IC1)",
    "inputs": [
      "IC1: 0.20 mA",
      "IC2: 1.00 mA",
      "VT: 25 mV",
      "Temperature: Constant"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Recitation 18: BJT Regions of Operation and Small Signal Model",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/0df1f43ca9d2ef82dafbf858d8414d3f_MIT6_012S09_rec18.pdf",
        "supports": "BJT exponential current, hybrid-π model, and base-collector junction condition. The mirror base-current correction and port resistance follow by KCL."
      }
    ]
  },
  {
    "slug": "expansion-v2-bjt-differential-common-mode-ceiling",
    "title": "When the input catches the collectors",
    "version": 1,
    "signature": "afdf01de",
    "method": "differential",
    "difficulty": "Medium",
    "trace": [
      "Each collector current is 1 mA because the ideal tail current splits equally.",
      "Each collector voltage is VC = 5 − (1 mA)(2 kΩ) = 3 V.",
      "The requested boundary is VC = VB, so VCM = 3 V. At this boundary VE = 2.3 V and VCE = 0.70 V.",
      "Increasing VCM beyond 3 V forward-biases the base-collector junction under the stated criterion."
    ],
    "formula": "VCM,upper = VCC − (IT/2)RC",
    "inputs": [
      "VCC: 5 V",
      "Each RC: 2 kΩ",
      "Tail current: 2 mA",
      "Boundary criterion: VC = VB = VCM",
      "β / VBE: Infinite / 0.70 V"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Recitation 18: BJT Regions of Operation and Small Signal Model",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/0df1f43ca9d2ef82dafbf858d8414d3f_MIT6_012S09_rec18.pdf",
        "supports": "BJT exponential current, hybrid-π model, and base-collector junction condition. The mirror base-current correction and port resistance follow by KCL."
      },
      {
        "title": "MIT 6.012 Lecture 19: Differential Amplifier Stages",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/9932f87a7b5ec3d088d0e0836a05c622_MIT6_012F09_lec19.pdf",
        "supports": "Emitter-coupled topology, current conservation, differential/common-mode decomposition, and incremental half-circuit analysis. Original numerical examples specify output polarity and bias constraints."
      }
    ]
  },
  {
    "slug": "expansion-v2-bjt-differential-output-gain",
    "title": "Keep track of both collector signs",
    "version": 1,
    "signature": "c30c6811",
    "method": "differential",
    "difficulty": "Hard",
    "trace": [
      "Each device carries 0.4 mA at bias, giving gm = (0.4 mA)/(25 mV) = 16 mS. The collector DC voltages are 3 V, above the 1 V bases.",
      "The collector signals are vc1 = −gm RC vid/2 and vc2 = +gm RC vid/2.",
      "Subtracting in the stated order gives vod = gm RC vid.",
      "The differential gain is +(0.016)(5000) = +80 V/V. A single collector would have half this gain magnitude."
    ],
    "formula": "vod/vid = +gm RC = +IT RC/(2VT)",
    "inputs": [
      "Tail current: 0.8 mA",
      "Each RC: 5 kΩ",
      "VT: 25 mV",
      "Inputs: vb1 = +vid/2; vb2 = −vid/2",
      "Output polarity: vod = vc2 − vc1"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Lecture 19: Differential Amplifier Stages",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/9932f87a7b5ec3d088d0e0836a05c622_MIT6_012F09_lec19.pdf",
        "supports": "Emitter-coupled topology, current conservation, differential/common-mode decomposition, and incremental half-circuit analysis. Original numerical examples specify output polarity and bias constraints."
      }
    ]
  },
  {
    "slug": "expansion-v2-mos-mirror-load-compliance",
    "title": "How large can the mirror load be?",
    "version": 1,
    "signature": "c4e407a8",
    "method": "mosBias",
    "difficulty": "Hard",
    "trace": [
      "M1 has VOV = √(2IREF/k1) = √[2(0.1)/5] = 0.2 V, so the common gate voltage is 0.7 V.",
      "M2 has three times k1 at the same overdrive, giving IOUT = 300 μA.",
      "The limiting drain voltage is 0.2 V. Therefore RL,max = (3.3 − 0.2) V / 0.300 mA ≈ 10.3333 kΩ.",
      "Larger resistors would require M2 to enter triode, invalidating the ideal 3:1 current ratio."
    ],
    "formula": "RL,max = (VDD − √(2IREF/k1)) / (3IREF)",
    "inputs": [
      "IREF: 100 μA",
      "k1: 5 mA/V²",
      "(W/L)2 / (W/L)1: 3",
      "VDD / VTH: 3.3 V / 0.5 V"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Lecture 17: Linear Amplifier Basics; Biasing",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/e99a2858fa78c976288c042e10b9a06c_MIT6_012F09_lec17.pdf",
        "supports": "BJT and MOS current-mirror topology, scaling with device geometry, and saturation compliance. Our BJT calculation explicitly restores the base currents omitted in the lecture approximation."
      }
    ]
  },
  {
    "slug": "expansion-v2-mos-cmos-switching-point",
    "title": "An unbalanced inverter switches early",
    "version": 1,
    "signature": "783f6345",
    "method": "mosBias",
    "difficulty": "Medium",
    "trace": [
      "Current balance gives 0.8(VM − 0.4)² = 0.2(1.8 − VM − 0.5)².",
      "The positive-overdrive branch gives 2(VM − 0.4) = 1.3 − VM.",
      "Thus 3VM = 2.1 and VM = 0.7 V.",
      "The NMOS overdrive is 0.3 V with VDS = 0.7 V; the PMOS overdrive is 0.6 V with VSD = 1.1 V. Both saturation assumptions hold."
    ],
    "formula": "√kn(VM − VTN) = √kp(VDD − VM − |VTP|)",
    "inputs": [
      "VDD: 1.8 V",
      "VTN / VTP: 0.4 V / −0.5 V",
      "kn / kp: 0.8 / 0.2 mA/V²",
      "Switching-point definition: VIN = VOUT = VM"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Lecture 12: MOS Inverter Circuits",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/118cfea55bd035e209c3bbc649698326_MIT6_012S09_lec12.pdf",
        "supports": "CMOS static logic states and current balance at VIN = VOUT with both transistors saturated."
      }
    ]
  },
  {
    "slug": "expansion-v2-mos-pass-high-body-effect",
    "title": "An NMOS passes a weakened high",
    "version": 1,
    "signature": "f68c2db8",
    "method": "mosBody",
    "difficulty": "Hard",
    "trace": [
      "Body effect raises the threshold as the source/output rises because VSB increases.",
      "The limiting condition is 3.3 − v = 0.5 + 0.4[√(0.6 + v) − √0.6].",
      "Solving this monotonic equation gives v ≈ 2.415259 V. At this output, VGS and VTH are both approximately 0.884741 V.",
      "Ignoring body effect would predict 2.8 V, which is too high for the given model."
    ],
    "formula": "VG − VOUT = VTH0 + γ[√(2φF + VOUT) − √(2φF)]",
    "inputs": [
      "Gate / drain voltage: 3.3 V / 3.3 V",
      "Body voltage: 0 V",
      "VTH0: 0.5 V",
      "γ: 0.4 V½",
      "2φF: 0.6 V"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Lecture 11: MOSFETs II; Large Signal Models",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/33eea31f564b67fc47cd9c2796500669_MIT6_012F09_lec11.pdf",
        "supports": "Threshold dependence on body bias and MOS current-region models. The pass-transistor endpoint is derived by setting gate overdrive to zero in the explicitly specified hard-threshold model."
      }
    ]
  },
  {
    "slug": "expansion-v2-mos-diode-connected-resistance",
    "title": "A gate-to-drain short changes the resistance",
    "version": 1,
    "signature": "4ceac561",
    "method": "mosSignal",
    "difficulty": "Medium",
    "trace": [
      "The DC overdrive is 0.5 V and VDS = 1.0 V, confirming saturation at the specified bias.",
      "Both vgs and vds equal vx, so ix = (gm + 1/ro)vx.",
      "The conductance is 2 mS + 0.01 mS = 2.01 mS.",
      "The resistance is 1/0.00201 ≈ 497.512 Ω. Despite zero gate current, the joined drain/gate port draws drain current."
    ],
    "formula": "rdiode = 1 / (gm + 1/ro)",
    "inputs": [
      "gm: 2 mS",
      "ro: 100 kΩ",
      "Connections: Gate = drain; source = body = ground",
      "Gate/drain bias / VTH: 1.0 V / 0.5 V"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Lecture 13: Linear Equivalent Circuits",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/17a1e469f49296aa07998fe76877de2c_MIT6_012F09_lec13.pdf",
        "supports": "Incremental transistor controlled-source and output-conductance models. The diode-connected port resistance follows by tying gate and drain in that model."
      }
    ]
  },
  {
    "slug": "expansion-v2-mos-cascode-output-resistance",
    "title": "The cascode makes a stiffer current sink",
    "version": 1,
    "signature": "9b01be48",
    "method": "mosSignal",
    "difficulty": "Hard",
    "trace": [
      "Both DC overdrives are 0.4 V. M1 has VDS1 = 0.6 V and M2 has VDS2 = 1.4 V, so both are saturated.",
      "Because M1 gate and source are at AC ground, M1 contributes only ro1 to the intermediate node.",
      "The test current satisfies ix = vx/ro1 = (vout − vx)/ro2 − gm2 vx.",
      "Rearranging gives vout/ix = ro1 + ro2 + gm2 ro1 ro2.",
      "The sum is 50 kΩ + 50 kΩ + (0.004)(50,000)(50,000) Ω = 10.1 MΩ."
    ],
    "formula": "Rout = ro1 + ro2 + gm2 ro1 ro2",
    "inputs": [
      "ro1 / ro2: 50 kΩ / 50 kΩ",
      "gm2: 4 mS",
      "Gate signals: Both at AC ground",
      "Body connections: Each body tied to its own source",
      "VG1 / VG2: 0.9 V / 1.5 V",
      "Intermediate / output DC voltage: 0.6 V / 2.0 V",
      "Both thresholds: 0.5 V"
    ],
    "sources": [
      {
        "title": "MIT 6.012: The Marvelous Cascode",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/9fce7430fe6c477c2f619ddac1e7eb1a_MIT6_012F09_lec21_cascode.pdf",
        "supports": "Test-source derivation of cascode output resistance, including finite output conductance and the condition of zero body-to-source signal."
      }
    ]
  },
  {
    "slug": "expansion-v2-mos-cmos-static-high",
    "title": "A high output without DC supply current",
    "version": 1,
    "signature": "76d20347",
    "method": "mosBias",
    "difficulty": "Easy",
    "trace": [
      "The NMOS has VGS = 0 V, below its 0.4 V threshold, and is off.",
      "The PMOS has VSG = 1.8 V and can pull the output up to the supply.",
      "At VOUT = 1.8 V, the PMOS has VSD = 0 and carries no DC current. The off NMOS provides no supply-to-ground path.",
      "Thus VOUT = 1.8 V and static supply current is zero in the specified ideal model."
    ],
    "formula": "VIN = 0 ⇒ NMOS off, VOUT = VDD, IDC = 0",
    "inputs": [
      "VDD / VIN: 1.8 V / 0 V",
      "VTN / VTP: +0.4 V / −0.4 V",
      "Output load: Ideal capacitor only",
      "Time: After settling"
    ],
    "sources": [
      {
        "title": "MIT 6.012 Lecture 12: MOS Inverter Circuits",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/118cfea55bd035e209c3bbc649698326_MIT6_012S09_lec12.pdf",
        "supports": "CMOS static logic states and current balance at VIN = VOUT with both transistors saturated."
      }
    ]
  },
  {
    "slug": "expansion-v2-fsm-encoding-storage",
    "title": "Compare FSM state-register sizes",
    "version": 1,
    "signature": "313270d9",
    "method": "storageWidth",
    "difficulty": "Easy",
    "trace": [
      "Three binary state bits provide only eight patterns, while four provide 16. The minimum binary register therefore uses four flip-flops.",
      "Conventional one-hot encoding uses 13 flip-flops for 13 states.",
      "The additional storage is 13 − 4 = 9 flip-flops. This count alone does not determine which encoding has better timing or total area."
    ],
    "formula": "Extra state flip-flops = N − ceil(log₂ N)",
    "inputs": [
      "Required states: 13",
      "Binary encoding: Minimum number of state bits",
      "One-hot encoding: One state bit per state"
    ],
    "sources": [
      {
        "title": "AMD Vivado Synthesis UG901: One-Hot State Encoding",
        "url": "https://docs.amd.com/r/en-US/ug901-vivado-synthesis/One-Hot-State-Encoding",
        "supports": "A conventional one-hot encoding assigns one state-register bit per FSM state. Binary capacity is independently counted in the tests."
      }
    ]
  },
  {
    "slug": "expansion-v2-static-hazard-consensus",
    "title": "Keep the output high through a transition",
    "version": 1,
    "signature": "a26328e6",
    "method": "boolean",
    "difficulty": "Hard",
    "trace": [
      "The term p AND q is already settled high and does not depend on the changing signal s, so it holds the OR output high while the two original paths exchange responsibility.",
      "It does not alter the truth table: whenever pq = 1, either sp or s̅q is already 1 for each stable value of s.",
      "The augmented expression sp + s̅q + pq includes the consensus term. The guarantee here concerns the stated single-input transition and the specified retained gate structure."
    ],
    "formula": "sp + s̅q = sp + s̅q + pq",
    "inputs": [
      "Original function: F = sp + s̅q",
      "Stable inputs during transition: p = q = 1",
      "Changing input: s only"
    ],
    "sources": [
      {
        "title": "University of Illinois ECE 120: Student Notes, Static Hazards",
        "url": "https://lumetta.web.engr.illinois.edu/120-F16/ece120-fall-2016-notes-for-students.pdf",
        "supports": "Static-1 hazards in two-level sum-of-products circuits and the use of redundant consensus implicants to retain a high path through a single-input transition."
      }
    ]
  },
  {
    "slug": "expansion-v2-cmos-switching-power",
    "title": "Budget the capacitive switching power",
    "version": 1,
    "signature": "d7097545",
    "method": "interface",
    "difficulty": "Medium",
    "trace": [
      "Each charging event draws energy C·V² = 12 pF × (1.2 V)² = 17.28 pJ from the supply.",
      "The mean rate of charging events is 0.18 × 250 MHz = 45 million per second.",
      "Multiplying energy per event by event rate gives 0.0007776 W = 0.7776 mW.",
      "There is no additional factor of one-half: half the supplied charging energy becomes stored capacitor energy and is subsequently dissipated on discharge. A different activity convention would require a corresponding formula change."
    ],
    "formula": "P = α₀→₁ C VDD² f",
    "inputs": [
      "Load capacitance: 12 pF",
      "Supply voltage: 1.2 V",
      "Clock frequency: 250 MHz",
      "0 → 1 activity: 0.18 transitions per cycle"
    ],
    "sources": [
      {
        "title": "CERCS Technical Report GIT-CERCS-11-07: Dynamic Power Model",
        "url": "https://www.istc-cc.cmu.edu/publications/papers/2012/git-cercs-11-07.pdf",
        "supports": "Capacitive CMOS switching power depends on activity, capacitance, supply voltage squared, and clock frequency. The problem explicitly defines rising-transition activity and derives the result from charge drawn from the supply."
      }
    ]
  },
  {
    "slug": "expansion-v2-interface-noise-margin",
    "title": "Find the weaker logic noise margin",
    "version": 1,
    "signature": "6aae9e8d",
    "method": "interface",
    "difficulty": "Easy",
    "trace": [
      "The high margin is VOH,min − VIH,min = 2.9 − 2.1 = 0.8 V.",
      "The low margin is VIL,max − VOL,max = 0.9 − 0.3 = 0.6 V.",
      "The smaller guaranteed static margin is therefore 0.6 V, associated with the low level."
    ],
    "formula": "NMH = VOH,min − VIH,min; NML = VIL,max − VOL,max",
    "inputs": [
      "VOH,min: 2.9 V",
      "VOL,max: 0.3 V",
      "VIH,min: 2.1 V",
      "VIL,max: 0.9 V"
    ],
    "sources": [
      {
        "title": "MIT 6.004: The Digital Abstraction, Annotated Slides",
        "url": "https://www.ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c2/c2s1/",
        "supports": "Separate guaranteed input/output thresholds, high and low noise margins, and choosing the smaller static margin."
      }
    ]
  },
  {
    "slug": "expansion-v2-cdc-short-pulse",
    "title": "Can two synchronizer registers capture every pulse?",
    "version": 1,
    "signature": "460f2884",
    "method": "cdc",
    "difficulty": "Medium",
    "trace": [
      "For example, let sampling edges occur at 0 ns and 10 ns, with the pulse high from 2 ns through 6 ns.",
      "The first flip-flop samples low at both edges, so there is no sampled high value for the second flip-flop to propagate.",
      "A two-stage synchronizer reduces the chance that unresolved metastability reaches downstream logic, but it does not store events that were never sampled. Reliable event transfer requires an appropriate pulse-transfer protocol with its timing and event-spacing requirements satisfied."
    ],
    "formula": "Tdestination = 1 / 100 MHz = 10 ns > 4 ns",
    "inputs": [
      "High pulse width: 4 ns",
      "Destination clock: 100 MHz; 10 ns period",
      "Circuit: Two cascaded rising-edge D flip-flops"
    ],
    "sources": [
      {
        "title": "Clifford E. Cummings: Synthesis and Scripting Techniques for Designing Multi-Asynchronous Clock Designs (SNUG 2001)",
        "url": "https://citeseerx.ist.psu.edu/document?doi=6b551d6b6f680bbcbdc25395dd78023032dd25b1&repid=rep1&type=pdf",
        "supports": "A short asynchronous control pulse may occur entirely between receiving clock edges and be missed by a conventional two-register level synchronizer; event transfer requires additional protocol assumptions."
      }
    ]
  },
  {
    "slug": "expansion-v2-mealy-output-between-edges",
    "title": "Trace an unregistered Mealy output",
    "version": 1,
    "signature": "c9eaff05",
    "method": "state",
    "difficulty": "Medium",
    "trace": [
      "The state comparison remains true because the state stays READY.",
      "The combinational expression therefore changes from 1 AND 0 to 1 AND 1 when request rises.",
      "Grant becomes 1 after the output logic settles, without waiting for a clock edge. This is Mealy-style output behavior because the output depends directly on both the current state and the current input."
    ],
    "formula": "READY ⇒ grant = request",
    "inputs": [
      "State between edges: READY, unchanged",
      "Output logic: grant = (state == READY) AND request",
      "Input transition: request: 0 → 1"
    ],
    "sources": [
      {
        "title": "Auburn ELEC 4200: Sequential Logic Models, Mealy and Moore Outputs",
        "url": "https://www.eng.auburn.edu/~nelsovp/courses/elec4200/ClassMaterial/Review_Combinational.pdf",
        "supports": "Unregistered Mealy outputs depend on current state and current inputs and may respond to an input change between state-register clock edges."
      }
    ]
  },
  {
    "slug": "expansion-v2-hdl-full-subtractor-borrow",
    "title": "Write the full-subtractor borrow output",
    "version": 1,
    "signature": "94b0c82f",
    "method": "hdlLogic",
    "difficulty": "Medium",
    "trace": [
      "For a = 0, y must equal b OR bin because subtracting either high bit makes the result negative.",
      "For a = 1, only b = bin = 1 produces a negative result, so y is b AND bin.",
      "Combining and simplifying those cases gives (~a & b) | (~a & bin) | (b & bin). The difference bit is outside the requested output."
    ],
    "formula": "Bout = a̅b + a̅Bin + bBin",
    "inputs": [
      "Inputs: a, b, bin; one bit each",
      "Output: y = borrow-out",
      "Arithmetic convention: a − b − bin = d − 2y"
    ],
    "sources": [
      {
        "title": "Cornell ECE 4750: Tutorial 3, Verilog Hardware Description Language",
        "url": "https://web.csl.cornell.edu/courses/ece4750/handouts/ece4750-tut3-verilog.pdf",
        "supports": "Continuous assignments, one-bit Boolean operators, and combinational descriptions. Borrow, unsigned comparison, and enabled decoding are derived independently from each problem's arithmetic or address specification and exhaustively tested."
      }
    ]
  },
  {
    "slug": "expansion-v2-hdl-unsigned-greater-than",
    "title": "Compare two unsigned words without vector syntax",
    "version": 1,
    "signature": "f0a72a11",
    "method": "hdlLogic",
    "difficulty": "Medium",
    "trace": [
      "The term a1 & ~b1 detects A having the larger most significant bit.",
      "If the high bits match, the low-bit comparison a0 & ~b0 decides whether A is strictly larger.",
      "ORing the first condition with ((a1 == b1) & a0 & ~b0) covers all winning cases and leaves equality low."
    ],
    "formula": "A > B ⇔ (a1 > b1) OR ((a1 = b1) AND (a0 > b0))",
    "inputs": [
      "Word A: a1 a0; a1 is most significant",
      "Word B: b1 b0; b1 is most significant",
      "Output condition: y = 1 iff A > B"
    ],
    "sources": [
      {
        "title": "Cornell ECE 4750: Tutorial 3, Verilog Hardware Description Language",
        "url": "https://web.csl.cornell.edu/courses/ece4750/handouts/ece4750-tut3-verilog.pdf",
        "supports": "Continuous assignments, one-bit Boolean operators, and combinational descriptions. Borrow, unsigned comparison, and enabled decoding are derived independently from each problem's arithmetic or address specification and exhaustively tested."
      }
    ]
  },
  {
    "slug": "expansion-v2-hdl-enabled-decoder-line",
    "title": "Decode one enabled address line",
    "version": 1,
    "signature": "7fa481ff",
    "method": "hdlLogic",
    "difficulty": "Easy",
    "trace": [
      "The address match is a1 & ~a0.",
      "Including en in the AND forces y low for every address whenever decoding is disabled.",
      "The final assignment en & a1 & ~a0 is high only for the single input combination en = 1, a1 = 1, a0 = 0."
    ],
    "formula": "y = en · a1 · a̅0",
    "inputs": [
      "Inputs: en, a1, a0",
      "Selected address: 10₂",
      "Enable convention: en = 1 enables decoding"
    ],
    "sources": [
      {
        "title": "Cornell ECE 4750: Tutorial 3, Verilog Hardware Description Language",
        "url": "https://web.csl.cornell.edu/courses/ece4750/handouts/ece4750-tut3-verilog.pdf",
        "supports": "Continuous assignments, one-bit Boolean operators, and combinational descriptions. Borrow, unsigned comparison, and enabled decoding are derived independently from each problem's arithmetic or address specification and exhaustively tested."
      }
    ]
  },
  {
    "slug": "expansion-v2-hdl-asynchronous-reset-assertion",
    "title": "Assert reset between clock edges",
    "version": 1,
    "signature": "b118489a",
    "method": "hdlEvents",
    "difficulty": "Medium",
    "trace": [
      "The falling edge of rst_n triggers the process even though clk does not change.",
      "The condition !rst_n is true, so the process schedules q to become 0.",
      "After that nonblocking update, q is 0. This question concerns asynchronous reset assertion in RTL; physical reset deassertion has separate recovery and removal timing requirements."
    ],
    "formula": "negedge rst_n ⇒ schedule q ← 0",
    "inputs": [
      "Sensitivity: posedge clk or negedge rst_n",
      "Reset branch: if (!rst_n) q <= 1'b0;",
      "Only event: rst_n: 1 → 0; clk remains low"
    ],
    "sources": [
      {
        "title": "AMD Vivado Synthesis UG901: Using Sequential Always Blocks",
        "url": "https://docs.amd.com/r/en-US/ug901-vivado-synthesis/Using-Sequential-Always-Blocks",
        "supports": "An edge-sensitive asynchronous reset event is included separately from the clock event in a sequential always block and can trigger a reset assignment without a clock edge."
      }
    ]
  },
  {
    "slug": "expansion-v2-hdl-replication-width",
    "title": "Count bits in a replicated concatenation",
    "version": 1,
    "signature": "082e0a22",
    "method": "hdlSigned",
    "difficulty": "Easy",
    "trace": [
      "The concatenation {a, b} contains three bits from a followed by two bits from b, for a width of five bits.",
      "Replicating it twice produces {a, b, a, b}, whose width is 3 + 2 + 3 + 2 = 10 bits.",
      "The values stored in a and b do not change their declared widths."
    ],
    "formula": "Width({N{a,b}}) = N × (width(a) + width(b))",
    "inputs": [
      "a: logic [2:0]; 3 bits",
      "b: logic [1:0]; 2 bits",
      "Expression: {2{a, b}}"
    ],
    "sources": [
      {
        "title": "IEEE Std 1800-2017 SystemVerilog, Section 11.4.12.1: Replication Operator (MIT-hosted copy)",
        "url": "https://fpga.mit.edu/6205/_static/F25/documentation/1800-2017.pdf",
        "supports": "Packed replication joins the specified number of complete copies of a concatenation. The original expression width follows from the explicitly declared operand widths."
      }
    ]
  },
  {
    "slug": "expansion-v2-hdl-casez-first-match",
    "title": "Resolve overlapping casez patterns",
    "version": 1,
    "signature": "c6644983",
    "method": "hdlEvents",
    "difficulty": "Medium",
    "trace": [
      "The selector 101 matches 1?? because its most significant bit is 1.",
      "It also matches ?01 because its low two bits are 01.",
      "The first matching branch wins, so only y = 2'b01 executes. Overlapping branches should be intentional and reviewed carefully because their ordering affects behavior."
    ],
    "formula": "casez selects the first matching branch in source order",
    "inputs": [
      "Selector: sel = 3'b101",
      "First branch: 3'b1??: y = 2'b01;",
      "Second branch: 3'b?01: y = 2'b10;",
      "Default: y = 2'b00;"
    ],
    "sources": [
      {
        "title": "AMD Vivado Synthesis UG901: Case Statements",
        "url": "https://docs.amd.com/r/en-US/ug901-vivado-synthesis/Case-Statements",
        "supports": "casez question-mark wildcards, source-order evaluation, and execution of the first matching case branch."
      }
    ]
  },
  {
    "slug": "expansion-v3-series-rl-phasor",
    "title": "A series RL circuit in phasors",
    "version": 1,
    "signature": "bad0ffc2",
    "method": "phasor",
    "difficulty": "Medium",
    "trace": [
      "Z = 30 + j40 Ω, so |Z| = √(30² + 40²) = 50 Ω.",
      "IRMS = 12/50 = 0.24 A = 240 mA.",
      "arg(Z) = atan2(40,30) = 53.1301°. Therefore arg(I) = −53.1301°: current lags voltage."
    ],
    "formula": "Z = R + jXL; I = V/Z",
    "inputs": [
      "Source: 12 V RMS ∠0°",
      "Resistance: 30 Ω",
      "Inductive reactance: +j40 Ω"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: RLC Series Circuits with AC",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/15-3-rlc-series-circuits-with-ac",
        "supports": "Complex impedances and current phase; real power follows resistor dissipation and RMS current."
      }
    ]
  },
  {
    "slug": "expansion-v3-series-rc-phasor",
    "title": "A capacitive load leads the source",
    "version": 1,
    "signature": "e5d4f9b1",
    "method": "phasor",
    "difficulty": "Medium",
    "trace": [
      "Z = 150 − j200 Ω, so |Z| = 250 Ω and arg(Z) = −53.1301°.",
      "IRMS = 10/250 = 0.04 A = 40 mA.",
      "The current phase is 0° − (−53.1301°) = +53.1301°. Positive phase here means current leads the source."
    ],
    "formula": "I = V/(R − jXC)",
    "inputs": [
      "Source: 10 V RMS ∠0°",
      "Resistance: 150 Ω",
      "Capacitor impedance: −j200 Ω"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: RLC Series Circuits with AC",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/15-3-rlc-series-circuits-with-ac",
        "supports": "Complex impedances and current phase; real power follows resistor dissipation and RMS current."
      }
    ]
  },
  {
    "slug": "expansion-v3-parallel-rl-current",
    "title": "Add branch currents as phasors",
    "version": 1,
    "signature": "8f7583a2",
    "method": "phasor",
    "difficulty": "Medium",
    "trace": [
      "IR = 12/30 = 0.4 A. IL = 12/(j40) = −j0.3 A.",
      "The total is 0.4 − j0.3 A, whose magnitude is √(0.4² + 0.3²) = 0.5 A."
    ],
    "formula": "|I| = √[(V/R)² + (V/XL)²]",
    "inputs": [
      "Source: 12 V RMS",
      "Resistor branch: 30 Ω",
      "Inductor branch: j40 Ω"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: RLC Series Circuits with AC",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/15-3-rlc-series-circuits-with-ac",
        "supports": "Complex impedances and current phase; real power follows resistor dissipation and RMS current."
      }
    ]
  },
  {
    "slug": "expansion-v3-rl-real-power",
    "title": "Real power is not apparent power",
    "version": 1,
    "signature": "25bb38a6",
    "method": "phasor",
    "difficulty": "Medium",
    "trace": [
      "|Z| = √(18² + 24²) = 30 Ω; IRMS = 30/30 = 1 A.",
      "P = I²R = 18 W. The apparent power is 30 VA and the power factor is 18/30 = 0.6."
    ],
    "formula": "P = Irms² R = Vrms Irms cos(φ)",
    "inputs": [
      "Source: 30 V RMS",
      "R: 18 Ω",
      "XL: 24 Ω"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: RLC Series Circuits with AC",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/15-3-rlc-series-circuits-with-ac",
        "supports": "Complex impedances and current phase; real power follows resistor dissipation and RMS current."
      }
    ]
  },
  {
    "slug": "expansion-v3-capacitive-reactance",
    "title": "From frequency to capacitor impedance",
    "version": 1,
    "signature": "69b82ec4",
    "method": "phasor",
    "difficulty": "Easy",
    "trace": [
      "ω = 2π × 1000 rad/s.",
      "|XC| = 1/(2π × 1000 × 10⁻⁶) ≈ 159.1549 Ω. The impedance itself is −j159.1549 Ω."
    ],
    "formula": "ZC = 1/(jωC); |XC| = 1/(2πfC)",
    "inputs": [
      "Capacitance: 1 μF",
      "Frequency: 1 kHz"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: RLC Series Circuits with AC",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/15-3-rlc-series-circuits-with-ac",
        "supports": "Complex impedances and current phase; real power follows resistor dissipation and RMS current."
      }
    ]
  },
  {
    "slug": "expansion-v3-rlc-resonance",
    "title": "Find the series resonant frequency",
    "version": 1,
    "signature": "f539c192",
    "method": "secondOrder",
    "difficulty": "Medium",
    "trace": [
      "The reactances cancel when ω²LC = 1.",
      "f0 = 1/(2π√(LC)) = 1/(2π√(0.01 × 100 × 10⁻⁹)) ≈ 5032.9212 Hz.",
      "At this frequency the source sees the 20 Ω resistance alone."
    ],
    "formula": "f0 = 1/(2π√LC)",
    "inputs": [
      "R: 20 Ω",
      "L: 10 mH",
      "C: 100 nF"
    ],
    "sources": [
      {
        "title": "OpenStax: Resonance in an AC Circuit",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/15-5-resonance-in-an-ac-circuit",
        "supports": "Series resonance is cancellation of inductive and capacitive reactance."
      }
    ]
  },
  {
    "slug": "expansion-v3-lowpass-corner",
    "title": "Three views of an RC corner",
    "version": 1,
    "signature": "29f7d076",
    "method": "filter",
    "difficulty": "Medium",
    "trace": [
      "RC = 100 μs, so fc = 1/(2πRC) ≈ 1591.5494 Hz.",
      "At fc, H = 1/(1+j) = (1−j)/2. Its magnitude is 1/√2 ≈ 0.707107 V/V.",
      "The output phase is −45°. This corner is approximately −3.01 dB, not a gain of one-half."
    ],
    "formula": "H(jω) = 1/(1+jωRC)",
    "inputs": [
      "R: 1 kΩ",
      "C: 100 nF",
      "Output: Across capacitor"
    ],
    "sources": [
      {
        "title": "Analog Devices: An Introduction to Electrical Filters",
        "url": "https://wiki.analog.com/university/courses/engineering_discovery/lab_5",
        "supports": "RC frequency response and corner behavior. The cascade uses ideal buffering so unloaded stage responses multiply."
      }
    ]
  },
  {
    "slug": "expansion-v3-highpass-corner-phase",
    "title": "Phase at a high-pass corner",
    "version": 1,
    "signature": "edbdda5c",
    "method": "filter",
    "difficulty": "Easy",
    "trace": [
      "At ωRC = 1, H = j/(1+j) = (1+j)/2.",
      "Its angle is +45°, so the output leads the input."
    ],
    "formula": "arg H = 90° − atan(ωRC)",
    "inputs": [
      "C: 100 nF",
      "R: 10 kΩ",
      "Frequency: f = 1/(2πRC)"
    ],
    "sources": [
      {
        "title": "Analog Devices: An Introduction to Electrical Filters",
        "url": "https://wiki.analog.com/university/courses/engineering_discovery/lab_5",
        "supports": "RC frequency response and corner behavior. The cascade uses ideal buffering so unloaded stage responses multiply."
      }
    ]
  },
  {
    "slug": "expansion-v3-opamp-headroom",
    "title": "Check gain before accepting an output",
    "version": 1,
    "signature": "a60012fb",
    "method": "opamp",
    "difficulty": "Medium",
    "trace": [
      "The unrestricted gain is −3 V/V, giving −6 V for a +2 V input.",
      "The model cannot reach −6 V, so actual output clips at −4 V. The inverting input is then no longer virtual ground.",
      "To avoid clipping for VIN ≥ 0, 3VIN ≤ 4 V, hence VIN,max = 4/3 ≈ 1.333333 V."
    ],
    "formula": "Vlinear = −(Rf/Rin)VIN; |Vlinear| ≤ 4 V",
    "inputs": [
      "VIN: +2 V",
      "Rin / Rf: 10 kΩ / 30 kΩ",
      "Output limits: −4 V to +4 V"
    ],
    "sources": [
      {
        "title": "Texas Instruments SBOA092B: Handbook of Operational Amplifier Applications",
        "url": "https://www.ti.com/lit/an/sboa092b/sboa092b.pdf",
        "supports": "Feedback configurations, linear operating constraints, bias-current errors and finite open-loop gain. The troubleshooting example derives from the stated ideal fault model."
      }
    ]
  },
  {
    "slug": "expansion-v3-opamp-bandwidth",
    "title": "Trade closed-loop gain for bandwidth",
    "version": 1,
    "signature": "625457ab",
    "method": "opamp",
    "difficulty": "Medium",
    "trace": [
      "Noise gain is 1 + 90/10 = 10.",
      "The specified approximation gives fBW ≈ 2 MHz / 10 = 200 kHz.",
      "Real designs must also check phase margin, device specifications and large-signal slew rate."
    ],
    "formula": "fBW ≈ fT/(1+Rf/Rg)",
    "inputs": [
      "Unity-gain frequency: 2 MHz",
      "Feedback resistor: 90 kΩ",
      "Ground resistor: 10 kΩ"
    ],
    "sources": [
      {
        "title": "Analog Devices MT-033: Voltage Feedback Op Amp Gain and Bandwidth",
        "url": "https://www.analog.com/media/en/training-seminars/tutorials/MT-033.pdf",
        "supports": "Dominant-pole gain-bandwidth approximation and noise gain."
      }
    ]
  },
  {
    "slug": "expansion-v3-opamp-slew-limit",
    "title": "A sine wave meets the slew limit",
    "version": 1,
    "signature": "f4724011",
    "method": "opamp",
    "difficulty": "Medium",
    "trace": [
      "The waveform slope is 2πf × 5 cos(2πft) V/s, so its maximum magnitude is 10πf V/s.",
      "Set 10πf = 10⁶ V/s to obtain f ≈ 31830.9886 Hz = 31.8310 kHz.",
      "The 5 V quantity is peak amplitude; using peak-to-peak amplitude would introduce a factor-of-two error."
    ],
    "formula": "fmax = SR/(2πVpeak)",
    "inputs": [
      "Output amplitude: 5 V peak",
      "Slew rate: 1 V/μs"
    ],
    "sources": [
      {
        "title": "Analog Devices: Why does the output signal of my amplifier look like a triangle?",
        "url": "https://www.analog.com/en/resources/faqs/faq_opamp_slewrate.html",
        "supports": "Large-signal sine-wave slope and slew-rate limitation."
      }
    ]
  },
  {
    "slug": "expansion-v3-difference-amplifier",
    "title": "Reject the common part of two inputs",
    "version": 1,
    "signature": "174f481c",
    "method": "opamp",
    "difficulty": "Medium",
    "trace": [
      "V+ = 0.8 × 100/110 = 0.7272727 V and V− equals it.",
      "KCL at V− gives VOUT = 11V− − 10V1 = 8 − 5 = 3 V.",
      "This is inside the supply rails and equals 10(V2−V1)."
    ],
    "formula": "VOUT = (R2/R1)(V2−V1)",
    "inputs": [
      "V1 / V2: 0.5 V / 0.8 V",
      "R1 / R3: 10 kΩ / 10 kΩ",
      "R2 / R4: 100 kΩ / 100 kΩ"
    ],
    "sources": [
      {
        "title": "Texas Instruments SBOA092B: Handbook of Operational Amplifier Applications",
        "url": "https://www.ti.com/lit/an/sboa092b/sboa092b.pdf",
        "supports": "Feedback configurations, linear operating constraints, bias-current errors and finite open-loop gain. The troubleshooting example derives from the stated ideal fault model."
      }
    ]
  },
  {
    "slug": "expansion-v3-input-bias-offset",
    "title": "Follow the bias-current direction",
    "version": 1,
    "signature": "3fb22411",
    "method": "opamp",
    "difficulty": "Medium",
    "trace": [
      "V− = V+ = 0 V. The resistor from V− to ground has zero voltage across it.",
      "KCL requires current (VOUT − 0)/100 kΩ = 100 nA into the summing node.",
      "VOUT = +10 mV. The positive sign is required to supply a current entering the input."
    ],
    "formula": "VOUT = IB− Rf",
    "inputs": [
      "Bias current into − input: 100 nA",
      "Input resistor to ground: 10 kΩ",
      "Feedback resistor: 100 kΩ"
    ],
    "sources": [
      {
        "title": "Texas Instruments SBOA092B: Handbook of Operational Amplifier Applications",
        "url": "https://www.ti.com/lit/an/sboa092b/sboa092b.pdf",
        "supports": "Feedback configurations, linear operating constraints, bias-current errors and finite open-loop gain. The troubleshooting example derives from the stated ideal fault model."
      }
    ]
  },
  {
    "slug": "expansion-v3-finite-loop-gain",
    "title": "Closed-loop gain with finite open-loop gain",
    "version": 1,
    "signature": "b4b52c13",
    "method": "opamp",
    "difficulty": "Medium",
    "trace": [
      "VOUT = 1000(VIN − 0.1VOUT).",
      "Thus 101VOUT = 1000VIN and gain = 1000/101 ≈ 9.900990 V/V.",
      "The ideal infinite-gain value is 10 V/V; finite loop gain makes the actual value slightly smaller."
    ],
    "formula": "Acl = A/(1+Aβ)",
    "inputs": [
      "Open-loop DC gain A: 1000 V/V",
      "Feedback fraction β: 0.1 V/V"
    ],
    "sources": [
      {
        "title": "Texas Instruments SBOA092B: Handbook of Operational Amplifier Applications",
        "url": "https://www.ti.com/lit/an/sboa092b/sboa092b.pdf",
        "supports": "Feedback configurations, linear operating constraints, bias-current errors and finite open-loop gain. The troubleshooting example derives from the stated ideal fault model."
      }
    ]
  },
  {
    "slug": "expansion-v3-buck-ripple",
    "title": "Size a buck converter operating point",
    "version": 1,
    "signature": "cef81731",
    "method": "converter",
    "difficulty": "Medium",
    "trace": [
      "D = 3/12 = 0.25. During the on interval VL = 9 V for 2.5 μs.",
      "ΔIL,pp = VL Δt/L = 9 × 2.5 μs / 60 μH = 0.375 A.",
      "Average current is 3/6 = 0.5 A. Peak is 0.5 + 0.375/2 = 0.6875 A. Minimum is 0.3125 A, confirming continuous conduction."
    ],
    "formula": "D = VO/VI; ΔIL,pp = (VI−VO)D/(Lfs)",
    "inputs": [
      "VIN / VOUT: 12 V / 3 V",
      "L / fs: 60 μH / 100 kHz",
      "Load: 6 Ω"
    ],
    "sources": [
      {
        "title": "Texas Instruments SLVA477B: Basic Calculation of a Buck Converter Power Stage",
        "url": "https://www.ti.com/lit/an/slva477b/slva477b.pdf",
        "supports": "Continuous-conduction buck duty cycle and inductor ripple relations; the original problem explicitly takes the lossless limit."
      }
    ]
  },
  {
    "slug": "expansion-v3-boost-duty",
    "title": "Duty ratio of an ideal boost stage",
    "version": 1,
    "signature": "bdeffed3",
    "method": "converter",
    "difficulty": "Easy",
    "trace": [
      "Volt-second balance gives 5D + (5−12.5)(1−D) = 0.",
      "Solving gives D = 1−5/12.5 = 0.6, or 60%."
    ],
    "formula": "D = 1−VIN/VOUT",
    "inputs": [
      "VIN: 5 V",
      "VOUT: 12.5 V",
      "Mode: Continuous conduction"
    ],
    "sources": [
      {
        "title": "Texas Instruments SLVA372D: Basic Calculation of a Boost Converter Power Stage",
        "url": "https://www.ti.com/lit/an/slva372d/slva372d.pdf",
        "supports": "Continuous-conduction boost conversion ratio; original problem uses ideal components."
      }
    ]
  },
  {
    "slug": "expansion-v3-linear-regulator-loss",
    "title": "Heat in a linear regulator",
    "version": 1,
    "signature": "517de292",
    "method": "power",
    "difficulty": "Easy",
    "trace": [
      "The regulator drops 5−3.3 = 1.7 V at 0.3 A.",
      "Ploss = 1.7 × 0.3 = 0.51 W. Input power is 1.5 W and output power is 0.99 W, which confirms the energy balance."
    ],
    "formula": "Ploss = (VIN−VOUT)ILOAD",
    "inputs": [
      "VIN / VOUT: 5 V / 3.3 V",
      "Load current: 300 mA"
    ],
    "sources": [
      {
        "title": "MIT 6.002 Lecture 2: Basic Circuit Analysis Method",
        "url": "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/resources/lecture-2/",
        "supports": "KCL, Ohm law, and circuit power balance support the original regulator dissipation and open-divider examples."
      }
    ]
  },
  {
    "slug": "expansion-v3-adc-step-code",
    "title": "Resolution and code of an ideal ADC",
    "version": 1,
    "signature": "189936f6",
    "method": "adc",
    "difficulty": "Medium",
    "trace": [
      "One LSB = 3.3/4096 V = 0.8056640625 mV.",
      "VIN/VREF = 1/2, giving floor(4096/2) = 2048.",
      "The top code is 4095, but the stated quantizer step denominator is 4096."
    ],
    "formula": "LSB = VREF/2^N; code = floor(2^N VIN/VREF)",
    "inputs": [
      "Resolution: 12 bits",
      "VREF: 3.3 V",
      "VIN: 1.65 V",
      "Code convention: floor(4096 VIN/VREF)"
    ],
    "sources": [
      {
        "title": "Analog Devices: Types of ADCs and DACs",
        "url": "https://www.analog.com/en/resources/technical-articles/types-of-adcs-and-dacs.html",
        "supports": "LSB size and converter resolution. Each original code question states its precise floor quantizer convention."
      }
    ]
  },
  {
    "slug": "expansion-v3-adc-quantization-noise",
    "title": "RMS noise of an ideal quantizer",
    "version": 1,
    "signature": "49811e47",
    "method": "adc",
    "difficulty": "Medium",
    "trace": [
      "Mean square error is (1/q)∫ from −q/2 to q/2 of e² de = q²/12.",
      "Therefore error RMS is q/√12 = 1/√12 mV ≈ 0.288675 mV."
    ],
    "formula": "erms = q/√12",
    "inputs": [
      "Quantization step q: 1 mV",
      "Error distribution: Uniform over [−q/2, +q/2]"
    ],
    "sources": [
      {
        "title": "Analog Devices: Managing Noise in the Signal Chain, Part 2",
        "url": "https://www.analog.com/en/resources/technical-articles/2022/07/16/11/45/managing-noise-in-the-signal-chain-part-2-noise-and-distortion-in-data-converters.html",
        "supports": "Uniform quantization-error model and RMS quantization noise."
      }
    ]
  },
  {
    "slug": "expansion-v3-debug-divider-open",
    "title": "Debug a divider stuck at the supply",
    "version": 1,
    "signature": "554ae606",
    "method": "diagnosis",
    "difficulty": "Easy",
    "trace": [
      "An open lower resistor leaves no current path to ground, so current through the verified upper resistor is zero.",
      "A then equals the 5 V supply. A short to ground would give 0 V; a 5 kΩ lower resistor would give 5/3 V."
    ],
    "formula": "I = 0 ⇒ Vupper = 0",
    "inputs": [
      "Supply: 5 V, verified",
      "Upper resistor: 10 kΩ, verified",
      "Expected / measured A: 2.5 V / 5 V"
    ],
    "sources": [
      {
        "title": "MIT 6.002 Lecture 2: Basic Circuit Analysis Method",
        "url": "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/resources/lecture-2/",
        "supports": "KCL, Ohm law, and circuit power balance support the original regulator dissipation and open-divider examples."
      }
    ]
  },
  {
    "slug": "expansion-v3-debug-feedback-open",
    "title": "Debug an amplifier pinned to a rail",
    "version": 1,
    "signature": "ac5f297f",
    "method": "diagnosis",
    "difficulty": "Medium",
    "trace": [
      "An open feedback path makes V− ≈ VIN = +0.10 V because input current is negligible.",
      "Then V+−V− < 0 and high open-loop gain drives output to the negative limit.",
      "Healthy 100 kΩ feedback would instead produce about −1 V and V− near 0 V. A shorted feedback path would act as a ground-referenced follower."
    ],
    "formula": "Open feedback: V− ≈ VIN; VOUT → negative limit",
    "inputs": [
      "VIN: +0.10 V, verified",
      "Rin: 10 kΩ, verified",
      "Nominal Rf: 100 kΩ",
      "Measured V− / VOUT: +0.10 V / −4.5 V"
    ],
    "sources": [
      {
        "title": "Texas Instruments SBOA092B: Handbook of Operational Amplifier Applications",
        "url": "https://www.ti.com/lit/an/sboa092b/sboa092b.pdf",
        "supports": "Feedback configurations, linear operating constraints, bias-current errors and finite open-loop gain. The troubleshooting example derives from the stated ideal fault model."
      }
    ]
  },
  {
    "slug": "expansion-v3-debug-probe-loading",
    "title": "The probe changes the edge you measure",
    "version": 1,
    "signature": "9c4155da",
    "method": "diagnosis",
    "difficulty": "Medium",
    "trace": [
      "The total capacitance is 10 + 90 = 100 pF, so τ = 100 kΩ × 100 pF = 10 μs.",
      "A lower-capacitance probe should bring the measured edge closer to the unloaded 1 μs response.",
      "Changing the display scale does not remove electrical loading. Real probes also have finite resistance and frequency-dependent behavior."
    ],
    "formula": "τloaded = R(Ccircuit+Cprobe)",
    "inputs": [
      "Source resistor: 100 kΩ",
      "Circuit capacitance: 10 pF",
      "Probe capacitance: 90 pF",
      "Measured time constant: 10 μs"
    ],
    "sources": [
      {
        "title": "Tektronix: How Oscilloscope Probes Affect Your Measurement",
        "url": "https://www.tek.com/en/documents/application-note/how-oscilloscope-probes-affect-your-measurement",
        "supports": "Probe input capacitance can alter the measured circuit and edge response."
      }
    ]
  },
  {
    "slug": "expansion-v3-debug-adc-reference",
    "title": "Diagnose an ADC reading half scale",
    "version": 1,
    "signature": "20ac5349",
    "method": "diagnosis",
    "difficulty": "Medium",
    "trace": [
      "A code of 1024 means VIN/VREF lies in the bin starting at 1/4. It does not identify which voltage differs from its intended value.",
      "For example, VIN = 0.512 V with VREF = 2.048 V or VIN = 1.024 V with VREF = 4.096 V both yield 1024.",
      "Measure both voltages at the actual ADC pins to distinguish input-path error from reference error before changing firmware scaling."
    ],
    "formula": "code = floor(4096 VIN/VREF)",
    "inputs": [
      "Expected VIN / VREF: 1.024 V / 2.048 V",
      "Expected / observed code: 2048 / 1024",
      "Unknown: Actual input or reference voltage"
    ],
    "sources": [
      {
        "title": "Analog Devices: Types of ADCs and DACs",
        "url": "https://www.analog.com/en/resources/technical-articles/types-of-adcs-and-dacs.html",
        "supports": "LSB size and converter resolution. Each original code question states its precise floor quantizer convention."
      }
    ]
  },
  {
    "slug": "expansion-v3-buffered-filter-cascade",
    "title": "Cascade two isolated filter stages",
    "version": 1,
    "signature": "c261ff4a",
    "method": "filter",
    "difficulty": "Medium",
    "trace": [
      "Each stage has H = 1/(1+j) at the stated frequency.",
      "Htotal = [1/(1+j)]² = −j/2, whose magnitude is 0.5 V/V and phase is −90°.",
      "Without the buffer, loading would change this result; multiplying unloaded stage responses would then be invalid."
    ],
    "formula": "|Htotal| = |H1||H2|",
    "inputs": [
      "Each stage R / C: 1 kΩ / 100 nF",
      "Between stages: Ideal unity-gain buffer",
      "Frequency: Common corner frequency"
    ],
    "sources": [
      {
        "title": "Analog Devices: An Introduction to Electrical Filters",
        "url": "https://wiki.analog.com/university/courses/engineering_discovery/lab_5",
        "supports": "RC frequency response and corner behavior. The cascade uses ideal buffering so unloaded stage responses multiply."
      }
    ]
  },
  {
    "slug": "expansion-v4-delta-to-star-resistor",
    "title": "Replace a delta without changing its ports",
    "version": 1,
    "signature": "00651e46",
    "method": "node",
    "difficulty": "Easy",
    "trace": [
      "The delta sum is 6 + 9 + 3 = 18 kΩ.",
      "The star arm at A uses the two delta resistors incident on A: RA = (6 × 3)/18 = 1 kΩ.",
      "Check the three pair resistances: RA + RB = 4 kΩ, RA + RC = 2.5 kΩ, and RB + RC = 6 kΩ. These match the original delta with the unused terminal open."
    ],
    "formula": "RA = RAB × RCA/(RAB + RBC + RCA)",
    "inputs": [
      "RAB: 6 kΩ",
      "RBC: 9 kΩ",
      "RCA: 3 kΩ"
    ],
    "sources": [
      {
        "title": "UCSB ECE 10A Lecture 13: Delta-to-Wye Transformation",
        "url": "https://web.ece.ucsb.edu/~parhami/pres_folder/10A_lecture13_notes.pdf",
        "supports": "Three-terminal resistor equivalence. The authored test obtains the star arms from three independently reduced terminal-pair resistances."
      }
    ]
  },
  {
    "slug": "expansion-v4-series-rlc-damping-class",
    "title": "Will this source-free loop ring?",
    "version": 1,
    "signature": "c00b4922",
    "method": "secondOrder",
    "difficulty": "Easy",
    "trace": [
      "The capacitor equation is LC vC″ + RC vC′ + vC = 0.",
      "α = 400/(2 × 0.010) = 20,000 s⁻¹, while ω0 = 1/√(0.010 × 10⁻⁶) = 10,000 rad/s.",
      "Because α > ω0, the poles −α ± √(α² − ω0²) are distinct negative real numbers. The loop is overdamped; the natural modes do not oscillate."
    ],
    "formula": "s² + (R/L)s + 1/(LC) = 0",
    "inputs": [
      "R: 400 Ω",
      "L: 10 mH",
      "C: 1 μF",
      "Initial state: vC = 2 V; iL = 0 A"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: RLC Series Circuits",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/14-6-rlc-series-circuits",
        "supports": "The natural series-loop differential equation and its damping classes. The test forms the characteristic discriminant directly from L, R and C and verifies negative real roots."
      }
    ]
  },
  {
    "slug": "expansion-v4-floating-supernode-source-current",
    "title": "Recover the hidden source current",
    "version": 1,
    "signature": "57d14ac7",
    "method": "supernode",
    "difficulty": "Medium",
    "trace": [
      "Supernode KCL is (VA − 6)/2 kΩ + VA/6 kΩ + VB/3 kΩ = 2 mA.",
      "Substitute VB = VA − 3. The combined conductance is 1 mS, giving VA = 6 V and VB = 3 V.",
      "At A, IAB = (6 − VA)/2 kΩ − VA/6 kΩ = −1 mA.",
      "The negative sign means the floating source actually carries 1 mA from B toward A; B receives 2 mA, sends 1 mA to ground, and sends 1 mA to A."
    ],
    "formula": "Σ Isupernode,out = 0; VA − VB = 3 V",
    "inputs": [
      "S: +6 V",
      "R from S to A: 2 kΩ",
      "R from A to ground: 6 kΩ",
      "R from B to ground: 3 kΩ",
      "Floating source: VA − VB = 3 V",
      "Injection into B: 2 mA"
    ],
    "sources": [
      {
        "title": "MIT 6.002 Lecture 2: Basic Circuit Analysis Method",
        "url": "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/resources/lecture-2/",
        "supports": "KCL and KVL for the original floating-source supernode and the controlled test port. The test verifies each branch equation and the chosen source-current sign separately."
      }
    ]
  },
  {
    "slug": "expansion-v4-active-test-port-negative-resistance",
    "title": "A test port can deliver current back",
    "version": 1,
    "signature": "e364f9b7",
    "method": "port",
    "difficulty": "Medium",
    "trace": [
      "The resistor to X carries (VP − VX)/2 kΩ = −2VP/2 kΩ.",
      "The grounded resistor carries VP/4 kΩ. Therefore Itest = −(0.75 mS)VP.",
      "RP = 1/(−0.75 mS) = −1.333333 kΩ.",
      "This negative port resistance is possible because the ideal dependent source supplies energy; the internal passive resistors do not make the whole network passive."
    ],
    "formula": "Itest = VP/4 kΩ + (VP − 3VP)/2 kΩ",
    "inputs": [
      "P-to-ground resistor: 4 kΩ",
      "P-to-X resistor: 2 kΩ",
      "Dependent voltage: VX = 3VP"
    ],
    "sources": [
      {
        "title": "MIT 6.002 Lecture 2: Basic Circuit Analysis Method",
        "url": "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/resources/lecture-2/",
        "supports": "KCL and KVL for the original floating-source supernode and the controlled test port. The test verifies each branch equation and the chosen source-current sign separately."
      }
    ]
  },
  {
    "slug": "expansion-v4-series-resonator-q-bandwidth",
    "title": "Describe how sharp the resonance is",
    "version": 1,
    "signature": "568de5af",
    "method": "secondOrder",
    "difficulty": "Medium",
    "trace": [
      "ω0 = 1/√(LC) = 10,000 rad/s.",
      "Q = ω0L/R = 10,000 × 0.010/20 = 5.",
      "At half power, |ωL − 1/(ωC)| = R. The positive roots differ by Δω = R/L = 2,000 rad/s.",
      "Δf = Δω/(2π) = 318.309886 Hz. This is the exact resistor-power bandwidth, with no high-Q approximation needed."
    ],
    "formula": "Q = ω0L/R; Δf = R/(2πL)",
    "inputs": [
      "R: 20 Ω",
      "L: 10 mH",
      "C: 1 μF"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: Resonance in an AC Circuit",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/15-5-resonance-in-an-ac-circuit",
        "supports": "Series resonance, quality factor and resistor-power half-power edges. The tests find both edge frequencies by numerical impedance searches, rather than reproducing the stored closed-form roots."
      }
    ]
  },
  {
    "slug": "expansion-v4-power-factor-correction-capacitor",
    "title": "Cancel the lagging current at the source",
    "version": 1,
    "signature": "6f81f99c",
    "method": "phasor",
    "difficulty": "Medium",
    "trace": [
      "The load current magnitude is P/(V × PF) = 1,000/(100 × 0.80) = 12.5 A. Its in-phase component is P/V = 10 A.",
      "The lagging quadrature current is √(12.5² − 10²) = 7.5 A.",
      "Require capacitor current ωCV = 7.5 A, with ω = 2π × 50 rad/s.",
      "C = 7.5/(2π × 50 × 100) = 238.732415 μF. The remaining source current is 10 A in phase."
    ],
    "formula": "C = P tan(arccos(PF))/(2πf VRMS²)",
    "inputs": [
      "Supply: 100 V RMS at 50 Hz",
      "Load real power: 1,000 W",
      "Load power factor: 0.80 lagging"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: Power in an AC Circuit",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/15-4-power-in-an-ac-circuit",
        "supports": "RMS real power and power-factor components. Independent checks cancel quadrature load current with capacitor susceptance and numerically optimize the resistor-only load under a fixed complex source impedance."
      }
    ]
  },
  {
    "slug": "expansion-v4-series-rlc-half-power-frequencies",
    "title": "Find both edges of a broad resonance",
    "version": 1,
    "signature": "960d954d",
    "method": "secondOrder",
    "difficulty": "Hard",
    "trace": [
      "With P = VRMS²R/[R² + (ωL − 1/(ωC))²], the half-power condition is |ωL − 1/(ωC)| = R.",
      "The roots are ωL = [−R + √(R² + 4L/C)]/(2L) and ωH = [R + √(R² + 4L/C)]/(2L).",
      "For the stated values, fL = 983.631643 Hz and fH = 2,575.181074 Hz.",
      "Their product satisfies ωLωH = 1/(LC), so the geometric mean is f0 = 1/(2π√(LC)) = 1,591.549431 Hz. The arithmetic midpoint is different."
    ],
    "formula": "|ωL − 1/(ωC)| = R; √(fL fH) = f0",
    "inputs": [
      "R: 100 Ω",
      "L: 10 mH",
      "C: 1 μF",
      "Source amplitude: Constant RMS value"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: Resonance in an AC Circuit",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/15-5-resonance-in-an-ac-circuit",
        "supports": "Series resonance, quality factor and resistor-power half-power edges. The tests find both edge frequencies by numerical impedance searches, rather than reproducing the stored closed-form roots."
      }
    ]
  },
  {
    "slug": "expansion-v4-ac-resistor-only-power-match",
    "title": "Match a load when reactance is forbidden",
    "version": 1,
    "signature": "b2b89d21",
    "method": "power",
    "difficulty": "Hard",
    "trace": [
      "Differentiate P(RL). Its derivative changes sign where RL² = 30² + 40², giving RL = 50 Ω.",
      "At that resistor, |Ztotal|² = 80² + 40² = 8,000 Ω². Hence P = 100 × 50/8,000 = 0.625 W.",
      "For the hypothetical complex load, ZL = 30 − j40 Ω. The total impedance is then 60 Ω.",
      "Its real load power is 100 × 30/60² = 0.833333 W. A real 30 Ω load would not achieve this because the +j40 Ω remains."
    ],
    "formula": "RL,opt = |ZTH|; Pconjugate = |VTH|²/(4 Re(ZTH))",
    "inputs": [
      "Thévenin voltage: 10 V RMS",
      "Thévenin impedance: 30 + j40 Ω",
      "Actual load: A single real resistor RL > 0"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: Power in an AC Circuit",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/15-4-power-in-an-ac-circuit",
        "supports": "RMS real power and power-factor components. Independent checks cancel quadrature load current with capacitor susceptance and numerically optimize the resistor-only load under a fixed complex source impedance."
      }
    ]
  },
  {
    "slug": "expansion-v4-current-driven-capacitor-ramp",
    "title": "Charge at a constant slope",
    "version": 1,
    "signature": "9f7e783a",
    "method": "integration",
    "difficulty": "Easy",
    "trace": [
      "The positive slope is I/C = 200 μA/1 μF = 200 V/s.",
      "Thus vC(t) = 0.50 + 200t V for t in seconds. At 6 ms it is 1.70 V.",
      "To reach 3 V, the required increase is 2.50 V. The elapsed time is 2.50/200 = 12.5 ms."
    ],
    "formula": "vC(t) = vC(0) + It/C",
    "inputs": [
      "C: 1 μF",
      "Initial voltage: +0.50 V",
      "Current into C: 200 μA",
      "Evaluation time: 6 ms"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: RC Circuits",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits",
        "supports": "Capacitor current, voltage continuity and first-order resistor-capacitor dynamics. Each original transient is verified with its own KCL differential equations. The two-node ladder is explicitly unbuffered, and the floating-capacitor state is a plate-voltage difference."
      }
    ]
  },
  {
    "slug": "expansion-v4-capacitor-leakage-limits",
    "title": "A leaky capacitor has a lower target",
    "version": 1,
    "signature": "b1dead48",
    "method": "firstOrder",
    "difficulty": "Easy",
    "trace": [
      "At DC the leakage branch forms a divider: v∞ = 4 × 30/(10 + 30) = 3 V.",
      "The capacitor sees RTH = 10 kΩ ∥ 30 kΩ = 7.5 kΩ when the source is suppressed.",
      "τ = RTH C = 7.5 kΩ × 100 nF = 0.75 ms. Leakage changes both the target voltage and the time constant."
    ],
    "formula": "v∞ = VS RL/(RS + RL); τ = (RS ∥ RL)C",
    "inputs": [
      "Input step: 0 → 4 V",
      "Series resistor: 10 kΩ",
      "Leakage resistor: 30 kΩ",
      "Capacitor: 100 nF"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: RC Circuits",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits",
        "supports": "Capacitor current, voltage continuity and first-order resistor-capacitor dynamics. Each original transient is verified with its own KCL differential equations. The two-node ladder is explicitly unbuffered, and the floating-capacitor state is a plate-voltage difference."
      }
    ]
  },
  {
    "slug": "expansion-v4-switched-loaded-rc-operating-points",
    "title": "Switch both the source and the load",
    "version": 1,
    "signature": "cfef88d3",
    "method": "firstOrder",
    "difficulty": "Medium",
    "trace": [
      "Before switching, the ideal capacitor is open at DC: vC(0−) = 5 × 3/(2 + 3) = 3 V.",
      "No impulse current is allowed, so vC(0+) = 3 V.",
      "The new DC target is 12 × 6/(4 + 6) = 7.2 V.",
      "Suppressing the post-switch source gives RTH = 4 kΩ ∥ 6 kΩ = 2.4 kΩ, so τ = 4.8 ms. The complete response is 7.2 + (3 − 7.2)e^(−t/4.8 ms) V."
    ],
    "formula": "vC(t) = v∞ + [vC(0+) − v∞]e^(−t/τ)",
    "inputs": [
      "Before t = 0: +5 V through 2 kΩ; 3 kΩ to ground",
      "After t = 0: +12 V through 4 kΩ; 6 kΩ to ground",
      "Capacitor: 2 μF; connected continuously"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: RC Circuits",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits",
        "supports": "Capacitor current, voltage continuity and first-order resistor-capacitor dynamics. Each original transient is verified with its own KCL differential equations. The two-node ladder is explicitly unbuffered, and the floating-capacitor state is a plate-voltage difference."
      }
    ]
  },
  {
    "slug": "expansion-v4-loaded-lowpass-amplitude-phase",
    "title": "A resistive load moves the filter response",
    "version": 1,
    "signature": "cb3dad1e",
    "method": "filter",
    "difficulty": "Medium",
    "trace": [
      "KCL gives (VIN − VOUT)/RS = VOUT/RL + jωCVOUT. Therefore H = (RL/(RS + RL))/(1 + jω(RS ∥ RL)C).",
      "The DC factor is 0.5, and the loaded time constant is 1 kΩ × 100 nF = 100 μs.",
      "At 1 kHz, ωτ = 0.628318531. |VOUT| = 1 × 0.5/√(1 + (ωτ)²) = 0.423366508 V RMS.",
      "The phase is −atan(ωτ) = −32.141908°. Using the unloaded pole would give both an incorrect magnitude and an incorrect phase."
    ],
    "formula": "H(jω) = [RL/(RS + RL)]/[1 + jω(RS ∥ RL)C]",
    "inputs": [
      "Input: 1 V RMS ∠0° at 1 kHz",
      "Series resistor: 2 kΩ",
      "Load resistor: 2 kΩ",
      "Capacitor: 100 nF"
    ],
    "sources": [
      {
        "title": "Analog Devices: An Introduction to Electrical Filters",
        "url": "https://wiki.analog.com/university/courses/engineering_discovery/lab_5",
        "supports": "RC complex impedance and amplitude/phase response. The original loaded case uses parallel admittance including the load, and its test independently divides complex impedances."
      }
    ]
  },
  {
    "slug": "expansion-v4-highpass-periodic-baseline",
    "title": "Recover a pulse train baseline",
    "version": 1,
    "signature": "5894eedc",
    "method": "periodic",
    "difficulty": "Medium",
    "trace": [
      "The time constant is 1 ms. Write a = e^(−1) for the high-interval decay and b = e^(−3) for the low-interval decay.",
      "If U is the output just after rising, just after falling it is aU − 6. Just before the next rising it is b(aU − 6).",
      "Periodicity requires U = b(aU − 6) + 6, so U = 6(1 − b)/(1 − ab) = 5.807648 V.",
      "The falling-edge value is aU − 6 = −3.863486 V. It is not the isolated-pulse response from an initially discharged capacitor."
    ],
    "formula": "U = b(aU − 6) + 6; VFALL = aU − 6",
    "inputs": [
      "High interval: +6 V for 1 ms",
      "Low interval: 0 V for 3 ms",
      "R: 10 kΩ",
      "C: 100 nF"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: RC Circuits",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits",
        "supports": "Capacitor current, voltage continuity and first-order resistor-capacitor dynamics. Each original transient is verified with its own KCL differential equations. The two-node ladder is explicitly unbuffered, and the floating-capacitor state is a plate-voltage difference."
      }
    ]
  },
  {
    "slug": "expansion-v4-rc-ramp-input-tracking",
    "title": "Follow a finite input ramp",
    "version": 1,
    "signature": "8cca5ad0",
    "method": "integration",
    "difficulty": "Medium",
    "trace": [
      "τ = 1 ms, and the ramp slope m = 1,000 V/s.",
      "A particular solution is m(t − τ). The initial condition requires the added homogeneous term mτ e^(−t/τ).",
      "VOUT(t) = m[t − τ(1 − e^(−t/τ))] during the ramp.",
      "At 5 ms, VOUT = 5 − (1 − e^(−5)) = 4.006738 V. The capacitor retains this continuous voltage when the ramp changes to a hold."
    ],
    "formula": "VOUT(t) = m[t − τ(1 − e^(−t/τ))]",
    "inputs": [
      "Input during ramp: VIN(t) = (1,000 V/s)t for 0–5 ms",
      "Input afterward: 5 V constant",
      "R: 1 kΩ",
      "C: 1 μF",
      "Initial voltage: 0 V"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: RC Circuits",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits",
        "supports": "Capacitor current, voltage continuity and first-order resistor-capacitor dynamics. Each original transient is verified with its own KCL differential equations. The two-node ladder is explicitly unbuffered, and the floating-capacitor state is a plate-voltage difference."
      }
    ]
  },
  {
    "slug": "expansion-v4-unbuffered-rc-ladder-settling",
    "title": "Two RC sections without a buffer",
    "version": 1,
    "signature": "647b3be7",
    "method": "secondOrder",
    "difficulty": "Hard",
    "trace": [
      "KCL gives RC dVA/dt = VIN − 2VA + VB and RC dVB/dt = VA − VB. Eliminating VA gives (RC)² VB″ + 3RC VB′ + VB = VIN.",
      "For normalized time x = t/(RC), the poles are λs = (−3 + √5)/2 and λf = (−3 − √5)/2. They are not two independent −1 poles.",
      "With VB(0) = 0 and VB′(0) = 0, VB/5 = 1 + [λf e^(λs x) − λs e^(λf x)]/(λs − λf).",
      "At x = 2, VB = 2.277522 V. The dominant time constant is −RC/λs = 2.618034 ms."
    ],
    "formula": "(RC)² VB″ + 3RC VB′ + VB = VIN",
    "inputs": [
      "Input: 0 → 5 V step",
      "R1 and R2: 1 kΩ each",
      "C1 and C2: 1 μF each",
      "Initial state: VA = VB = 0 V",
      "Evaluation time: 2 ms"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: RC Circuits",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits",
        "supports": "Capacitor current, voltage continuity and first-order resistor-capacitor dynamics. Each original transient is verified with its own KCL differential equations. The two-node ladder is explicitly unbuffered, and the floating-capacitor state is a plate-voltage difference."
      }
    ]
  },
  {
    "slug": "expansion-v4-floating-capacitor-reconfiguration",
    "title": "Track both plates of a floating capacitor",
    "version": 1,
    "signature": "a6905477",
    "method": "charge",
    "difficulty": "Hard",
    "trace": [
      "Let v = VA − VB and i flow from the supply through 3 kΩ, the capacitor from A to B, and 6 kΩ to ground. KVL gives i = (12 − v)/9 kΩ and i = C dv/dt.",
      "The final differential voltage is 12 V and τ = (3 + 6) kΩ × 1 μF = 9 ms. Thus v(9 ms) = 12 + (2 − 12)e^(−1) = 8.321206 V.",
      "At that instant i = (12 − v)/9 kΩ = 0.408754934 mA.",
      "VA = 12 − i × 3 kΩ = 10.773735 V and VB = i × 6 kΩ = 2.452530 V. Their difference equals the capacitor state; grounding B by assumption would be incorrect."
    ],
    "formula": "C dv/dt = (12 − v)/(RA + RB); VA = 12 − iRA; VB = iRB",
    "inputs": [
      "C between A and B: 1 μF",
      "Initial difference: VA − VB = +2 V",
      "A path: 3 kΩ to +12 V",
      "B path: 6 kΩ to ground",
      "Evaluation time: 9 ms"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: RC Circuits",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits",
        "supports": "Capacitor current, voltage continuity and first-order resistor-capacitor dynamics. Each original transient is verified with its own KCL differential equations. The two-node ladder is explicitly unbuffered, and the floating-capacitor state is a plate-voltage difference."
      }
    ]
  },
  {
    "slug": "expansion-v4-bjt-pnp-high-side-polarity",
    "title": "Reverse the junction checks for a PNP",
    "version": 1,
    "signature": "c53b918a",
    "method": "bjtBias",
    "difficulty": "Easy",
    "trace": [
      "VEB = 5.0 − 4.3 = 0.70 V, so the emitter-base junction is conducting under the specified model.",
      "The collector is below the base: 2.5 V < 4.3 V. This reverse biases the collector-base junction for a PNP.",
      "The device is forward active. Conventional current enters the emitter and leaves the collector toward the lower-voltage collector supply.",
      "A positive collector current defined into the collector terminal would therefore be negative; the answer describes direction without imposing that alternate sign convention."
    ],
    "formula": "PNP active: VE − VB = VEB(on), VC < VB",
    "inputs": [
      "VE / VB / VC: 5.0 V / 4.3 V / 2.5 V",
      "Conducting VEB: 0.70 V",
      "Active condition: VC < VB"
    ],
    "sources": [
      {
        "title": "MIT 6.101: Bipolar junction transistors and base current",
        "url": "https://web.mit.edu/6.101/www/s2020/handouts/L03_4.pdf",
        "supports": "Primary course reference for NPN/PNP current direction, finite-beta terminal current relationships, and divider loading."
      }
    ]
  },
  {
    "slug": "expansion-v4-bjt-shared-base-bus-kcl",
    "title": "One driver feeds two bases and a shunt",
    "version": 1,
    "signature": "9348a4c5",
    "method": "bjtSwitch",
    "difficulty": "Easy",
    "trace": [
      "Q1 draws IB1 = 1.00 mA/50 = 20 µA.",
      "Q2 draws IB2 = 2.00 mA/100 = 20 µA.",
      "The shunt draws 0.70 V/10 kΩ = 70 µA.",
      "KCL at the base bus requires 20 + 20 + 70 = 110 µA from the driver. Collector currents come from the separate collector supplies."
    ],
    "formula": "Idriver = IC1/β1 + IC2/β2 + VB/Rshunt",
    "inputs": [
      "Base-bus voltage: 0.70 V",
      "IC1 / β1: 1.00 mA / 50",
      "IC2 / β2: 2.00 mA / 100",
      "Shunt resistance: 10 kΩ"
    ],
    "sources": [
      {
        "title": "MIT 6.101: Bipolar junction transistors and base current",
        "url": "https://web.mit.edu/6.101/www/s2020/handouts/L03_4.pdf",
        "supports": "Primary course reference for NPN/PNP current direction, finite-beta terminal current relationships, and divider loading."
      }
    ]
  },
  {
    "slug": "expansion-v4-bjt-loaded-divider-bias",
    "title": "A bias divider sags under base current",
    "version": 1,
    "signature": "788ae07a",
    "method": "bjtBias",
    "difficulty": "Medium",
    "trace": [
      "The unloaded base network has VTH = 12(20)/(60 + 20) = 3 V and RTH = 60∥20 = 15 kΩ.",
      "KVL gives 3 = IB(15 kΩ) + 0.70 + (100IB)(1 kΩ), so IB = 20 µA.",
      "IC = 99IB = 1.98 mA; IE = 2.00 mA. Thus VE = 2.00 V and VB = 2.70 V.",
      "VC = 12 − (1.98 mA)(2 kΩ) = 8.04 V. Since 8.04 > 2.70, the forward-active assumption is consistent."
    ],
    "formula": "IB = (VTH − VBE)/(RTH + (β + 1)RE)",
    "inputs": [
      "VCC: 12 V",
      "R1 / R2: 60 kΩ / 20 kΩ",
      "RC / RE: 2 kΩ / 1 kΩ",
      "β / VBE: 99 / 0.70 V"
    ],
    "sources": [
      {
        "title": "MIT 6.101: Bipolar junction transistors and base current",
        "url": "https://web.mit.edu/6.101/www/s2020/handouts/L03_4.pdf",
        "supports": "Primary course reference for NPN/PNP current direction, finite-beta terminal current relationships, and divider loading."
      },
      {
        "title": "MIT 6.071: Bipolar junction transistor circuits",
        "url": "https://ocw.mit.edu/courses/6-071j-introduction-to-electronics-signals-and-measurement-spring-2006/50a8dea3a2f850d40c9333fefa2db6f1_20_bjt_2.pdf",
        "supports": "Primary derivation of finite-beta emitter feedback and the loaded Thevenin bias loop; junction-bias criteria for active operation."
      }
    ]
  },
  {
    "slug": "expansion-v4-bjt-follower-cutoff-headroom",
    "title": "A follower has two large-signal boundaries",
    "version": 1,
    "signature": "7266e3f0",
    "method": "followerLimits",
    "difficulty": "Medium",
    "trace": [
      "At VB = 0.40 V the transistor is off. With no emitter current, RE has no voltage drop and VE = 0 V.",
      "At VB = 2.00 V the follower conducts with VE = 2.00 − 0.70 = 1.30 V. The collector remains above the base.",
      "The upper active boundary occurs at VB = VC = 5.00 V, not at a fixed 0.2 V collector-emitter voltage.",
      "At that boundary VE = 5.00 − 0.70 = 4.30 V. Above it the forward-active model no longer predicts the output."
    ],
    "formula": "VE = 0 when off; VE = VB − VBE while active; VE,upper = VC − VBE",
    "inputs": [
      "Collector supply: 5.0 V",
      "RE: 1 kΩ",
      "Off condition / conducting VBE: VB ≤ 0.70 V / 0.70 V",
      "Upper active boundary: VB = VC"
    ],
    "sources": [
      {
        "title": "MIT 6.071: Bipolar junction transistor circuits",
        "url": "https://ocw.mit.edu/courses/6-071j-introduction-to-electronics-signals-and-measurement-spring-2006/50a8dea3a2f850d40c9333fefa2db6f1_20_bjt_2.pdf",
        "supports": "Primary derivation of finite-beta emitter feedback and the loaded Thevenin bias loop; junction-bias criteria for active operation."
      },
      {
        "title": "MIT Electronic Feedback Systems: Output amplifiers",
        "url": "https://ocw.mit.edu/courses/res-6-010-electronic-feedback-systems-spring-2013/ef9754487867fe8ef29499bb97a8b375_MITRES_6-010S13_chap08.pdf",
        "supports": "Primary discussion of emitter-follower limitations and emitter-resistor bias stabilization. Temperature slope and constant beta are explicitly supplied hypothetical assumptions."
      }
    ]
  },
  {
    "slug": "expansion-v4-bjt-darlington-exact-current",
    "title": "Keep both collector currents in a Darlington",
    "version": 1,
    "signature": "4f4d043c",
    "method": "bjtCurrent",
    "difficulty": "Medium",
    "trace": [
      "Q1 draws IC1 = 50(2 µA) = 100 µA and has IE1 = 102 µA.",
      "All of IE1 enters Q2 base, so IC2 = 80(102 µA) = 8.16 mA.",
      "The collector rail supplies IC1 + IC2 = 0.10 + 8.16 = 8.26 mA. Equivalently the composite gain for this rail current is β1 + β2(β1 + 1).",
      "Q2 base is at 0.70 V and Q1 base is at 1.40 V, both below their 9 V collectors. The assumed forward-active operation is consistent."
    ],
    "formula": "Irail = [β1 + β2(β1 + 1)]IB1",
    "inputs": [
      "IB1: 2.00 µA",
      "β1 / β2: 50 / 80",
      "Collector rail: 9 V",
      "Both VBE: 0.70 V"
    ],
    "sources": [
      {
        "title": "MIT 6.101: Bipolar junction transistors and base current",
        "url": "https://web.mit.edu/6.101/www/s2020/handouts/L03_4.pdf",
        "supports": "Primary course reference for NPN/PNP current direction, finite-beta terminal current relationships, and divider loading."
      },
      {
        "title": "onsemi: KSD560 Darlington equivalent connection",
        "url": "https://www.onsemi.com/download/data-sheet/pdf/ksd560-d.pdf",
        "supports": "Vendor schematic shows the Darlington connection. The authored exercise explicitly excludes the vendor part's internal shunt resistors and diode, and does not use its measured gain or voltages."
      }
    ]
  },
  {
    "slug": "expansion-v4-bjt-temperature-emitter-feedback",
    "title": "Emitter feedback limits a specified temperature drift",
    "version": 1,
    "signature": "918e7c46",
    "method": "temperature",
    "difficulty": "Medium",
    "trace": [
      "The base-loop relation is IB = (2.80 − VBE)/[10 kΩ + 100(1 kΩ)]. The effective resistance is 110 kΩ.",
      "The supplied model changes VBE from 0.70 V to 0.60 V, increasing the base-loop driving voltage by 0.10 V.",
      "Thus ΔIB = 0.10 V/110 kΩ = 0.909091 µA, and ΔIC = 99ΔIB = 90 µA = 0.090 mA.",
      "At 75 °C the emitter is 2.00 V and the base is 2.60 V, still below the 8 V collector. The model remains forward active."
    ],
    "formula": "ΔIC = −β ΔVBE/[RB + (β + 1)RE]",
    "inputs": [
      "Base source / RB / RE: 2.80 V / 10 kΩ / 1 kΩ",
      "Collector voltage: 8 V",
      "β: 99, constant",
      "VBE at 25 °C / slope: 0.70 V / −2 mV per °C",
      "Temperature change: 25 °C to 75 °C"
    ],
    "sources": [
      {
        "title": "MIT 6.071: Bipolar junction transistor circuits",
        "url": "https://ocw.mit.edu/courses/6-071j-introduction-to-electronics-signals-and-measurement-spring-2006/50a8dea3a2f850d40c9333fefa2db6f1_20_bjt_2.pdf",
        "supports": "Primary derivation of finite-beta emitter feedback and the loaded Thevenin bias loop; junction-bias criteria for active operation."
      },
      {
        "title": "MIT Electronic Feedback Systems: Output amplifiers",
        "url": "https://ocw.mit.edu/courses/res-6-010-electronic-feedback-systems-spring-2013/ef9754487867fe8ef29499bb97a8b375_MITRES_6-010S13_chap08.pdf",
        "supports": "Primary discussion of emitter-follower limitations and emitter-resistor bias stabilization. Temperature slope and constant beta are explicitly supplied hypothetical assumptions."
      }
    ]
  },
  {
    "slug": "expansion-v4-bjt-collector-feedback-kcl",
    "title": "The collector resistor supplies its own bias path",
    "version": 1,
    "signature": "ad60130b",
    "method": "bjtBias",
    "difficulty": "Hard",
    "trace": [
      "At the collector, IRC = IC + IB = 100IB. RB current is the same IB that enters the transistor base.",
      "The loop gives 12 − 0.70 = IB[100 kΩ + 100(2 kΩ)], so IB = 37.666667 µA.",
      "IC = 99IB = 3.729 mA and IRC = 100IB = 3.766667 mA.",
      "VC = 12 − (3.766667 mA)(2 kΩ) = 4.466667 V. Because VC > VB = 0.70 V, the active solution is valid."
    ],
    "formula": "IB = (VCC − VBE)/[RB + (β + 1)RC]",
    "inputs": [
      "VCC: 12 V",
      "RC / RB: 2 kΩ / 100 kΩ",
      "β / VBE: 99 / 0.70 V",
      "Bias path: Collector → RB → base"
    ],
    "sources": [
      {
        "title": "MIT 6.071: Bipolar junction transistor circuits",
        "url": "https://ocw.mit.edu/courses/6-071j-introduction-to-electronics-signals-and-measurement-spring-2006/50a8dea3a2f850d40c9333fefa2db6f1_20_bjt_2.pdf",
        "supports": "Primary derivation of finite-beta emitter feedback and the loaded Thevenin bias loop; junction-bias criteria for active operation."
      }
    ]
  },
  {
    "slug": "expansion-v4-bjt-finite-beta-tail-steering",
    "title": "A tail sink includes both base currents",
    "version": 1,
    "signature": "a88e84a0",
    "method": "differential",
    "difficulty": "Hard",
    "trace": [
      "Equal IS gives IC1/IC2 = exp[ln(2)] = 2. Let IC2 = I.",
      "Tail KCL is 3.05 mA = 2I(1 + 1/50) + I(1 + 1/100) = 3.05I, with I expressed in mA.",
      "Therefore IC2 = 1.00 mA and IC1 = 2.00 mA. Their base currents are 40 µA and 10 µA.",
      "The 3.00 mA collector-current sum plus the 0.050 mA base-current sum equals the 3.05 mA emitter tail current."
    ],
    "formula": "IT = IC1(1 + 1/β1) + IC2(1 + 1/β2)",
    "inputs": [
      "Tail emitter current: 3.05 mA",
      "VB1 − VB2 / VT: (25 mV) ln(2) / 25 mV",
      "β1 / β2: 50 / 100",
      "Both collectors: 5 V"
    ],
    "sources": [
      {
        "title": "MIT 6.012: Differential amplifiers, large-signal behavior",
        "url": "https://web.mit.edu/6.012/SPR01/lecture26.pdf",
        "supports": "Primary exponential BJT current ratios and square-law MOS differential current steering. The new BJT problem adds independently derived finite-beta emitter-tail KCL."
      }
    ]
  },
  {
    "slug": "expansion-v4-mos-negative-rail-pmos-reference",
    "title": "A negative gate voltage does not guarantee PMOS turn-on",
    "version": 1,
    "signature": "d2cf4646",
    "method": "mosBias",
    "difficulty": "Easy",
    "trace": [
      "VSG = −2.0 − (−1.0) = −1.0 V.",
      "The PMOS requires a positive source-to-gate voltage above 0.6 V to conduct under the specified ideal model.",
      "Since −1.0 V is below that threshold magnitude, the channel is in cutoff. A gate at −1 V is actually above this source."
    ],
    "formula": "VSG = VS − VG; PMOS on only if VSG > |VTP|",
    "inputs": [
      "VS / VG / VD: −2.0 V / −1.0 V / −3.0 V",
      "VTP: −0.6 V",
      "Body connection: Body tied to source"
    ],
    "sources": [
      {
        "title": "MIT 6.012: MOSFET large-signal models",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/33eea31f564b67fc47cd9c2796500669_MIT6_012F09_lec11.pdf",
        "supports": "Primary voltage references, threshold, saturation/triode equations and region checks. Each exercise explicitly declares the k/2 convention and body connection."
      }
    ]
  },
  {
    "slug": "expansion-v4-mos-gate-drive-supply-power",
    "title": "Gate charge costs energy every cycle",
    "version": 1,
    "signature": "c937771f",
    "method": "gateDrive",
    "difficulty": "Easy",
    "trace": [
      "One cycle draws supply energy E = VDRV QG = (5 V)(20 nC) = 100 nJ.",
      "At 100 kHz the average supply current is 20 nC × 100,000/s = 2 mA.",
      "Average supply power is 5 V × 2 mA = 10 mW. The dissipative discharge does not refund energy to the supply."
    ],
    "formula": "Pgate,supply = QG VDRV f",
    "inputs": [
      "Driver supply / frequency: 5 V / 100 kHz",
      "Charge from supply per cycle: 20 nC",
      "Discharge: To ground; no energy recovery"
    ],
    "sources": [
      {
        "title": "Texas Instruments: Optimizing MOSFET gate drive amplitude",
        "url": "https://www.ti.com/lit/an/slua341a/slua341a.pdf",
        "supports": "Vendor reference for gate-drive supply charge, drive voltage, frequency, and the distinction between gate drive energy and drain losses. The early-threshold RC problem deliberately excludes the later nonlinear/Miller regime."
      }
    ]
  },
  {
    "slug": "expansion-v4-mos-source-degenerated-gain",
    "title": "An unbypassed source resistor changes transconductance",
    "version": 1,
    "signature": "a2caee6a",
    "method": "mosSignal",
    "difficulty": "Medium",
    "trace": [
      "The DC overdrive is 1.50 − 0.25 − 1.00 = 0.25 V and VDS = 3.25 V, so the specified saturated bias is consistent.",
      "The source voltage is vs = id RS. Thus id = gm(vin − id RS), giving id/vin = gm/(1 + gm RS).",
      "gm RS = 2, so the effective transconductance is 4/3 = 1.333333 mS.",
      "The drain load is 3∥6 = 2 kΩ. Therefore vout/vin = −(1.333333 mS)(2 kΩ) = −2.666667 V/V."
    ],
    "formula": "Gm,eff = gm/(1 + gm RS); Av = −Gm,eff(RD ∥ RL)",
    "inputs": [
      "gm / ro: 4 mS / infinite",
      "RS / RD / load: 500 Ω / 3 kΩ / 6 kΩ",
      "DC VS / VG / VD / VTH: 0.25 / 1.50 / 3.50 / 1.00 V",
      "Body: Tied to source"
    ],
    "sources": [
      {
        "title": "MIT 6.012: MOSFET large-signal models",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/33eea31f564b67fc47cd9c2796500669_MIT6_012F09_lec11.pdf",
        "supports": "Primary voltage references, threshold, saturation/triode equations and region checks. Each exercise explicitly declares the k/2 convention and body connection."
      },
      {
        "title": "MIT 6.012: Other MOSFET amplifier stages",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2005/73e03dc41660c39bc6b15756733187f1_lecture20annotat.pdf",
        "supports": "Primary incremental transconductance and source/drain stage interpretation; source degeneration result is independently derived from KCL using the supplied model."
      }
    ]
  },
  {
    "slug": "expansion-v4-mos-pmos-loaded-triode-balance",
    "title": "A PMOS load line forces the triode branch",
    "version": 1,
    "signature": "d2572e23",
    "method": "mosBias",
    "difficulty": "Medium",
    "trace": [
      "VSG = 1.5 V and overdrive is 1.0 V. A 1 mA saturation trial would require VD = 4 V, outside the physical supply range.",
      "In triode let x = VSD. Current balance is (3 − x)/4 = 2[x − x²/2], giving 4x² − 9x + 3 = 0.",
      "The root x = (9 − √33)/8 ≈ 0.406930 V is physical and below the 1 V overdrive. The other root exceeds the overdrive and must be discarded.",
      "VD = 3 − x ≈ 2.593070 V and Ip = VD/4 kΩ ≈ 0.648268 mA. These satisfy both the resistor load and the PMOS triode model."
    ],
    "formula": "(3 − VSD)/RL = kp[(VSG − |VTP|)VSD − VSD²/2]",
    "inputs": [
      "VS / VG: 3 V / 1.5 V",
      "VTP / kp: −0.5 V / 2 mA/V²",
      "RL to ground: 4 kΩ",
      "Current definition: Ip positive source → drain"
    ],
    "sources": [
      {
        "title": "MIT 6.012: MOSFET large-signal models",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/33eea31f564b67fc47cd9c2796500669_MIT6_012F09_lec11.pdf",
        "supports": "Primary voltage references, threshold, saturation/triode equations and region checks. Each exercise explicitly declares the k/2 convention and body connection."
      }
    ]
  },
  {
    "slug": "expansion-v4-mos-active-load-swing-window",
    "title": "Two current-source compliances limit one output",
    "version": 1,
    "signature": "a5f0faa9",
    "method": "mosBias",
    "difficulty": "Medium",
    "trace": [
      "Both overdrives equal 0.6 V. Both current magnitudes are (5/2)(0.6)² = 0.9 mA, so their currents balance anywhere inside their shared compliance interval.",
      "The NMOS requires VOUT ≥ 0.6 V to remain in saturation.",
      "The PMOS requires 5 − VOUT ≥ 0.6 V, or VOUT ≤ 4.4 V.",
      "The distances from 2.5 V to the two limits are both 1.9 V, so the maximum symmetric peak swing is 1.9 V. This is peak amplitude, not peak-to-peak swing."
    ],
    "formula": "VOV,n ≤ VOUT ≤ VDD − VOV,p; Vpeak = min(VQ − Vmin, Vmax − VQ)",
    "inputs": [
      "NMOS VS / VG / VTN: 0 V / 1.1 V / 0.5 V",
      "PMOS VS / VG / VTP: 5 V / 3.9 V / −0.5 V",
      "Both k: 5 mA/V²",
      "Specified VOUT,Q: 2.5 V"
    ],
    "sources": [
      {
        "title": "MIT 6.012: MOSFET large-signal models",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/33eea31f564b67fc47cd9c2796500669_MIT6_012F09_lec11.pdf",
        "supports": "Primary voltage references, threshold, saturation/triode equations and region checks. Each exercise explicitly declares the k/2 convention and body connection."
      }
    ]
  },
  {
    "slug": "expansion-v4-mos-gate-rc-threshold-time",
    "title": "Reach threshold before the Miller interval",
    "version": 1,
    "signature": "359a3bf1",
    "method": "gateDrive",
    "difficulty": "Medium",
    "trace": [
      "The time constant is τ = (100 Ω)(2 nF) = 0.20 µs.",
      "Before threshold, VGS(t) = 5[1 − exp(−t/τ)] V.",
      "Setting VGS = 2 V gives exp(−t/τ) = 3/5, so t = −0.20 ln(3/5) ≈ 0.102165 µs.",
      "Threshold crossing marks the limit of the stated constant-capacitance model; a subsequent Miller interval is excluded."
    ],
    "formula": "tTH = −RGC ln(1 − VTH/VDRV)",
    "inputs": [
      "Driver step: 0 V → 5 V",
      "Total gate resistance: 100 Ω",
      "Gate capacitance: 2 nF, constant",
      "Initial gate / VTH: 0 V / 2 V"
    ],
    "sources": [
      {
        "title": "Texas Instruments: Optimizing MOSFET gate drive amplitude",
        "url": "https://www.ti.com/lit/an/slua341a/slua341a.pdf",
        "supports": "Vendor reference for gate-drive supply charge, drive voltage, frequency, and the distinction between gate drive energy and drain losses. The early-threshold RC problem deliberately excludes the later nonlinear/Miller regime."
      }
    ]
  },
  {
    "slug": "expansion-v4-mos-source-bias-triode-root",
    "title": "A source-bias quadratic has only one physical root",
    "version": 1,
    "signature": "e65f3e42",
    "method": "mosBias",
    "difficulty": "Hard",
    "trace": [
      "For the allowed range, VDS = 1 − VS while overdrive is 1.5 − VS. VDS is always smaller, so the conducting physical solution must be in triode.",
      "Write i = ID in mA, so VS = i V. Substitution gives i = 2[(1.5 − i)(1 − i) − (1 − i)²/2] = 2 − 3i + i².",
      "Hence i² − 4i + 2 = 0, with roots 2 ± √2. Only 2 − √2 ≈ 0.585786 is within 0–1.",
      "VS ≈ 0.585786 V and VDS ≈ 0.414214 V. The overdrive is approximately 0.914214 V, confirming positive conduction in triode."
    ],
    "formula": "ID RS = VS; ID = k[(VG − VS − VTH)(VD − VS) − (VD − VS)²/2]",
    "inputs": [
      "VG / VD: 2 V / 1 V",
      "RS / VTH: 1 kΩ / 0.5 V",
      "k: 2 mA/V²",
      "Body / source range: Body tied to source / 0 ≤ VS ≤ 1 V"
    ],
    "sources": [
      {
        "title": "MIT 6.012: MOSFET large-signal models",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/33eea31f564b67fc47cd9c2796500669_MIT6_012F09_lec11.pdf",
        "supports": "Primary voltage references, threshold, saturation/triode equations and region checks. Each exercise explicitly declares the k/2 convention and body connection."
      }
    ]
  },
  {
    "slug": "expansion-v4-mos-differential-pair-steering-limit",
    "title": "A square-law pair reaches complete steering",
    "version": 1,
    "signature": "c897b1ec",
    "method": "differential",
    "difficulty": "Hard",
    "trace": [
      "At the onset of M2 cutoff, its VGS equals VTH. M1 then has overdrive vID and must carry 1 mA, so 1 = (2/2)vID² in mA and volts. The positive onset is 1.00 V.",
      "At vID = 0.50 V, a − b = 0.50 V and a² + b² = 1.00 V². Thus a + b = √(2 − 0.50²) = √1.75 V.",
      "The overdrives are a = (√1.75 + 0.50)/2 and b = (√1.75 − 0.50)/2. Their currents are ID1 = a² ≈ 0.830719 mA and ID2 = b² ≈ 0.169281 mA.",
      "The currents sum to 1.00 mA. The common source at this point is about 0.838562 V, leaving each drain far above its saturation boundary."
    ],
    "formula": "vID,cutoff = √(2IT/k); ID1,2 = IT/2 ± (k vID/4)√(4IT/k − vID²)",
    "inputs": [
      "Tail current: 1.00 mA",
      "VG1 / VG2: 2.00 V + vID/2 / 2.00 V − vID/2",
      "VTH / k per device: 0.50 V / 2 mA/V²",
      "Both drain voltages: 5 V"
    ],
    "sources": [
      {
        "title": "MIT 6.012: Differential amplifiers, large-signal behavior",
        "url": "https://web.mit.edu/6.012/SPR01/lecture26.pdf",
        "supports": "Primary exponential BJT current ratios and square-law MOS differential current steering. The new BJT problem adds independently derived finite-beta emitter-tail KCL."
      },
      {
        "title": "MIT 6.012: MOSFET large-signal models",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/33eea31f564b67fc47cd9c2796500669_MIT6_012F09_lec11.pdf",
        "supports": "Primary voltage references, threshold, saturation/triode equations and region checks. Each exercise explicitly declares the k/2 convention and body connection."
      }
    ]
  },
  {
    "slug": "expansion-v4-unsigned-saturation-versus-wrap",
    "title": "Choose clipping instead of wrapping",
    "version": 1,
    "signature": "ade0a602",
    "method": "arithmetic",
    "difficulty": "Easy",
    "trace": [
      "The exact integer sum is 27 + 11 = 38.",
      "Five bits encode unsigned values 0 through 31, so the sum cannot be stored exactly.",
      "WRAP discards the sixth bit: 38 modulo 32 = 6. SAT instead stores the upper limit, 31.",
      "The policies intentionally differ; detecting carry does not by itself decide which output behavior the datapath should implement."
    ],
    "formula": "WRAP = (A + B) mod 2^N; SAT = min(A + B, 2^N − 1)",
    "inputs": [
      "Input width: 5 bits, unsigned",
      "A; B: 27; 11",
      "WRAP policy: Retain the low 5 sum bits",
      "SAT policy: Clip above the maximum representable unsigned value"
    ],
    "sources": [
      {
        "title": "Cornell CS 3410: Numbers and Arithmetic",
        "url": "https://www.cs.cornell.edu/courses/cs3410/2025sp/lectures/02-nums-arith.pdf",
        "supports": "Fixed-width unsigned and two's-complement integer representations and signed overflow. The saturation policies are explicitly defined in the original prompts and tested by clipping the exact integer sums rather than by trusting a sign/carry heuristic."
      }
    ]
  },
  {
    "slug": "expansion-v4-signed-ordering-reinterpretation",
    "title": "The same bits, two comparison results",
    "version": 1,
    "signature": "fd26996b",
    "method": "arithmetic",
    "difficulty": "Easy",
    "trace": [
      "Unsigned A is 16 + 2 = 18 and unsigned B is 8 + 4 + 2 + 1 = 15, so A > B is true.",
      "Signed A is −16 + 2 = −14. Signed B remains +15 because its sign bit is zero.",
      "The signed comparison −14 > 15 is false, giving the pair (1, 0).",
      "The bit storage is identical in both comparisons; only the numerical interpretation changes."
    ],
    "formula": "Five-bit signed value = −16·b4 + 8·b3 + 4·b2 + 2·b1 + b0",
    "inputs": [
      "Pattern A: 10010₂, 5 bits",
      "Pattern B: 01111₂, 5 bits",
      "First interpretation: Both unsigned",
      "Second interpretation: Both five-bit two’s complement"
    ],
    "sources": [
      {
        "title": "Cornell CS 3410: Numbers and Arithmetic",
        "url": "https://www.cs.cornell.edu/courses/cs3410/2025sp/lectures/02-nums-arith.pdf",
        "supports": "Fixed-width unsigned and two's-complement integer representations and signed overflow. The saturation policies are explicitly defined in the original prompts and tested by clipping the exact integer sums rather than by trusting a sign/carry heuristic."
      }
    ]
  },
  {
    "slug": "expansion-v4-dac-endpoint-linearity",
    "title": "Measure a DAC step against its endpoints",
    "version": 1,
    "signature": "8b6658bb",
    "method": "adc",
    "difficulty": "Medium",
    "trace": [
      "The measured endpoint span is 2.570 − 0.020 = 2.550 V across 255 steps, giving L = 0.010 V.",
      "The measured 127→128 step is 1.309 − 1.293 = 0.016 V. Its DNL is 0.016/0.010 − 1 = +0.6 LSB.",
      "The endpoint line at code 128 predicts 0.020 + 128 × 0.010 = 1.300 V.",
      "The actual output is 0.009 V above that line, so INL is 0.009/0.010 = +0.9 LSB. A best-fit line or a different LSB convention would answer a different question."
    ],
    "formula": "L = (V255 − V0)/255; DNL128 = ΔV/L − 1; INL128 = [V128 − (V0 + 128L)]/L",
    "inputs": [
      "Resolution: 8 bits; codes 0…255",
      "V(0); V(255): 0.020 V; 2.570 V",
      "V(127); V(128): 1.293 V; 1.309 V",
      "Line fit: Through measured endpoints; remove measured offset"
    ],
    "sources": [
      {
        "title": "Analog Devices: Measuring the Linearity of Differential-Output, Current-Mode DACs",
        "url": "https://www.analog.com/en/resources/technical-articles/2022/07/16/10/09/measuring-the-linearity-of-differentialoutput-currentmode-digitaltoanalog-converters-dacs.html",
        "supports": "Adjacent-code DNL, signed departure from an endpoint reference line, and the endpoint LSB based on 2^N minus 1 intervals. The original question explicitly retains the measured zero-code offset in its INL reference."
      }
    ]
  },
  {
    "slug": "expansion-v4-setup-hold-two-corners",
    "title": "Check setup and hold at different timing corners",
    "version": 1,
    "signature": "ca820033",
    "method": "timing",
    "difficulty": "Hard",
    "trace": [
      "At the setup corner, the next capture clock arrives at 8.00 − 0.20 = 7.80 ns relative to launch. Data is required by 7.80 − 0.25 − 0.20 = 7.35 ns.",
      "Latest data arrives at 0.60 + 6.90 = 7.50 ns, so setup slack is 7.35 − 7.50 = −0.15 ns.",
      "At the hold corner, earliest new data arrives at 0.08 + 0.07 = 0.15 ns. It must not arrive before 0.35 + 0.16 + 0.05 = 0.56 ns.",
      "Hold slack is 0.15 − 0.56 = −0.41 ns. The two failures use separate specified corners; using one skew value for both checks would discard the problem’s corner assumptions."
    ],
    "formula": "Ssetup = T + skewsetup − tCQ,max − tdata,max − tsetup − Usetup; Shold = tCQ,min + tdata,min − skewhold − thold − Uhold",
    "inputs": [
      "Nominal period: 8.00 ns",
      "Setup corner: tCQ,max 0.60; tdata,max 6.90; tsetup 0.25; uncertainty 0.20 ns",
      "Setup skew: Capture − launch = −0.20 ns",
      "Hold corner: tCQ,min 0.08; tdata,min 0.07; thold 0.16; uncertainty 0.05 ns",
      "Hold skew: Capture − launch = +0.35 ns"
    ],
    "sources": [
      {
        "title": "AMD Vivado UG906: Setup/Recovery Relationship",
        "url": "https://docs.amd.com/r/en-US/ug906-vivado-design-analysis/Setup/Recovery-Relationship",
        "supports": "Setup slack is required time minus latest arrival; capture clock delay, setup time, uncertainty, and launch/data delay enter with the stated signs. The critical-path question explicitly supplies sensitizable fixed maximum path delays and requires recomputing the controlling path after a local change."
      },
      {
        "title": "AMD Vivado UG906: Hold/Removal Relationship",
        "url": "https://docs.amd.com/r/en-US/ug906-vivado-design-analysis/Hold/Removal-Relationship",
        "supports": "Hold analysis uses earliest new-data arrival minus the required hold boundary. The problem separates its setup and hold corners and explicitly specifies same-edge hold, skew convention, and uncertainty."
      }
    ]
  },
  {
    "slug": "expansion-v4-multicycle-data-budget",
    "title": "Budget a deliberately three-cycle transfer",
    "version": 1,
    "signature": "d8d32c24",
    "method": "timing",
    "difficulty": "Medium",
    "trace": [
      "The enabled setup capture occurs at 3 × 4.00 + 0.15 = 12.15 ns relative to the launch clock.",
      "Setup and uncertainty require the data to arrive by 12.15 − 0.30 − 0.20 = 11.65 ns.",
      "The source clock-to-Q consumes 0.40 ns, leaving 11.65 − 0.40 = 11.25 ns for the maximum data-path delay.",
      "This budget is valid only for the specified transfer protocol and edge constraints. Merely labeling an ordinary every-cycle path as multicycle does not change the hardware sampling behavior."
    ],
    "formula": "tdata,max ≤ 3T + skew − tCQ,max − tsetup − Usetup",
    "inputs": [
      "Clock period: 4.00 ns",
      "Enabled transfer: Launch nominal 0 ns; capture nominal 12 ns",
      "Capture − launch skew: +0.15 ns",
      "Maximum clock-to-Q: 0.40 ns",
      "Setup; setup uncertainty: 0.30 ns; 0.20 ns"
    ],
    "sources": [
      {
        "title": "AMD Vivado UG906: Setup/Recovery Relationship",
        "url": "https://docs.amd.com/r/en-US/ug906-vivado-design-analysis/Setup/Recovery-Relationship",
        "supports": "Setup slack is required time minus latest arrival; capture clock delay, setup time, uncertainty, and launch/data delay enter with the stated signs. The critical-path question explicitly supplies sensitizable fixed maximum path delays and requires recomputing the controlling path after a local change."
      },
      {
        "title": "AMD Vivado UG835: set_multicycle_path",
        "url": "https://docs.amd.com/r/2023.2-English/ug835-vivado-tcl-commands/set_multicycle_path",
        "supports": "Multicycle setup and hold relationships are separately constrained; extending a setup relationship requires a real transfer-rate/enable justification. The exercise specifies the launch and capture edges directly and does not ask the learner to infer an unspecified SDC hold multiplier."
      }
    ]
  },
  {
    "slug": "expansion-v4-critical-path-migration",
    "title": "A faster branch exposes another bottleneck",
    "version": 1,
    "signature": "3b661e5d",
    "method": "timing",
    "difficulty": "Medium",
    "trace": [
      "Before optimization, the three data arrivals relative to their launch clocks are P = 2.70 ns, Q = 4.00 ns, and R = 4.10 ns.",
      "The longest arrival is 4.10 ns. Adding 0.30 ns setup and 0.10 ns uncertainty gives a minimum period of 4.50 ns.",
      "After optimization, R becomes 0.20 + 2.80 + 0.60 = 3.60 ns. P and Q stay unchanged, so Q now controls the timing.",
      "The new minimum period is 4.00 + 0.30 + 0.10 = 4.40 ns. A 0.50 ns local improvement therefore yields only 0.10 ns clock-period improvement because the critical path moves."
    ],
    "formula": "Tmin = max(tP, tQ, tR) + tsetup + Usetup − skew",
    "inputs": [
      "Path P: 0.40 + 1.70 + 0.60 ns",
      "Path Q: 0.40 + 0.90 + 2.10 + 0.60 ns",
      "Path R: 0.20 + 3.30 + 0.60 ns",
      "Register overhead: Setup 0.30 ns; uncertainty 0.10 ns; skew 0",
      "Optimization: Only D: 3.30 → 2.80 ns"
    ],
    "sources": [
      {
        "title": "AMD Vivado UG906: Setup/Recovery Relationship",
        "url": "https://docs.amd.com/r/en-US/ug906-vivado-design-analysis/Setup/Recovery-Relationship",
        "supports": "Setup slack is required time minus latest arrival; capture clock delay, setup time, uncertainty, and launch/data delay enter with the stated signs. The critical-path question explicitly supplies sensitizable fixed maximum path delays and requires recomputing the controlling path after a local change."
      }
    ]
  },
  {
    "slug": "expansion-v4-masked-arbitration-selection",
    "title": "Mask requests before choosing a winner",
    "version": 1,
    "signature": "569e9cd2",
    "method": "boolean",
    "difficulty": "Medium",
    "trace": [
      "Bitwise masking makes the eligible vector 1110 AND 0111 = 0110.",
      "r3 is requested but disabled. Both r2 and r1 remain eligible.",
      "r2 has priority over r1, so only g2 is asserted and the grant vector is 0100.",
      "Encoding the raw request first and then dropping a masked winner would incorrectly lose the eligible lower-priority requests."
    ],
    "formula": "eligible_i = r_i AND m_i; grant only the highest-priority eligible request",
    "inputs": [
      "Priority: r3 highest; r0 lowest",
      "Requests [r3 r2 r1 r0]: 1110",
      "Masks [m3 m2 m1 m0]: 0111; 1 means eligible if requested",
      "Output: One-hot grant [g3 g2 g1 g0]"
    ],
    "sources": [
      {
        "title": "Cornell ECE 4750: Tutorial 3, Verilog Hardware Description Language",
        "url": "https://web.csl.cornell.edu/courses/ece4750/handouts/ece4750-tut3-verilog.pdf",
        "supports": "One-bit continuous assignments, bitwise/Boolean operators, conditional expressions, signed comparisons with explicit casts, and modeling register next values. Mask priority, gated Gray decode, clipped-result bits, and encoded-state transitions are original, fully specified Boolean functions independently exhausted in the tests."
      }
    ]
  },
  {
    "slug": "expansion-v4-onehot-recovery-output-window",
    "title": "Recovery on an edge does not guard the whole interval",
    "version": 1,
    "signature": "fb1b2e0d",
    "method": "state",
    "difficulty": "Hard",
    "trace": [
      "The stored pattern 1001 is illegal, so next-state logic chooses IDLE = 0001. That does not change the current state register before a clock edge.",
      "Before the edge, state[3] is 1 and the directly wired fire output is therefore 1.",
      "At the next rising edge, the recovery state is loaded. After the register update, state[3] is 0 and fire is 0.",
      "A recovery transition alone does not suppress a dangerous decode between edges. A safety requirement would need additional explicitly verified output gating, encoding, or independent protection."
    ],
    "formula": "Before recovery: output decodes current state; after edge: output decodes recovered state",
    "inputs": [
      "Legal states [3:0]: 0001, 0010, 0100, 1000",
      "Illegal-state transition: Every other pattern → IDLE at the next rising edge",
      "Output: fire = state[3]; combinational, not registered",
      "Faulted pattern between edges: 1001, stable until the next clock"
    ],
    "sources": [
      {
        "title": "AMD Vivado UG912: FSM_SAFE_STATE",
        "url": "https://docs.amd.com/r/2024.2-English/ug912-vivado-properties/FSM_SAFE_STATE",
        "supports": "Invalid-state recovery chooses a known state for the next clock cycle. The original exercise separately specifies an unregistered decode and shows why edge-based recovery alone does not establish an output-safety guarantee for the preceding interval."
      }
    ]
  },
  {
    "slug": "expansion-v4-hdl-gray-middle-bit-valid",
    "title": "Decode a valid Gray-code middle bit",
    "version": 1,
    "signature": "aed070f4",
    "method": "hdlLogic",
    "difficulty": "Easy",
    "trace": [
      "The definition gives b2 = g2.",
      "Because XOR is its own inverse, b1 = b2 XOR g1 = g2 XOR g1.",
      "AND with valid forces the output low when the word is invalid.",
      "The final assignment is valid & (g2 ^ g1). The least-significant Gray bit g0 does not affect this output, including in the full truth table."
    ],
    "formula": "b1 = g2 XOR g1; y = valid AND b1",
    "inputs": [
      "Inputs: valid, g2, g1, g0",
      "Gray word order: g2 is most significant",
      "Output: y = b1 if valid; otherwise 0"
    ],
    "sources": [
      {
        "title": "Cornell ECE 4750: Tutorial 3, Verilog Hardware Description Language",
        "url": "https://web.csl.cornell.edu/courses/ece4750/handouts/ece4750-tut3-verilog.pdf",
        "supports": "One-bit continuous assignments, bitwise/Boolean operators, conditional expressions, signed comparisons with explicit casts, and modeling register next values. Mask priority, gated Gray decode, clipped-result bits, and encoded-state transitions are original, fully specified Boolean functions independently exhausted in the tests."
      }
    ]
  },
  {
    "slug": "expansion-v4-hdl-next-register-clear-enable",
    "title": "Write a register’s next-value input",
    "version": 1,
    "signature": "a200b256",
    "method": "hdlLogic",
    "difficulty": "Easy",
    "trace": [
      "When clear is high, the requested next value is zero for every q, en, and d.",
      "With clear low and enable high, y must equal d.",
      "With both clear and enable low, y must equal current q so the register holds its value at the next edge.",
      "A nested conditional implements the priority directly: clear ? 1'b0 : (en ? d : q). This is a combinational D-input expression, so no clock appears in the submitted assignment."
    ],
    "formula": "y = clear ? 0 : (en ? d : q)",
    "inputs": [
      "Inputs: q (current value), clear, en, d",
      "First priority: clear = 1 → next value 0",
      "Otherwise: en = 1 loads d; en = 0 holds q"
    ],
    "sources": [
      {
        "title": "Cornell ECE 4750: Tutorial 3, Verilog Hardware Description Language",
        "url": "https://web.csl.cornell.edu/courses/ece4750/handouts/ece4750-tut3-verilog.pdf",
        "supports": "One-bit continuous assignments, bitwise/Boolean operators, conditional expressions, signed comparisons with explicit casts, and modeling register next values. Mask priority, gated Gray decode, clipped-result bits, and encoded-state transitions are original, fully specified Boolean functions independently exhausted in the tests."
      }
    ]
  },
  {
    "slug": "expansion-v4-hdl-masked-middle-grant",
    "title": "Grant a masked request below a masked competitor",
    "version": 1,
    "signature": "cf2f2241",
    "method": "hdlLogic",
    "difficulty": "Medium",
    "trace": [
      "Requester me is eligible when r_me & m_me is high.",
      "The higher requester blocks that grant when r_hi & m_hi is high.",
      "Combine enable, my eligibility, and the complement of higher eligibility: en & r_me & m_me & ~(r_hi & m_hi).",
      "For r_hi = 1 and m_hi = 0, the higher requester does not block the lower grant. For en = 0, every input combination yields y = 0."
    ],
    "formula": "grant_me = en · eligible_me · NOT eligible_hi",
    "inputs": [
      "Inputs: en, r_hi, m_hi, r_me, m_me",
      "Priority: hi above me",
      "Mask convention: Mask 1 allows that request",
      "Output: y = grant for requester me only"
    ],
    "sources": [
      {
        "title": "Cornell ECE 4750: Tutorial 3, Verilog Hardware Description Language",
        "url": "https://web.csl.cornell.edu/courses/ece4750/handouts/ece4750-tut3-verilog.pdf",
        "supports": "One-bit continuous assignments, bitwise/Boolean operators, conditional expressions, signed comparisons with explicit casts, and modeling register next values. Mask priority, gated Gray decode, clipped-result bits, and encoded-state transitions are original, fully specified Boolean functions independently exhausted in the tests."
      }
    ]
  },
  {
    "slug": "expansion-v4-hdl-two-bit-signed-overflow",
    "title": "Detect overflow of the exact signed sum",
    "version": 1,
    "signature": "9a2c71e7",
    "method": "hdlLogic",
    "difficulty": "Medium",
    "trace": [
      "For nonnegative inputs, only 1 + 1 = 2 exceeds the upper limit. This requires a1 = b1 = 0 and a0 = b0 = 1.",
      "For two negative inputs, −1 + −1 = −2 fits, while any pair including −2 produces −3 or −4 and overflows.",
      "Two negative inputs therefore overflow when a1 = b1 = 1 and the low bits are not both 1. Opposite-sign inputs always remain in range.",
      "OR the positive and negative conditions to obtain (~a1 & ~b1 & a0 & b0) | (a1 & b1 & ~(a0 & b0)). Every one of the 16 operand pairs is checked."
    ],
    "formula": "Overflow ⇔ exact signed sum < −2 OR exact signed sum > +1",
    "inputs": [
      "Inputs: a1, a0, b1, b0; high bits are sign bits",
      "Operand range: Each is −2…+1",
      "Output: y = 1 iff exact A + B is outside −2…+1"
    ],
    "sources": [
      {
        "title": "Cornell CS 3410: Numbers and Arithmetic",
        "url": "https://www.cs.cornell.edu/courses/cs3410/2025sp/lectures/02-nums-arith.pdf",
        "supports": "Fixed-width unsigned and two's-complement integer representations and signed overflow. The saturation policies are explicitly defined in the original prompts and tested by clipping the exact integer sums rather than by trusting a sign/carry heuristic."
      },
      {
        "title": "Cornell ECE 4750: Tutorial 3, Verilog Hardware Description Language",
        "url": "https://web.csl.cornell.edu/courses/ece4750/handouts/ece4750-tut3-verilog.pdf",
        "supports": "One-bit continuous assignments, bitwise/Boolean operators, conditional expressions, signed comparisons with explicit casts, and modeling register next values. Mask priority, gated Gray decode, clipped-result bits, and encoded-state transitions are original, fully specified Boolean functions independently exhausted in the tests."
      }
    ]
  },
  {
    "slug": "expansion-v4-hdl-saturated-sum-low-bit",
    "title": "Build the low bit of a signed saturating adder",
    "version": 1,
    "signature": "e58d8802",
    "method": "hdlLogic",
    "difficulty": "Medium",
    "trace": [
      "If both sign bits are 1, the exact sum is −4, −3, or −2. Clipping makes every one of these results −2 = 10, whose low bit is 0.",
      "If both sign bits are 0, the operands are 0 or 1. The clipped result is 1 when either low bit is 1, so y = a0 | b0.",
      "If the signs differ, the exact sum fits in −2…+1. Its low encoded bit is a0 ^ b0.",
      "Select among those three cases with nested conditionals. This implements the requested result bit, rather than merely reporting whether clipping occurred."
    ],
    "formula": "z = clip(A + B, −2, +1); y is the low bit of the two-bit encoding of z",
    "inputs": [
      "Input order: a1, a0, b1, b0",
      "Clipping range: −2…+1",
      "Output: y = z0, low bit of clipped two-bit signed result",
      "Overflow encodings: Positive: 01; negative: 10"
    ],
    "sources": [
      {
        "title": "Cornell CS 3410: Numbers and Arithmetic",
        "url": "https://www.cs.cornell.edu/courses/cs3410/2025sp/lectures/02-nums-arith.pdf",
        "supports": "Fixed-width unsigned and two's-complement integer representations and signed overflow. The saturation policies are explicitly defined in the original prompts and tested by clipping the exact integer sums rather than by trusting a sign/carry heuristic."
      },
      {
        "title": "Cornell ECE 4750: Tutorial 3, Verilog Hardware Description Language",
        "url": "https://web.csl.cornell.edu/courses/ece4750/handouts/ece4750-tut3-verilog.pdf",
        "supports": "One-bit continuous assignments, bitwise/Boolean operators, conditional expressions, signed comparisons with explicit casts, and modeling register next values. Mask priority, gated Gray decode, clipped-result bits, and encoded-state transitions are original, fully specified Boolean functions independently exhausted in the tests."
      }
    ]
  },
  {
    "slug": "expansion-v4-hdl-fsm-next-busy-bit",
    "title": "Recover the illegal state while computing the next bit",
    "version": 1,
    "signature": "6c26c9f6",
    "method": "hdlLogic",
    "difficulty": "Hard",
    "trace": [
      "A next BUSY state occurs when the current state is WAIT = 01 and ack is 1. This gives ~s1 & s0 & ack.",
      "It also occurs when the current state is BUSY = 10 and done is 0. This gives s1 & ~s0 & ~done.",
      "OR those cases. IDLE transitions to either 00 or 01, so start never changes next-state bit 1.",
      "The full decodes make both terms false for illegal 11 regardless of start, ack, and done, preserving recovery to 00. All 32 input rows, including every illegal-state row, are checked."
    ],
    "formula": "next[1] = (state = WAIT AND ack) OR (state = BUSY AND NOT done)",
    "inputs": [
      "Input order: s1, s0, start, ack, done",
      "Encoding: IDLE 00; WAIT 01; BUSY 10; illegal 11",
      "Transitions: IDLE/start→WAIT; WAIT/ack→BUSY; BUSY/done→IDLE",
      "Default recovery: 11 → 00 for all inputs"
    ],
    "sources": [
      {
        "title": "Cornell ECE 4750: Tutorial 3, Verilog Hardware Description Language",
        "url": "https://web.csl.cornell.edu/courses/ece4750/handouts/ece4750-tut3-verilog.pdf",
        "supports": "One-bit continuous assignments, bitwise/Boolean operators, conditional expressions, signed comparisons with explicit casts, and modeling register next values. Mask priority, gated Gray decode, clipped-result bits, and encoded-state transitions are original, fully specified Boolean functions independently exhausted in the tests."
      },
      {
        "title": "AMD Vivado UG912: FSM_SAFE_STATE",
        "url": "https://docs.amd.com/r/2024.2-English/ug912-vivado-properties/FSM_SAFE_STATE",
        "supports": "Invalid-state recovery chooses a known state for the next clock cycle. The original exercise separately specifies an unregistered decode and shows why edge-based recovery alone does not establish an output-safety guarantee for the preceding interval."
      }
    ]
  },
  {
    "slug": "expansion-v4-hdl-mixed-signed-comparison",
    "title": "Cast both sides before making a signed comparison",
    "version": 1,
    "signature": "76e2a45d",
    "method": "hdlSigned",
    "difficulty": "Medium",
    "trace": [
      "The uncast comparison has an unsigned operand b, so it performs an unsigned comparison at the larger seven-bit width.",
      "The four-bit pattern a becomes unsigned 0001111 = 15, while b is 3. Thus mixed = (15 < 3) = 0.",
      "$signed(a) is the signed four-bit value −1 and $signed(b) is the signed seven-bit value +3. The shorter signed operand sign-extends for the comparison.",
      "The signed comparison −1 < 3 is true, so signed_pair = 1 and the pair is (0, 1). Casting only one side would not generally make a mixed comparison signed."
    ],
    "formula": "Unsigned relational operand present → unsigned comparison; both signed → signed comparison",
    "inputs": [
      "a: signed [3:0], bits 1111",
      "b: unsigned [6:0], bits 0000011",
      "First expression: a < b",
      "Second expression: $signed(a) < $signed(b)"
    ],
    "sources": [
      {
        "title": "Cornell ECE 4750: Tutorial 3, Verilog Hardware Description Language",
        "url": "https://web.csl.cornell.edu/courses/ece4750/handouts/ece4750-tut3-verilog.pdf",
        "supports": "One-bit continuous assignments, bitwise/Boolean operators, conditional expressions, signed comparisons with explicit casts, and modeling register next values. Mask priority, gated Gray decode, clipped-result bits, and encoded-state transitions are original, fully specified Boolean functions independently exhausted in the tests."
      },
      {
        "title": "LSU EE 4755: Objects and Data Types",
        "url": "https://www.ece.lsu.edu/v/2025/l020-types.v.html",
        "supports": "Declared signedness changes numeric operators without changing stored bit patterns; casts and packed widths determine expression interpretation. The mixed comparison follows SystemVerilog relational width and signedness rules, not C integer-promotion rules."
      }
    ]
  },
  {
    "slug": "expansion-v4-hdl-synchronous-reset-last-update",
    "title": "Read priority and synchronous reset across three events",
    "version": 1,
    "signature": "b66bbafd",
    "method": "hdlEvents",
    "difficulty": "Hard",
    "trace": [
      "At 10 ns, reset is released. The first assignment schedules q ← d = 0; with en high, the later assignment also schedules q ← current q = 1.",
      "The later nonblocking assignment in the same process determines the final update, so q remains 1. In this code enable accidentally selects holding the old value over loading d.",
      "At 14 ns, reset falls but the posedge-clk-only process does not trigger. q therefore remains 1.",
      "At 20 ns the rising edge executes the reset branch and schedules q ← 0. The requested sequence is (1, 1, 0), describing ideal RTL behavior rather than physical reset timing."
    ],
    "formula": "Same-process later nonblocking assignment wins; synchronous reset acts only on the clock event",
    "inputs": [
      "Initial q; d; en: 1; 0; 1",
      "Process event control: posedge clk only",
      "Reset: Active-low, tested inside the clocked process",
      "Timeline: 10 ns rising edge; 14 ns reset falls without clock edge; 20 ns rising edge"
    ],
    "sources": [
      {
        "title": "Clifford E. Cummings: Nonblocking Assignments in Verilog Synthesis, Coding Styles That Kill (MIT-hosted paper)",
        "url": "https://rfsoc.mit.edu/6S965/_static/F24/lectures/CummingsSNUG2000SJ_NBA.pdf",
        "supports": "Nonblocking assignments evaluate right-hand sides before updates; multiple assignments to the same variable in one process execute updates in source order, so the later assignment controls the final value. The edge event control in the original question includes only posedge clk and therefore models synchronous reset."
      }
    ]
  },
  {
    "slug": "expansion-v5-kelvin-shunt-lead-error",
    "title": "Sense inside the current-carrying leads",
    "version": 1,
    "signature": "8886dd04",
    "method": "node",
    "difficulty": "Easy",
    "trace": [
      "The voltage at F+ minus F− includes all three series drops: 4 × (0.005 + 0.020 + 0.005) = 0.120 V.",
      "The two-wire readout divides by 0.020 Ω, so it indicates 6 A even though the forced current is 4 A.",
      "The Kelvin points enclose only the shunt. Their difference is 4 × 0.020 = 0.080 V = 80 mV.",
      "Kelvin sensing removes the force-lead voltage drops in this model; it does not compensate a wrong shunt value or thermal drift."
    ],
    "formula": "Vforce = I(Rlead+ + Rshunt + Rlead−); VKelvin = I Rshunt",
    "inputs": [
      "Forced current: 4 A from F+ to F−",
      "Shunt: 20 mΩ",
      "Each force lead: 5 mΩ",
      "Sense input: Infinite resistance"
    ],
    "sources": [
      {
        "title": "Analog Devices: Measuring very small resistances, a Milliohm-meter",
        "url": "https://wiki.analog.com/university/courses/tutorials/alm-milli-ohm-meter",
        "supports": "Four-wire sense points exclude the force-lead voltage drops when the sense instrument has high input resistance. Original numeric check explicitly includes both force leads in only the two-wire readout."
      }
    ]
  },
  {
    "slug": "expansion-v5-parallel-supply-backfeed",
    "title": "One supply drives current into the other",
    "version": 1,
    "signature": "55aecb38",
    "method": "node",
    "difficulty": "Medium",
    "trace": [
      "KCL at B gives (5.0 − VB)/0.20 + (4.8 − VB)/0.30 = VB/10.",
      "Therefore VB = (5.0/0.20 + 4.8/0.30)/(1/0.20 + 1/0.30 + 1/10) = 4.861660 V.",
      "I1 = (5.0 − VB)/0.20 = 0.691700 A, while I2 = (4.8 − VB)/0.30 = −0.205534 A.",
      "The negative I2 means 0.205534 A enters source 2. The load receives 0.486166 A, equal to the signed sum I1 + I2."
    ],
    "formula": "(V1 − VB)/R1 + (V2 − VB)/R2 = VB/RL",
    "inputs": [
      "Source 1: 5.0 V through 0.20 Ω",
      "Source 2: 4.8 V through 0.30 Ω",
      "Bus load: 10 Ω to ground",
      "Current references: From each source toward B"
    ],
    "sources": [
      {
        "title": "MIT 6.01SC: Circuits",
        "url": "https://ocw.mit.edu/courses/6-01sc-introduction-to-electrical-engineering-and-computer-science-i-spring-2011/pages/unit-3-circuits/circuits/",
        "supports": "KCL and node-voltage analysis. The independently authored source-sharing case uses signed branch currents, exact source models that can absorb power, and a separate power-balance verification."
      }
    ]
  },
  {
    "slug": "expansion-v5-sensor-noise-rss-budget",
    "title": "Add independent noise by power",
    "version": 1,
    "signature": "fe0eebf2",
    "method": "noise",
    "difficulty": "Medium",
    "trace": [
      "The resistor noise power density is 4kBTR = 1.6567788 × 10⁻¹⁶ V²/Hz.",
      "The buffer contributes (10 × 10⁻⁹)² = 1.0000000 × 10⁻¹⁶ V²/Hz. The sources are independent, so these densities add.",
      "The total variance is (2.6567788 × 10⁻¹⁶) × 20,000 = 5.3135576 × 10⁻¹² V².",
      "The total RMS noise is its square root, 2.305116 μV. A real first-order filter would require its equivalent noise bandwidth rather than simply its −3 dB frequency."
    ],
    "formula": "vnoise,RMS = √[(4kBTR + en²) B]",
    "inputs": [
      "Sensor series resistor: 10 kΩ at 300 K",
      "Buffer voltage noise: 10 nV/√Hz, one-sided white density",
      "One-sided noise bandwidth: 20 kHz",
      "Boltzmann constant: 1.380649 × 10⁻²³ J/K"
    ],
    "sources": [
      {
        "title": "Analog Devices: What is the noise performance of digital potentiometers?",
        "url": "https://www.analog.com/en/resources/faqs/faq_what_is_the_noise_perform_of_digital_potentiom.html",
        "supports": "Classical resistor thermal-noise voltage over a specified bandwidth. The original problem specifies exact temperature, resistance, Boltzmann constant, and one-sided brick-wall noise bandwidth."
      },
      {
        "title": "Analog Devices: Ask the Applications Engineer—7, Op-amp Noise",
        "url": "https://www.analog.com/en/resources/analog-dialogue/articles/what-should-i-know-about-opamp-noise.html",
        "supports": "Independent noise sources combine by variance or root-sum-square of RMS contributions; white noise scales with the square root of bandwidth."
      }
    ]
  },
  {
    "slug": "expansion-v5-transmission-line-two-arrivals",
    "title": "Follow the first two reflected arrivals",
    "version": 1,
    "signature": "55a28354",
    "method": "line",
    "difficulty": "Hard",
    "trace": [
      "The launched amplitude is 3 × 100/(50 + 100) = 2 V. The load coefficient is ΓL = (300 − 100)/(300 + 100) = 0.5, and the source coefficient is ΓS = (50 − 100)/(50 + 100) = −1/3.",
      "At T, the incident 2 V wave and its 1 V reflection add at the load, so vL(T+) = 3 V.",
      "The 1 V return reaches the source at 2T and launches a −1/3 V reflected wave. At 3T it changes the load voltage by (−1/3)(1 + 0.5) = −0.5 V, so vL(3T+) = 2.5 V.",
      "In final DC the ideal lossless line adds no series resistance: vL(∞) = 3 × 300/(50 + 300) = 2.571429 V. This also equals the convergent sum of the successive load increments."
    ],
    "formula": "ΓL = (RL − Z0)/(RL + Z0); ΓS = (RS − Z0)/(RS + Z0)",
    "inputs": [
      "Source step: 0 → +3 V at t = 0",
      "Source series resistance: 50 Ω",
      "Line: Z0 = 100 Ω; T = 10 ns, lossless",
      "Far-end load: 300 Ω"
    ],
    "sources": [
      {
        "title": "Texas Instruments AN-905: Transmission Line RAPIDESIGNER Operation and Applications Guide",
        "url": "https://www.ti.com/lit/an/snla035/snla035.pdf",
        "supports": "Source/load voltage reflection coefficients and propagation delay. Original arrival calculations are additionally tested through boundary voltage/current equations and convergence to the separate final DC divider."
      }
    ]
  },
  {
    "slug": "expansion-v5-capacitor-esr-terminal-step",
    "title": "The terminal voltage can jump despite capacitor continuity",
    "version": 1,
    "signature": "ad6af5b9",
    "method": "integration",
    "difficulty": "Easy",
    "trace": [
      "A finite resistor current cannot change the ideal capacitor voltage instantaneously, so VX(0+) = +5 V.",
      "The initial loop current is 5/(2 + 8) = +0.5 A.",
      "The external terminal voltage is the load drop, VP(0+) = 0.5 × 8 = +4 V. The missing 1 V is across the ESR.",
      "The external voltage jumps from 5 V before connection to 4 V after connection. This does not violate continuity of the internal ideal capacitor voltage."
    ],
    "formula": "Iload(0+) = VX(0−)/(RESR + RL); VP(0+) = Iload(0+) RL",
    "inputs": [
      "Ideal capacitor: 100 μF; VX(0−) = +5 V",
      "Series ESR X to P: 2 Ω",
      "Switched load P to ground: 8 Ω",
      "Model: No inductance, source, or leakage"
    ],
    "sources": [
      {
        "title": "Analog Devices AN-1099: Capacitor Selection Guidelines",
        "url": "https://www.analog.com/en/resources/app-notes/an-1099.html",
        "supports": "Equivalent series resistance is distinct from ideal capacitance and affects transient terminal behavior. The exercise explicitly states its resistor-plus-ideal-capacitor model; its first-instant answer follows its own KVL, not a copied part specification."
      },
      {
        "title": "OpenStax University Physics Volume 2: RC Circuits",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits",
        "supports": "First-order capacitor-current and resistor-capacitor dynamics. The ESR problem distinguishes external terminal voltage from internal ideal-capacitor voltage. Recovery from charge injection is checked by integrating the post-event KCL equation."
      }
    ]
  },
  {
    "slug": "expansion-v5-adc-acquisition-source-budget",
    "title": "Set the sampling time before trusting twelve bits",
    "version": 1,
    "signature": "c460b741",
    "method": "firstOrder",
    "difficulty": "Medium",
    "trace": [
      "Require exp[−t/((RS + RON)C)] ≤ 1/2¹³, so the minimum time is (RS + RON)C ln(2¹³).",
      "For the first design, τ = (5 kΩ + 1 kΩ) × 20 pF = 120 ns. Hence tmin = 120 ns × ln(8,192) = 1.081310 μs.",
      "For the second design, RS + RON ≤ 1 μs/[20 pF × ln(8,192)] = 5.548827 kΩ. Subtracting the 1 kΩ switch gives RS,max = 4.548827 kΩ.",
      "The full-scale factor cancels because the allowed error is a fraction of the same range. These results validate the stated first-order model, not every error mechanism of a real ADC."
    ],
    "formula": "tmin = (RS + RON) C ln(2^(N+1)); RS,max = tacq/[C ln(2^(N+1))] − RON",
    "inputs": [
      "ADC resolution and range: 12 bits; 0–3.3 V",
      "Sampling capacitance: 20 pF",
      "On-state switch resistance: 1 kΩ",
      "First design source resistance: 5 kΩ",
      "Initial sampled voltage: 0 V",
      "Second design acquisition time: 1 μs"
    ],
    "sources": [
      {
        "title": "Analog Devices: How to Improve ADC Measurement Accuracy with High-Input Source Impedance",
        "url": "https://www.analog.com/en/resources/technical-articles/how-to-improve-adc-measurement-accuracy-with-highinput-source-impedance.html",
        "supports": "SAR track-and-hold acquisition includes source resistance, switch resistance and sampling capacitance. The original half-LSB requirement is stated explicitly and both budgets are independently found from the settling ODE."
      }
    ]
  },
  {
    "slug": "expansion-v5-charge-injection-recovery",
    "title": "Recover from a known switching charge",
    "version": 1,
    "signature": "fdccf613",
    "method": "firstOrder",
    "difficulty": "Medium",
    "trace": [
      "The impulse deposits Q on the capacitor because the finite resistor transfers no impulse charge. Thus ΔVH = Q/C = 20 pC/10 nF = +2 mV.",
      "Immediately after the event VH is 2.502 V. For t > 0, the resistor drives it back toward 2.5 V.",
      "The recovery time constant is RC = 100 kΩ × 10 nF = 1 ms. The excess error is (2 mV) exp(−t/1 ms).",
      "At 1 ms the remaining signed error is +2/e = +0.735759 mV. A negative injected charge would instead create a negative jump and error in this linear model."
    ],
    "formula": "ΔVH = Q/C; VH(t) − Vref = (Q/C) exp(−t/RC)",
    "inputs": [
      "Reference: +2.5 V through 100 kΩ",
      "Capacitor H to ground: 10 nF",
      "Injected charge at t = 0: +20 pC into H",
      "Evaluation time: 1 ms after injection"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: RC Circuits",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits",
        "supports": "First-order capacitor-current and resistor-capacitor dynamics. The ESR problem distinguishes external terminal voltage from internal ideal-capacitor voltage. Recovery from charge injection is checked by integrating the post-event KCL equation."
      },
      {
        "title": "Analog Devices: Selecting the Right CMOS Analog Switch",
        "url": "https://www.analog.com/en/resources/design-notes/selecting-the-right-cmos-analog-switch.html",
        "supports": "Charge injection produces a voltage change Q/C on a sampling capacitor. The original exercise uses a signed net charge impulse, specifies all connections, and independently integrates the recovery."
      }
    ]
  },
  {
    "slug": "expansion-v5-passive-twin-t-notch",
    "title": "Find the cancellation of two passive T branches",
    "version": 1,
    "signature": "2191911c",
    "method": "filter",
    "difficulty": "Hard",
    "trace": [
      "The midpoint equations are (VA − VIN)/R + (VA − VOUT)/R + 2sC VA = 0 and sC(VB − VIN) + sC(VB − VOUT) + 2VB/R = 0. Output KCL is (VOUT − VA)/R + sC(VOUT − VB) = 0.",
      "Eliminating VA and VB yields H(s) = [(sRC)² + 1]/[(sRC)² + 4sRC + 1]. Its positive imaginary-axis zero is ω0 = 1/(RC), so f0 = 1/(2πRC) = 1,591.549431 Hz.",
      "At ω = 2ω0, sRC = j2. Hence H = −3/(−3 + j8) = (9 + j24)/73.",
      "Its magnitude is 3/√73 = 0.351123, and its principal phase is +69.443955°. The positive phase above the notch is valid; the phase at the exact zero itself is undefined.",
      "The exact cancellation depends on component ratios and an unloaded output. Finite source resistance, a load, or mismatched parts alters the response and can reduce notch depth."
    ],
    "formula": "H(s) = [(sRC)² + 1]/[(sRC)² + 4sRC + 1]",
    "inputs": [
      "Each series resistor: R = 10 kΩ",
      "Each series capacitor: C = 10 nF",
      "Resistor-branch midpoint A to ground: 2C = 20 nF",
      "Capacitor-branch midpoint B to ground: R/2 = 5 kΩ",
      "Source and load: Ideal voltage drive; open-circuit output"
    ],
    "sources": [
      {
        "title": "Analog Devices Basic Linear Design, Chapter 8: Analog Filters",
        "url": "https://www.analog.com/media/en/training-seminars/design-handbooks/basic-linear-design/chapter8.pdf",
        "supports": "Balanced twin-T component ratios and the passive no-feedback notch model (Q = 0.25). The exercise uses grounded midpoint elements, zero source resistance and an unloaded output; its results are independently checked by solving three complex KCL equations."
      }
    ]
  },
  {
    "slug": "expansion-v5-bjt-disabled-driver-leakage-bleed",
    "title": "Keep a disabled base driver from turning on",
    "version": 1,
    "signature": "e5b8a97d",
    "method": "bjtSwitch",
    "difficulty": "Easy",
    "trace": [
      "With the transistor off and the normal driver disconnected, base-node KCL is Ileak = VBE/RBE.",
      "The worst voltage occurs at the maximum leakage, 12 µA. Requiring 12 µA × RBE ≤ 0.40 V gives RBE ≤ 33,333.333 Ω.",
      "The largest allowed resistance is therefore 33.333 kΩ. A smaller resistor would also meet this off-state constraint, but would draw additional current when the normal driver is enabled.",
      "This calculation uses a supplied hard-off boundary. Real designs check transistor leakage, temperature, resistor tolerance, and the controller's reset-pin specifications rather than assuming that all BJTs share this threshold."
    ],
    "formula": "RBE,max = VBE,off,max / Ileak,max",
    "inputs": [
      "External leakage into base: 0 to 12 µA",
      "Emitter / collector: 0 V / +5 V",
      "Required off-state VBE: ≤ 0.40 V",
      "Reset driver: Disconnected; only RBE bleeds leakage"
    ],
    "sources": [
      {
        "title": "Nexperia: Bipolar Transistor Application Handbook",
        "url": "https://assets.nexperia.com/documents/brochure/nexperia_BJT_Handbook_V2_240425_lowres.pdf",
        "supports": "Primary vendor discussion of base-emitter resistors as current shunts and finite-beta terminal currents. The new exercise separately supplies a conservative hard-off boundary and an external reset-driver leakage source."
      }
    ]
  },
  {
    "slug": "expansion-v5-bjt-miller-input-bandwidth",
    "title": "A tiny collector-base capacitor limits bandwidth",
    "version": 1,
    "signature": "7e24b2ee",
    "method": "bjtSignal",
    "difficulty": "Medium",
    "trace": [
      "The Miller contribution is 2 pF × [1 − (−40)] = 82 pF. Adding Cπ gives Cin = 30 + 82 = 112 pF.",
      "The resistance seen by this input capacitance is RS ∥ rπ = 10 kΩ ∥ 5 kΩ = 3.333333 kΩ.",
      "The input time constant is 373.333333 ns, so fp = 1/(2π × 373.333333 ns) = 426.307883 kHz. Use frequency in Hz rather than angular frequency in radians per second.",
      "This is the requested input-only Miller estimate. A complete amplifier analysis would include the output pole and the frequency dependence of collector-to-base feedback; the estimate is not an exact bandwidth claim for every common-emitter circuit."
    ],
    "formula": "Cin = Cπ + Cµ(1 − Av); fp ≈ 1/[2π(RS ∥ rπ)Cin]",
    "inputs": [
      "Base-to-collector gain: Av = −40",
      "Cπ / Cµ: 30 pF / 2 pF",
      "RS / rπ: 10 kΩ / 5 kΩ",
      "Approximation: Miller input pole only; emitter at AC ground"
    ],
    "sources": [
      {
        "title": "MIT 6.012: Frequency Response of Amplifiers II, Lecture 22",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/e6afee3d5cc0080ed7bf6f7fd9c2c223_MIT6_012S09_lec22.pdf",
        "supports": "Primary derivation of the Miller input capacitance and source-resistance/ r-pi parallel input-pole approximation, including the distinction from a complete two-pole amplifier model."
      }
    ]
  },
  {
    "slug": "expansion-v5-bjt-optocoupler-pullup-corners",
    "title": "Find a pull-up window for an isolated input",
    "version": 1,
    "signature": "72c66fce",
    "method": "bjtSwitch",
    "difficulty": "Medium",
    "trace": [
      "In the on state the guaranteed sink capability is 200 µA. After sinking 20 µA sourced by the input, 180 µA remains for the pull-up at the 0.40 V boundary.",
      "The low-level condition is (5.00 − 0.40)/(0.95Rnom) ≤ 180 µA, giving Rnom ≥ 26.900585 kΩ.",
      "In the off state the total worst-case current to ground is 22 µA. The high-level condition is 5.00 − (22 µA)(1.05Rnom) ≥ 3.50 V, giving Rnom ≤ 64.935065 kΩ.",
      "Thus the allowable nominal window is approximately 26.901 to 64.935 kΩ. It is nonempty. The exercise explicitly guarantees sink current at the required low voltage; a real selection must check that operating point, CTR spread, temperature, aging, and off-state leakage."
    ],
    "formula": "Rnom,min = (VCC − VOL)/[(IC,min − Iinput,on)(1 − tol)]; Rnom,max = (VCC − VIH)/[(Idark + Iinput,off)(1 + tol)]",
    "inputs": [
      "Pull-up supply / tolerance: 5.00 V / R = Rnom × (1 ± 0.05)",
      "LED-on sink characterization: IF = 1.00 mA; IC,min = 0.20IF at VCE = 0.40 V",
      "On-state input leakage: 20 µA into collector; VOUT ≤ 0.40 V",
      "Off-state sink currents: 2 µA dark + 20 µA input; VOUT ≥ 3.50 V"
    ],
    "sources": [
      {
        "title": "Toshiba: How to Use a Photocoupler",
        "url": "https://toshiba.semicon-storage.com/eu/semiconductor/knowledge/e-learning/discrete/chap5/chap5-13.html",
        "supports": "Primary vendor interface-design workflow: LED current, current-transfer ratio, phototransistor output current, and output-side resistor design. The authored problem adds explicit low-voltage sink guarantees, input leakage, and resistor corners."
      },
      {
        "title": "Toshiba: Current Transfer Ratio Measurement Conditions",
        "url": "https://toshiba.semicon-storage.com/ap-en/semiconductor/knowledge/faq/opto/opto-008.html",
        "supports": "Primary reminder that CTR is measured under specified operating conditions; the exercise does not extrapolate a high-VCE CTR guarantee to saturation."
      }
    ]
  },
  {
    "slug": "expansion-v5-bjt-area-ratio-ptat-current",
    "title": "Convert an emitter-area ratio into a PTAT current",
    "version": 1,
    "signature": "2e6c8cbc",
    "method": "temperature",
    "difficulty": "Hard",
    "trace": [
      "Equal collector currents and IS2/IS1 = 8 give exp[(VBE1 − VBE2)/VT] = 8. Because their bases are joined and Q1's emitter is grounded, VE2 = VBE1 − VBE2 = VT ln(8).",
      "At 298 K, VE2 = (25.00 mV)ln(8) = 51.986039 mV. RE therefore carries IE2 = 51.986039 µA.",
      "Finite beta gives IC2 = [99/100]IE2 = 51.466178 µA. Using IE2 as the collector current would miss the base-current correction.",
      "VT, VE2, and the current are proportional to absolute temperature under the supplied assumptions. Thus ΔIC2 = 51.466178 µA × (358 − 298)/298 = 10.362318 µA; IC2 at 358 K is 61.828496 µA.",
      "The unknown common temperature dependence of IS cancels in the voltage difference. This ideal feedback model assumes the active nonzero solution and adequate compliance; it does not establish the startup or stability of a physical reference circuit."
    ],
    "formula": "VE2 = VT ln(A2/A1); IC2 = [β/(β + 1)]VT ln(A2/A1)/RE",
    "inputs": [
      "Collector-current condition: IC1 = IC2, nonzero forward-active solution",
      "Emitter areas / β: A2/A1 = 8 / β1 = β2 = 99",
      "RE / thermal-voltage model: 1.00 kΩ / VT = 25.00 mV × T/(298 K)",
      "Temperatures: 298 K and 358 K"
    ],
    "sources": [
      {
        "title": "Nexperia: Bipolar Transistor Application Handbook",
        "url": "https://assets.nexperia.com/documents/brochure/nexperia_BJT_Handbook_V2_240425_lowres.pdf",
        "supports": "Primary vendor discussion of base-emitter resistors as current shunts and finite-beta terminal currents. The new exercise separately supplies a conservative hard-off boundary and an external reset-driver leakage source."
      },
      {
        "title": "Analog Devices: AD592 Theory of Operation",
        "url": "https://www.analog.com/media/en/technical-documentation/data-sheets/ad592.pdf",
        "supports": "Primary vendor derivation of a base-emitter voltage difference proportional to absolute temperature and logarithm of collector-current-density ratio. The new equal-current, 8:1-area resistor arrangement and finite-beta correction are independently derived exercise models rather than the AD592 internal circuit."
      }
    ]
  },
  {
    "slug": "expansion-v5-mos-hot-on-state-loss",
    "title": "Budget conduction loss at the hot resistance",
    "version": 1,
    "signature": "600a1ec7",
    "method": "thermal",
    "difficulty": "Easy",
    "trace": [
      "At the specified hot operating point, RDS(on) = (12.0 mΩ)(1.60) = 19.2 mΩ.",
      "The drain-source drop is (5.00 A)(19.2 mΩ) = 96.0 mV.",
      "The conduction power is (5.00 A)²(19.2 mΩ) = 0.480 W = 480 mW. The cross-check I × VDS gives the same result.",
      "The room-temperature resistance would underestimate both quantities. This exercise excludes self-heating and switching losses; a complete component design also checks thermal conditions, gate-drive guarantees, and other ratings."
    ],
    "formula": "Rhot = R25 × multiplier; VDS = ID Rhot; Pcond = ID² Rhot",
    "inputs": [
      "Constant drain current: 5.00 A",
      "Gate-source drive: 4.50 V, fully enhanced",
      "RDS(on) at 25 °C: 12.0 mΩ",
      "Imposed junction temperature / multiplier: 100 °C / 1.60"
    ],
    "sources": [
      {
        "title": "Nexperia: MOSFET Engineering FAQs",
        "url": "https://www.nexperia.com/products/mosfets.html",
        "supports": "Primary vendor explanation of I-squared-R on-state losses, increasing on resistance with junction temperature, and circuit-dependent capacitive dV/dt turn-on. Hypothetical hot-resistance multipliers and circuit values are supplied explicitly in the authored questions."
      },
      {
        "title": "Texas Instruments: Selecting the Optimized Power MOSFET for Boost Device TPS61287",
        "url": "https://www.ti.com/lit/pdf/sdaa165",
        "supports": "Primary junction-temperature relation TJ = TA + power times junction-to-ambient thermal resistance and thermal-rating checks. The standalone transistor exercise excludes all switching and converter losses."
      }
    ]
  },
  {
    "slug": "expansion-v5-mos-bootstrap-charge-budget",
    "title": "Keep a high-side gate alive between refreshes",
    "version": 1,
    "signature": "d5849b95",
    "method": "gateDrive",
    "difficulty": "Medium",
    "trace": [
      "The continuous-current charge is (0.250 + 0.050)mA × 10.0 µs = 3.0 nC. Including the gate transition, total removed charge is 48.0 nC.",
      "Allowed droop is 10.00 − 9.20 = 0.80 V. The minimum effective capacitance is 48.0 nC/0.80 V = 60.0 nF, so the minimum nominal value is 60.0/0.60 = 100 nF.",
      "A 150 nF nominal capacitor has 90.0 nF effective capacitance. Its droop is 48.0/90.0 = 0.533333 V; final VGS = VBS = 9.466667 V.",
      "This is a one-interval charge budget. A real bootstrap design also checks recharge time, undervoltage lockout thresholds, diode losses, peak current, and the range of gate-charge and capacitance values over operating conditions."
    ],
    "formula": "Qtotal = QG + (Iq + Ileak)ton; Cnom,min = Qtotal/[0.60(VBS,initial − VBS,min)]",
    "inputs": [
      "Initial / required final VBS: 10.00 V / ≥ 9.20 V",
      "Gate charge per turn-on: 45.0 nC",
      "On time / supply currents: 10.0 µs / 0.250 mA + 0.050 mA",
      "Effective capacitance: 0.60 × nominal; no interval recharge"
    ],
    "sources": [
      {
        "title": "Texas Instruments: Bootstrap Circuitry Selection for Half-Bridge Configurations",
        "url": "https://www.ti.com/lit/an/slua887a/slua887a.pdf",
        "supports": "Primary charge-budget method for bootstrap capacitance, including gate charge, quiescent/leakage consumption, allowable droop, and capacitance derating. The exercise independently defines one interval and its initial capacitor voltage."
      }
    ]
  },
  {
    "slug": "expansion-v5-mos-drain-slew-false-turnon",
    "title": "A drain ramp lifts an off-state gate",
    "version": 1,
    "signature": "75e8c36a",
    "method": "gateDrive",
    "difficulty": "Medium",
    "trace": [
      "During the ramp dVD/dt = 2.00 V/ns, so the injected current term CGD dVD/dt is 40.0 mA. Gate KCL includes both capacitances: (320 pF)dVG/dt + VG/(100 Ω) = 40.0 mA.",
      "The time constant is 100 Ω × 320 pF = 32.0 ns and the constant-ramp asymptote is 4.00 V. Until threshold, VG(t) = 4.00[1 − exp(−t/32.0 ns)] V.",
      "At 5.00 ns this gives 0.578619 V, below the threshold and within the model's valid interval.",
      "Setting VG = 1.00 V gives tcross = −32.0 ns × ln(1 − 1.00/4.00) = 9.205826 ns. It is less than the 10.0 ns ramp duration, so this model predicts a first threshold crossing during the ramp.",
      "The 4.00 V asymptote is not the voltage reached in a short ramp. Subsequent channel conduction and real voltage-dependent capacitances require a more complete model; the calculation stops at first crossing."
    ],
    "formula": "τ = R(CGS + CGD); VG(t) = R CGD(dVD/dt)[1 − exp(−t/τ)]",
    "inputs": [
      "Off-driver sink resistance: 100 Ω to 0 V",
      "CGS / CGD: 300 pF / 20 pF, constant",
      "Externally forced drain ramp: 0 → 20 V in 10.0 ns",
      "Initial VGS / first threshold: 0 V / 1.00 V"
    ],
    "sources": [
      {
        "title": "Nexperia: MOSFET Engineering FAQs",
        "url": "https://www.nexperia.com/products/mosfets.html",
        "supports": "Primary vendor explanation of I-squared-R on-state losses, increasing on resistance with junction temperature, and circuit-dependent capacitive dV/dt turn-on. Hypothetical hot-resistance multipliers and circuit values are supplied explicitly in the authored questions."
      },
      {
        "title": "Texas Instruments: dV/dt Induced Turn On and Miller Current",
        "url": "https://www.ti.com/document-viewer/lit/html/SBAA697",
        "supports": "Primary vendor description of drain-slew displacement current through Cgd and gate impedance creating unwanted gate voltage. The authored constant-capacitance differential equation retains both Cgs and Cgd and stops at first threshold crossing."
      }
    ]
  },
  {
    "slug": "expansion-v5-mos-electrothermal-fixed-point",
    "title": "Solve the feedback between on resistance and heat",
    "version": 1,
    "signature": "bed8d243",
    "method": "thermal",
    "difficulty": "Hard",
    "trace": [
      "At 8.00 A, substitution gives P = 64(0.0200)[1 + 0.00600(50.0 + 40.0P − 25)] = 1.472 + 0.3072P, with P in W.",
      "Solving gives P = 1.472/(1 − 0.3072) = 2.124711 W. The corresponding TJ is 50.0 + 40.0P = 134.988453 °C, within the stated model range and temperature limit.",
      "The hot resistance is P/64 = 0.033198614 Ω = 33.198614 mΩ. The feedback slope 0.3072 is below one, so the supplied one-node electrothermal model has a stable equilibrium under a positive thermal-capacitance extension.",
      "At 150 °C, RDS(on) = 0.0200[1 + 0.00600(150 − 25)] = 0.0350 Ω. The allowed power is (150 − 50)/40 = 2.50 W, giving Imax = sqrt(2.50/0.0350) = 8.451543 A.",
      "Using 20 mΩ throughout would underestimate dissipation and overestimate current capability. The derived limit belongs to this stated constant-current thermal model; real selection also checks package, PCB, electrical limits, and safe operating area."
    ],
    "formula": "P = I²R25[1 + α(TA − 25)]/[1 − I²R25αθ]; Imax = sqrt[(TJ,max − TA)/(θ R(TJ,max))]",
    "inputs": [
      "On-resistance model: R25 = 20.0 mΩ; coefficient +0.00600 per °C",
      "Ambient / thermal resistance: 50.0 °C / 40.0 °C per W",
      "First operating current: 8.00 A, constant",
      "Maximum model junction temperature: 150 °C; conduction loss only"
    ],
    "sources": [
      {
        "title": "Nexperia: MOSFET Engineering FAQs",
        "url": "https://www.nexperia.com/products/mosfets.html",
        "supports": "Primary vendor explanation of I-squared-R on-state losses, increasing on resistance with junction temperature, and circuit-dependent capacitive dV/dt turn-on. Hypothetical hot-resistance multipliers and circuit values are supplied explicitly in the authored questions."
      },
      {
        "title": "Nexperia: Precision Electrothermal Models for Power MOSFETs",
        "url": "https://www.nexperia.com/applications/interactive-app-notes/IAN50012_Nexperia_Precision_Electrothermal_models_for_Power_MOSFETs",
        "supports": "Primary vendor explanation of coupled electrical and thermal device behavior. The authored problem uses a deliberately bounded lumped linear resistance/thermal model rather than copying a device model or asserting real-part SOA."
      },
      {
        "title": "Texas Instruments: Selecting the Optimized Power MOSFET for Boost Device TPS61287",
        "url": "https://www.ti.com/lit/pdf/sdaa165",
        "supports": "Primary junction-temperature relation TJ = TA + power times junction-to-ambient thermal resistance and thermal-rating checks. The standalone transistor exercise excludes all switching and converter losses."
      }
    ]
  },
  {
    "slug": "expansion-v5-uart-framing-latency",
    "title": "Budget UART time including every framing bit",
    "version": 1,
    "signature": "70a90ffa",
    "method": "throughput",
    "difficulty": "Easy",
    "trace": [
      "An 8N1 frame occupies 1 + 8 + 0 + 1 = 10 bit periods. The 128 frames therefore use 1280 bits on the wire.",
      "The 8N1 duration is 1280/230400 seconds = 5.55556 ms.",
      "An 8E2 frame occupies 1 + 8 + 1 + 2 = 12 bit periods, giving 1536 transmitted bits and 1536/230400 seconds = 6.66667 ms.",
      "Parity changes the parity bit's value, but it always consumes one bit period when enabled. A payload-only estimate would omit framing overhead."
    ],
    "formula": "Wire time = frames × (start + data + parity + stop bits) / baud",
    "inputs": [
      "Payload: 128 bytes; 8 data bits per frame",
      "Baud: 230400 bits/s, exact",
      "8N1: 1 start + 8 data + 0 parity + 1 stop",
      "8E2: 1 start + 8 data + 1 parity + 2 stop",
      "Gap: No additional gap between frames"
    ],
    "sources": [
      {
        "title": "Microchip: Getting Started with USART, TB3216",
        "url": "https://ww1.microchip.com/downloads/en/Appnotes/TB3216-Getting-Started-with-USART-90003216B.pdf",
        "supports": "UART frames include a start bit, specified data bits, optional parity, and stop bits; 8N1 contains ten transmitted bits. The original problem specifies its own exact baud, payload size, and alternate 8E2 format, then counts every transmitted bit period."
      }
    ]
  },
  {
    "slug": "expansion-v5-fractional-enable-spacing",
    "title": "Separate average enable rate from tick spacing",
    "version": 1,
    "signature": "f939160b",
    "method": "throughput",
    "difficulty": "Medium",
    "trace": [
      "The first ten stored accumulator values are 3, 6, 9, 2, 5, 8, 1, 4, 7, 0. Events occur at edges 4, 7, and 10.",
      "The state then repeats, so the next events are at edges 14, 17, and 20. There are three events in every ten 10 ns clock periods, giving 30 MHz.",
      "Successive event-edge spacings repeat as 3, 3, and 4 system-clock periods. Their minimum is 30 ns and their maximum is 40 ns.",
      "The average period is 100/3 ns; it is not the period of every event interval. The reset-to-first-event interval is 40 ns and was explicitly excluded from the spacing definition."
    ],
    "formula": "Average event rate = fclock × increment/modulus; actual spacings are integer clock periods",
    "inputs": [
      "System clock: 100 MHz; period 10 ns",
      "Accumulator modulus: 10",
      "Increment per rising edge: 3",
      "Initial accumulator: a = 0 before edge 1",
      "Event rule: Assert when old a + 3 ≥ 10; then subtract 10"
    ],
    "sources": [
      {
        "title": "Analog Devices AN-953: Direct Digital Synthesis with a Programmable Modulus",
        "url": "https://www.analog.com/en/resources/app-notes/an-953.html",
        "supports": "Accumulator increments and a defined rollover modulus establish an average rollover rate. Ohm's original modulo-10 example is a synchronous enable generator rather than a sine-wave DDS or a clock output; its actual discrete event spacings are independently traced."
      }
    ]
  },
  {
    "slug": "expansion-v5-fifo-stall-buffer-budget",
    "title": "Keep a burst through a downstream stall",
    "version": 1,
    "signature": "700c00a0",
    "method": "throughput",
    "difficulty": "Medium",
    "trace": [
      "At edge 1, the FIFO has no existing word to pop, so accepting the producer's word leaves occupancy 1. Edge 2 pops one and pushes one, keeping occupancy 1.",
      "Ready is low at edges 3, 4, and 5. Those pushes increase the occupancy to 2, 3, and 4.",
      "At edges 6, 7, and 8, the FIFO is nonempty and ready is high. Each edge replaces one popped word with one pushed word, so the final occupancy is 4.",
      "The complete post-edge sequence is 1, 1, 2, 3, 4, 4, 4, 4. Its maximum requires four actual storage slots; depth three would already overflow at edge 5. This result depends on the stated no-bypass and full-pop/push semantics."
    ],
    "formula": "pop = ready AND (old occupancy > 0); next occupancy = old occupancy − pop + push",
    "inputs": [
      "Initial occupancy: 0 words",
      "Producer: 1 word at each edge 1…8, never blocked",
      "Consumer ready at edges 1…8: 1, 1, 0, 0, 0, 1, 1, 1",
      "Read eligibility: Only words already stored before the edge; no empty bypass",
      "Simultaneous pop and push: Pop frees a slot at that same edge"
    ],
    "sources": [
      {
        "title": "AMD UG934: READY/VALID Handshake",
        "url": "https://docs.amd.com/r/en-US/ug934_axi_videoIP/READY/VALID-Handshake",
        "supports": "Accepted synchronous transfers require the relevant valid and ready conditions at a rising edge. The original queue questions define their storage, legal occupancy encodings, reset, no-bypass, and same-edge replacement semantics explicitly; those custom semantics are independently cycle-traced rather than attributed to AMD FIFO implementations."
      }
    ]
  },
  {
    "slug": "expansion-v5-crc-codeword-syndrome",
    "title": "Verify a CRC with explicit bit-order conventions",
    "version": 1,
    "signature": "1da80fbe",
    "method": "coding",
    "difficulty": "Hard",
    "trace": [
      "GF(2) division reduces 110101000 through 011001000, 001111000, 000100000, 000001100, and finally 000000111. The CRC is therefore 111₂ = 7.",
      "The valid codeword is 110101111. Dividing this complete word by 1011 gives remainder 000, as required by this explicitly augmented encoding convention.",
      "Flipping its third bit from the left changes the codeword to 111101111. That position is the x⁶ coefficient, so the error polynomial is x⁶.",
      "Modulo x³ + x + 1, x³ equals x + 1. Hence x⁶ equals (x + 1)² = x² + 1 over GF(2), giving syndrome 101₂ = 5. The nonzero syndrome detects this error; CRC detection does not in general locate or correct every possible error."
    ],
    "formula": "R = (M·x³) mod G; C = M·x³ XOR R; syndrome(C XOR x⁶) = x⁶ mod G",
    "inputs": [
      "Payload: 110101₂, six bits, highest coefficient first",
      "Generator: G(x) = x³ + x + 1; bits 1011",
      "Encoding: Divide payload + 000; replace those zeros with the remainder",
      "Receiver check: Divide nine received bits directly; append no additional zeros",
      "Single error: Invert bit 3 counting from the left of the nine-bit codeword"
    ],
    "sources": [
      {
        "title": "Microchip AN1148: Cyclic Redundancy Check",
        "url": "https://www.microchip.com/content/dam/mchp/documents/OTH/ApplicationNotes/ApplicationNotes/01148a.pdf",
        "supports": "GF(2) polynomial division uses XOR, appending degree-many zeros before computing an augmented CRC, and a valid received codeword has zero remainder under that convention. The exercise fixes its original payload, generator, bit indexing, augmentation, and non-reflected zero-initialized convention; tests cross-check long division, a shift-register reducer, and the single-error polynomial."
      }
    ]
  },
  {
    "slug": "expansion-v5-hdl-exactly-one-mode",
    "title": "Reject zero-hot and multi-hot mode settings",
    "version": 1,
    "signature": "782ce6ff",
    "method": "hdlLogic",
    "difficulty": "Easy",
    "trace": [
      "Pattern 100 is selected by m2 & ~m1 & ~m0. Patterns 010 and 001 have analogous terms with just their selected mode input asserted.",
      "ORing the three disjoint terms accepts exactly those legal patterns and rejects all other five combinations.",
      "An equivalent expression is (m2 ^ m1 ^ m0) & ~(m2 & m1 & m0). Plain XOR alone is incorrect because 111 has odd parity.",
      "The workbench exhausts all eight known-bit input patterns. Passing them establishes the specified Boolean legality check, not a guarantee against analog glitches or metastability."
    ],
    "formula": "y = 1 iff m2 + m1 + m0 = 1, where this sum counts asserted bits",
    "inputs": [
      "Inputs: m2, m1, m0; one known bit each",
      "Legal mode patterns [m2 m1 m0]: 001, 010, 100",
      "Output: y = 1 exactly for a legal mode",
      "Workbench: One continuous assignment to one-bit y"
    ],
    "sources": [
      {
        "title": "Cornell ECE 4750: Verilog Hardware Description Language Tutorial",
        "url": "https://www.csl.cornell.edu/courses/ece5745/handouts/ece4750-tut4-verilog.pdf",
        "supports": "Single-bit Boolean operators, conditional expressions, and continuous assignments. The exact-one, SPI, custom queue, and syndrome-classifier truth tables are original fully specified functions; the server tests exhaustively verify every supported known-bit row and equivalent assignments."
      }
    ]
  },
  {
    "slug": "expansion-v5-hdl-spi-sample-edge",
    "title": "Select the sampling edge in all four SPI modes",
    "version": 1,
    "signature": "e086472d",
    "method": "hdlLogic",
    "difficulty": "Medium",
    "trace": [
      "For (cpol, cpha) = (0,0), sampling uses a rising edge. Modes (0,1) and (1,0) sample on falling edges, while (1,1) samples on rising edges.",
      "The required rising-edge descriptor is therefore 1 when cpol and cpha agree: ~(cpol ^ cpha). The candidate rise must equal that bit.",
      "For one-bit operands, rise == ~(cpol ^ cpha) is equivalent to rise ^ cpol ^ cpha. ANDing with ~cs_n forces all deselected cases low.",
      "This implements an edge-selector truth table. A real SPI receiver also needs properly clocked data capture, timing compliance, and a safe clock-domain design; using a clock level as rise would implement a different specification."
    ],
    "formula": "sample = selected AND (candidate rising == NOT(CPOL XOR CPHA))",
    "inputs": [
      "Inputs: cs_n, cpol, cpha, rise; one bit each",
      "Select: cs_n = 0 selects; cs_n = 1 forces y = 0",
      "Edge descriptor: rise = 1 means rising edge; rise = 0 means falling edge",
      "CPOL: Clock's idle level",
      "CPHA: 0 samples leading; 1 samples trailing"
    ],
    "sources": [
      {
        "title": "Analog Devices: Introduction to SPI Interface",
        "url": "https://www.analog.com/en/resources/analog-dialogue/articles/introduction-to-spi-interface.html",
        "supports": "CPOL defines idle clock level and CPHA selects the sampling edge; modes 0 and 3 sample on rising edges, while modes 1 and 2 sample on falling edges. The question implements a combinational edge descriptor, not a physical edge detector or an entire SPI controller."
      },
      {
        "title": "Cornell ECE 4750: Verilog Hardware Description Language Tutorial",
        "url": "https://www.csl.cornell.edu/courses/ece5745/handouts/ece4750-tut4-verilog.pdf",
        "supports": "Single-bit Boolean operators, conditional expressions, and continuous assignments. The exact-one, SPI, custom queue, and syndrome-classifier truth tables are original fully specified functions; the server tests exhaustively verify every supported known-bit row and equivalent assignments."
      }
    ]
  },
  {
    "slug": "expansion-v5-hdl-queue-accept-replacement",
    "title": "Accept a full-queue replacement without accepting illegal state",
    "version": 1,
    "signature": "35b391d1",
    "method": "hdlLogic",
    "difficulty": "Medium",
    "trace": [
      "Reset or an absent offered input independently forces rejection, providing the factors ~rst and valid.",
      "The illegal encoding is identified by c1 & c0, so ~(c1 & c0) rejects it before applying any admission rule.",
      "For legal counts 00 and 01, ~c1 is 1 and there is an unused slot. For legal count 10, admission requires ready, because an existing word must be popped to make space.",
      "Combining these conditions gives ~rst & valid & ~(c1 & c0) & (~c1 | ready). An equivalent legal-state case expression is ~rst & valid & (c1 ? (~c0 & ready) : 1'b1)."
    ],
    "formula": "accept = NOT reset AND input valid AND legal count AND (not full OR same-edge pop)",
    "inputs": [
      "Inputs: rst, c1, c0, valid, ready; one known bit each",
      "Legal counts: 00 → 0; 01 → 1; 10 → 2 words",
      "Illegal count: 11; reject every incoming word",
      "Full-queue policy: A same-edge pop may free the incoming word's slot",
      "Reset: rst = 1 forces y = 0"
    ],
    "sources": [
      {
        "title": "AMD UG934: READY/VALID Handshake",
        "url": "https://docs.amd.com/r/en-US/ug934_axi_videoIP/READY/VALID-Handshake",
        "supports": "Accepted synchronous transfers require the relevant valid and ready conditions at a rising edge. The original queue questions define their storage, legal occupancy encodings, reset, no-bypass, and same-edge replacement semantics explicitly; those custom semantics are independently cycle-traced rather than attributed to AMD FIFO implementations."
      },
      {
        "title": "Cornell ECE 4750: Verilog Hardware Description Language Tutorial",
        "url": "https://www.csl.cornell.edu/courses/ece5745/handouts/ece4750-tut4-verilog.pdf",
        "supports": "Single-bit Boolean operators, conditional expressions, and continuous assignments. The exact-one, SPI, custom queue, and syndrome-classifier truth tables are original fully specified functions; the server tests exhaustively verify every supported known-bit row and equivalent assignments."
      }
    ]
  },
  {
    "slug": "expansion-v5-hdl-secded-data-correction",
    "title": "Distinguish a data correction from a parity-bit error",
    "version": 1,
    "signature": "daa91035",
    "method": "hdlLogic",
    "difficulty": "Hard",
    "trace": [
      "With the stated maximum of two errors, failed overall parity identifies an odd number of errors and therefore exactly one. A successful overall parity check never triggers this correction flag.",
      "Payload positions have syndromes 011, 101, 110, or 111. Syndrome 000 with odd = 1 points to the overall parity bit, and 001, 010, or 100 point to the Hamming check bits; none needs a payload flip.",
      "The payload-location test is true when any pair of s2, s1, and s0 is high: (s2 & s1) | (s2 & s0) | (s1 & s0). Multiplying by valid & odd gives the requested flag.",
      "A check of merely S != 0 would also request flips for parity-bit errors. The two-error assumption matters: some three-bit faults can imitate a single-bit syndrome, so this expression does not promise safe correction beyond that model."
    ],
    "formula": "y = valid AND odd AND (S belongs to {3, 5, 6, 7})",
    "inputs": [
      "Inputs: valid, odd, s2, s1, s0; one bit each",
      "Hamming syndrome: S = 4s2 + 2s1 + s0; affected position for a single error",
      "Hamming check-bit positions: 1, 2, 4",
      "Payload positions: 3, 5, 6, 7",
      "Overall parity: Even parity across all 8 bits; odd = 1 means this check fails",
      "Error model: At most two corrupted bits; valid = 0 suppresses y"
    ],
    "sources": [
      {
        "title": "Cornell ECE 4750: Verilog Hardware Description Language Tutorial",
        "url": "https://www.csl.cornell.edu/courses/ece5745/handouts/ece4750-tut4-verilog.pdf",
        "supports": "Single-bit Boolean operators, conditional expressions, and continuous assignments. The exact-one, SPI, custom queue, and syndrome-classifier truth tables are original fully specified functions; the server tests exhaustively verify every supported known-bit row and equivalent assignments."
      },
      {
        "title": "MIT 6.004: Tutorial 1, Hamming Single-Error-Correcting Code",
        "url": "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2009/8ef531797e54260f68c2a430932d1630_MIT6_004s09_tutor01.pdf",
        "supports": "Parity positions are powers of two; a data position's binary index selects the parity checks covering it. Payload positions therefore have multiple syndrome bits asserted for a single error. The original eight-bit decoder uses its explicitly supplied conventional placement and extra overall parity; independent tests form and corrupt complete codewords to verify every single- and double-error outcome."
      },
      {
        "title": "Intel Technology Journal, Volume 17 Issue 1: ECC Techniques",
        "url": "https://www.intel.com/content/dam/www/public/us/en/documents/research/2013-vol17-iss-1-intel-technology-journal.pdf",
        "supports": "An overall parity check distinguishes odd and even error counts. Combined with the problem's strict at-most-two-error assumption and stated Hamming placement, failed overall parity identifies a single error, while two errors must not cause the requested payload-correction flag."
      }
    ]
  },
  {
    "slug": "expansion-v6-transformer-reflected-load",
    "title": "See a resistor through a turns ratio",
    "version": 1,
    "signature": "794082a4",
    "method": "transformer",
    "difficulty": "Easy",
    "trace": [
      "The primary-to-secondary turns ratio is a = 300/100 = 3. The secondary voltage is 12/3 = 4 V RMS.",
      "The secondary current is 4/12 = 1/3 A RMS. The primary source current is smaller by another factor of 3: 1/9 A = 0.111111 A RMS.",
      "The input resistance is 12/(1/9) = 108 Ω, equivalently a² × 12 Ω. The square matters: a factor-of-three voltage change is not a factor-of-three impedance change.",
      "Input real power is 12 × (1/9) = 1.333333 W. The load dissipates 4²/12 = 1.333333 W, consistent with the stipulated lossless model. No magnetizing branch is present in this exercise."
    ],
    "formula": "Rin = (NP/NS)² RL; IP,RMS = VP,RMS/Rin",
    "inputs": [
      "Primary turns: 300",
      "Secondary turns: 100",
      "Applied primary voltage: 12 V RMS",
      "Secondary load: 12 Ω"
    ],
    "sources": [
      {
        "title": "OpenStax University Physics Volume 2: Transformers",
        "url": "https://openstax.org/books/university-physics-volume-2/pages/15-6-transformers",
        "supports": "Ideal voltage/current turns relations and square-ratio reflected resistance. Only these physical principles support the original problem; its wording, diagram, values and worked calculations are newly authored."
      }
    ]
  },
  {
    "slug": "expansion-v6-schmitt-two-state-thresholds",
    "title": "Use the output state to find both trip points",
    "version": 1,
    "signature": "d4bc0114",
    "method": "opamp",
    "difficulty": "Medium",
    "trace": [
      "KCL at P gives (VP − 2)/30 kΩ + (VP − vOUT)/20 kΩ = 0. Therefore VP = (2/30 + vOUT/20)/(1/30 + 1/20), with consistent kΩ units.",
      "During the rising sweep, the output is still high immediately before switching. Substituting vOUT = 5 V gives VP = 3.8 V. Crossing this value upward switches the output low.",
      "During the falling sweep, the output is still low immediately before switching. Substituting vOUT = 0 V gives VP = 0.8 V. Crossing this value downward switches the output high.",
      "The hysteresis width is 3.8 − 0.8 = 3.0 V. At an input strictly between these voltages, either output state is self-consistent; the previous state determines the result. Treating the comparator as a linear op amp would miss this memory."
    ],
    "formula": "Vtrip(vOUT) = (VREF/RREF + vOUT/RFB)/(1/RREF + 1/RFB)",
    "inputs": [
      "Reference to P: 2 V through 30 kΩ",
      "Output feedback to P: 20 kΩ",
      "Output states: 0 V and 5 V",
      "Signal input: vIN at inverting input"
    ],
    "sources": [
      {
        "title": "Texas Instruments SNOA997A: Inverting Comparator With Hysteresis Circuit",
        "url": "https://www.ti.com/lit/ab/snoa997a/snoa997a.pdf",
        "supports": "Positive feedback at the noninverting comparator input makes distinct state-dependent switching thresholds. The original exercise uses a specified ideal push-pull output and an explicit two-resistor/reference topology, checked independently by KCL and state consistency."
      }
    ]
  },
  {
    "slug": "expansion-v6-coupled-inductor-series-dots",
    "title": "Reversing one winding changes the series inductance",
    "version": 1,
    "signature": "4d809246",
    "method": "transformer",
    "difficulty": "Medium",
    "trace": [
      "M = 0.50√(4 × 9) = 3 mH. The inductance matrix has positive determinant L1L2 − M² = 27 mH², so these parameters form a passive coupled pair.",
      "When the current enters both dots, both mutual voltage terms aid the respective self-induced drops. The total is (L1 + L2 + 2M) di/dt, giving Leq,A = 4 + 9 + 6 = 19 mH.",
      "When the second winding is reversed, both mutual terms oppose the self terms in the series sum. Leq,B = L1 + L2 − 2M = 4 + 9 − 6 = 7 mH.",
      "Both values are positive. For any instantaneous current i, the stored magnetic energy is ½Leq i² for that connection; no negative-energy or ideal-transformer assumption is required. Simply adding 4 and 9 mH ignores the coupling."
    ],
    "formula": "M = k√(L1L2); Leq = L1 + L2 ± 2M",
    "inputs": [
      "Self-inductance L1: 4 mH",
      "Self-inductance L2: 9 mH",
      "Coupling coefficient: 0.50",
      "Connection A: Current enters both dots",
      "Connection B: Current enters L1 dot, leaves L2 dot"
    ],
    "sources": [
      {
        "title": "Oregon State University ENGR 202, K. Webb: Magnetically-Coupled Circuits",
        "url": "https://web.engr.oregonstate.edu/~webbky/ENGR202_files/SECTION%205%20Magnetically%20Coupled%20Circuits.pdf",
        "supports": "Dot convention, mutual-inductance magnitude from coupling coefficient, passive coupled-inductor equations, and ideal transformer port relations. The series-connection exercise uses its own current references and separately checks positive magnetic energy."
      }
    ]
  },
  {
    "slug": "expansion-v6-transformer-magnetizing-current",
    "title": "Include the current that never reaches the load",
    "version": 1,
    "signature": "3bec5f03",
    "method": "transformer",
    "difficulty": "Hard",
    "trace": [
      "The reflected load is ZREF = (2/1)²(8 + j6) = 32 + j24 Ω. The magnetizing branch is jωLM = j125.663706 Ω at 1 kHz.",
      "The primary parallel impedance is ZP = [1/(32 + j24) + 1/(j125.663706)]⁻¹ = 21.573620 + j24.764085 Ω. Including the series resistor gives Zin = 23.573620 + j24.764085 Ω.",
      "IS = 12/Zin = 0.241993 − j0.254213 A RMS. Its magnitude is 0.350977 A and its signed phase is −46.410801°; the negative phase means the source current lags.",
      "VP = 12 − 2IS = 11.516015 + j0.508426 V RMS. The secondary voltage is VP/2, so load current is (VP/2)/(8 + j6). Its real dissipation is |IL|² × 8 = 2.657542 W.",
      "The source delivers Re(VS IS*) = 2.903911 W. The series resistor dissipates |IS|² × 2 = 0.246370 W; the remainder is exactly the load power. The parallel lossless inductor carries reactive current without receiving average real power."
    ],
    "formula": "ZREF = a²ZL; ZP = (1/ZREF + 1/(jωLM))⁻¹; IS = VS/(RS + ZP)",
    "inputs": [
      "Source RMS phasor: 12∠0° V at 1 kHz",
      "Primary series resistance: 2 Ω",
      "Shunt magnetizing branch: 20 mH from P to primary return",
      "Ideal turns ratio NP:NS: 2:1",
      "Secondary load impedance: 8 + j6 Ω at 1 kHz"
    ],
    "sources": [
      {
        "title": "Oregon State University ENGR 202, K. Webb: Magnetically-Coupled Circuits",
        "url": "https://web.engr.oregonstate.edu/~webbky/ENGR202_files/SECTION%205%20Magnetically%20Coupled%20Circuits.pdf",
        "supports": "Dot convention, mutual-inductance magnitude from coupling coefficient, passive coupled-inductor equations, and ideal transformer port relations. The series-connection exercise uses its own current references and separately checks positive magnetic energy."
      },
      {
        "title": "Analog Devices: Proper Layout and Component Selection Controls EMI",
        "url": "https://www.analog.com/en/resources/technical-articles/proper-layout-and-component-selection-controls-emi.html",
        "supports": "A transformer equivalent model includes magnetizing inductance in addition to ideal voltage transformation. The original question explicitly defines a linear parallel magnetizing branch and excludes nonlinear saturation, leakage and loss; its phasor values are calculated from that stipulated model."
      }
    ]
  },
  {
    "slug": "expansion-v6-compensated-scope-probe",
    "title": "Match the probe and scope time constants",
    "version": 1,
    "signature": "d68e3be8",
    "method": "filter",
    "difficulty": "Easy",
    "trace": [
      "Each parallel branch has impedance R/(1 + sRC). A frequency-independent divider requires the branch time constants to match: RP CP = RS CS.",
      "Therefore CP = (1 MΩ/9 MΩ) × 15 pF = 1.666667 pF. Both branch time constants are then 15 μs.",
      "The ratio becomes RS/(RP + RS) = 1/10 at every modeled frequency. Its high-frequency capacitive limit is CP/(CP + CS) = 1/10 as a separate check.",
      "This matches compensation in the stated lumped model. It does not remove the probe’s loading on a nonideal source or account for transmission-line behavior at high frequency."
    ],
    "formula": "RP CP = RS CS",
    "inputs": [
      "Probe series branch: 9 MΩ in parallel with CP",
      "Scope shunt branch: 1 MΩ in parallel with 15 pF",
      "Source: Ideal voltage source at probe tip"
    ],
    "sources": [
      {
        "title": "Tektronix: ABCs of Probes Primer",
        "url": "https://www.tek.com/en/documents/whitepaper/abcs-probes-primer",
        "supports": "Passive probe compensation must match the scope/cable input model and affects measured waveform fidelity. The original lumped divider is fully specified and its required compensation is independently checked over a frequency sweep, without copying a probe drawing or exercise."
      }
    ]
  },
  {
    "slug": "expansion-v6-schmitt-rc-relaxation",
    "title": "Time an RC between two moving targets",
    "version": 1,
    "signature": "cfb82753",
    "method": "periodic",
    "difficulty": "Medium",
    "trace": [
      "The time constant is RC = 10,000 × 100 × 10⁻⁹ = 1 ms. In the +5 V state, vX(t) = 5 + (−2 − 5)e^(−t/RC) = 5 − 7e^(−t/RC).",
      "At the upper threshold, 2 = 5 − 7e^(−tH/RC), so e^(−tH/RC) = 3/7. Hence tH = RC ln(7/3) = 0.847298 ms.",
      "The −5 V state takes the same time to go from +2 V to −2 V. The period is 2tH = 1.694596 ms and the frequency is 1/(2tH) = 590.111251 Hz.",
      "At each output reversal the capacitor voltage remains continuous. Both output targets lie beyond their respective trip points, so each next threshold can be reached; the stipulated ideal switching law supports this limit cycle."
    ],
    "formula": "tH = RC ln[(5 − (−2))/(5 − 2)]; f = 1/(2tH)",
    "inputs": [
      "Output states: +5 V and −5 V",
      "Resistor from output to X: 10 kΩ",
      "Capacitor from X to ground: 100 nF",
      "Switching thresholds: Rising +2 V; falling −2 V"
    ],
    "sources": [
      {
        "title": "Texas Instruments SNOA998A: Relaxation Oscillator Circuit",
        "url": "https://www.ti.com/lit/ab/snoa998a/snoa998a.pdf",
        "supports": "Comparator output states charge and discharge an RC node between hysteresis trip points, so RC and those thresholds determine the oscillation period. The original symmetric bipolar model stipulates ideal zero-delay switching and is independently integrated to both crossing events."
      }
    ]
  },
  {
    "slug": "expansion-v6-dielectric-absorption-rebound",
    "title": "A discharged terminal remembers an internal charge",
    "version": 1,
    "signature": "acbdf1de",
    "method": "charge",
    "difficulty": "Medium",
    "trace": [
      "The isolated top-node charge is C0 vX + CA vA = CA × 10 V. At equilibrium the resistor current is zero, so vX = vA = V∞.",
      "Thus V∞ = 10CA/(C0 + CA) = 10 × 0.10/1.10 = 0.909091 V. No external energy source is needed: charge initially stored internally redistributes.",
      "KCL gives C0 dvX/dt = (vA − vX)/RA and CA dvA/dt = (vX − vA)/RA. Their difference decays with τ = RA C0CA/(C0 + CA) = 9.090909 ms.",
      "Since vX starts at zero, vX(t) = V∞[1 − e^(−t/τ)]. Half recovery occurs at t = τ ln 2 = 6.301338 ms.",
      "The resistor dissipates energy during redistribution and no leakage is included. A real capacitor may need many internal RC branches; these numbers describe only the explicitly given two-capacitor model."
    ],
    "formula": "V∞ = CA vA(0+)/(C0 + CA); τ = RA C0CA/(C0 + CA)",
    "inputs": [
      "Main capacitance C0: 1 μF from X to ground",
      "Absorption branch: 100 kΩ from X to A; 0.10 μF from A to ground",
      "Prepared main state: vX(0+) = 0 V",
      "Prepared internal state: vA(0+) = +10 V",
      "External terminal for t > 0: Open circuit"
    ],
    "sources": [
      {
        "title": "Analog Devices: Ask The Applications Engineer—21, Capacitance And Capacitors",
        "url": "https://www.analog.com/en/resources/analog-dialogue/articles/capacitance-and-capacitors.html",
        "supports": "Dielectric absorption can cause terminal-voltage recovery after discharge and opening the terminal. The original problem specifies a single internal series RC branch and exact prepared states; it does not claim one branch predicts an actual capacitor. Charge and energy are checked independently."
      }
    ]
  },
  {
    "slug": "expansion-v6-switched-capacitor-finite-reservoir",
    "title": "Keep the individual charge-transfer events",
    "version": 1,
    "signature": "78814dc4",
    "method": "periodic",
    "difficulty": "Hard",
    "trace": [
      "During a hold, α = e^(−T/(RL CO)) = e^(−0.1) = 0.904837418 and v− = αv+. The load sees an exponential, not a flat output voltage.",
      "Charge conservation at sharing gives (CO + CF)v+ = CO v− + CF × 3. Substituting v− = αv+ yields v+ = 3CF/(CO + CF − COα) = 1.537180 V.",
      "The pre-transfer minimum is v− = αv+ = 1.390898 V. The post-transfer recurrence has multiplier αCO/(CO + CF) = 0.822579 < 1, so it converges to this unique steady state.",
      "The load removes charge CO(v+ − v−) per hold interval. Its mean current is therefore CO(v+ − v−)/T = 14.628201 μA. Equivalently integrate v+ e^(−t/(RL CO))/RL from 0 to T and divide by T.",
      "A continuous equivalent resistance 1/(CF f) is a useful limiting approximation, but it is not the requested exact finite-reservoir event model. Lost charge-sharing energy is dissipated in the stipulated passive transfer path."
    ],
    "formula": "v− = αv+; (CO + CF)v+ = COv− + CFVIN; Iavg = CO(v+ − v−)/T",
    "inputs": [
      "Refreshed flying capacitor: 10 nF initially at +3 V at every event",
      "Output reservoir: 100 nF to ground",
      "Load during hold: 100 kΩ to ground",
      "Hold time / event period: 1 ms",
      "Sharing model: Complete charge sharing, negligible transfer duration"
    ],
    "sources": [
      {
        "title": "Analog Devices University Program: Activity, The Switched Capacitor",
        "url": "https://wiki.analog.com/university/courses/electronics/electronics-lab-19",
        "supports": "Switched capacitors transfer charge and can approximate resistance when clocked between nodes. The original question deliberately retains a finite output reservoir and resistive inter-event decay rather than assuming two ideal voltage sources or using only the continuous equivalent resistance."
      }
    ]
  },
  {
    "slug": "expansion-v6-bjt-complementary-crossover-dead-zone",
    "title": "Find the dead zone in a push-pull follower",
    "version": 1,
    "signature": "cd637199",
    "method": "followerLimits",
    "difficulty": "Easy",
    "trace": [
      "At VIN = +0.40 V, VOUT = 0 gives NPN VBE = +0.40 V and PNP VEB = −0.40 V. Neither reaches the supplied +0.65 V conduction boundary, so both remain off and VOUT = 0 V.",
      "At VIN = −0.90 V, the both-off trial would give PNP VEB = +0.90 V, which violates its off condition. The PNP therefore conducts, holding VOUT − VIN = 0.65 V. Thus VOUT = −0.90 + 0.65 = −0.25 V.",
      "The load current at the second point is 0.25 mA from ground into the output; the PNP carries it toward the −5 V rail. The NPN VBE is −0.65 V and it is off. The conducting PNP has VC = −5 V < VB = −0.90 V, consistent with forward-active headroom.",
      "Under this hard-drop model the interval −0.65 V ≤ VIN ≤ +0.65 V produces zero output. Real complementary stages have smooth junction laws and usually add controlled Class AB bias or feedback to reduce crossover distortion."
    ],
    "formula": "VOUT = 0 for |VIN| ≤ VD; VOUT = VIN − VD for VIN > VD; VOUT = VIN + VD for VIN < −VD",
    "inputs": [
      "Collector supplies: NPN +5 V; PNP −5 V",
      "Shared base drive / load: Both bases at VIN; RL = 1 kΩ to ground",
      "Conducting junction drops: NPN VBE = 0.65 V; PNP VEB = 0.65 V",
      "Test inputs: +0.40 V and −0.90 V; no bias spread"
    ],
    "sources": [
      {
        "title": "Analog Devices: Activity, Amplifier Output Stages",
        "url": "https://wiki.analog.com/university/courses/electronics/electronics-lab-13a",
        "supports": "Primary teaching material for complementary emitter-follower output stages, the unbiased crossover dead zone, and Class AB bias. The new exercise separately supplies its hard 0.65 V piecewise model."
      }
    ]
  },
  {
    "slug": "expansion-v6-bjt-common-base-source-loading",
    "title": "Drive an amplifier through its emitter",
    "version": 1,
    "signature": "7503f434",
    "method": "bjtSignal",
    "difficulty": "Medium",
    "trace": [
      "At the grounded base, vbe = −ve. Current entering the emitter is ie,in = ve/rπ − gm vbe = (1/rπ + gm)ve. Therefore Rin = 1/(0.0004 + 0.040) S = 24.752475 Ω.",
      "The loaded emitter signal is ve/vs = Rin/(RS + Rin) = 0.497512438. Dropping the finite rπ term would change this loading slightly.",
      "The collector sees RC ∥ RL = 2 kΩ. Since incremental collector current is ic = −gm ve, collector-node KCL gives vc = +gm(RC ∥ RL)ve. The emitter-to-collector gain is +80 V/V.",
      "Combining the two factors gives Avs = 80 × 0.497512438 = +39.800995 V/V. The positive sign distinguishes common-base voltage amplification from a common-emitter stage. The infinitesimal model applies around the stated forward-active bias, where VC > VB."
    ],
    "formula": "Rin = 1/(gm + 1/rπ); Avs = gm(RC ∥ RL) Rin/(RS + Rin)",
    "inputs": [
      "Small-signal parameters: gm = 40 mS; rπ = 2.5 kΩ; ro = infinity",
      "Emitter source resistance: RS = 25 Ω; base at AC ground",
      "Collector resistances: RC = RL = 4 kΩ; RL AC-coupled",
      "Established DC bias: VE = 0 V; VB = 0.70 V; VC = 1.00 V"
    ],
    "sources": [
      {
        "title": "MIT 6.012: Common Base and Common Gate Amplifiers, Lecture 19",
        "url": "https://web.mit.edu/course/6/6.012/SPR98/www/lectures/S98_Lecture19.pdf",
        "supports": "Primary common-base hybrid-pi analysis, emitter input resistance and noninverting voltage amplification. The authored calculation retains finite r-pi and explicitly includes signal-source loading."
      }
    ]
  },
  {
    "slug": "expansion-v6-bjt-schottky-clamp-node-currents",
    "title": "Where does excess base drive go in a clamp?",
    "version": 1,
    "signature": "f80bd906",
    "method": "bjtSwitch",
    "difficulty": "Medium",
    "trace": [
      "With VE = 0 and VBE = 0.70 V, VB = 0.70 V. The conducting Schottky clamp sets VC = 0.70 − 0.30 = 0.40 V.",
      "The base-resistor current is (3.30 − 0.70)/2.60 kΩ = 1.00 mA. The collector-resistor current is (5.00 − 0.40)/2.30 kΩ = 2.00 mA.",
      "Base KCL gives 1.00 mA = IB + ID. Collector KCL gives IC = 2.00 mA + ID. Substituting IC = 49IB yields 50IB = 3.00 mA, so IB = 0.060 mA, ID = 0.940 mA, and IC = 2.940 mA.",
      "ID is positive, verifying the assumed clamp branch. The transistor collector current is larger than the load-resistor current because the clamp adds current into the collector. Multiplying all the driver's current by 49 would incorrectly count diverted drive as base-terminal current.",
      "The lower-drop Schottky path redirects excess base drive before deep saturation in this exercise model. Its mildly forward-biased base-collector junction is not strict forward-active operation. A physical switching design also checks actual device curves and charge-storage dynamics."
    ],
    "formula": "IRB = IB + ID; IC = IRC + ID; IC = βclamp IB; IB = (IRB + IRC)/(βclamp + 1)",
    "inputs": [
      "Driver / base resistor: +3.30 V / 2.60 kΩ",
      "Collector supply / resistor: +5.00 V / 2.30 kΩ",
      "Supplied transistor model: VBE = 0.70 V; IC/IB = 49 at the clamped point",
      "Schottky orientation / drop: Base anode → collector cathode; VF = 0.30 V"
    ],
    "sources": [
      {
        "title": "Texas Instruments: Advanced Schottky Logic Families",
        "url": "https://www.ti.com/lit/pdf/sdaa010",
        "supports": "Primary description of Schottky base-collector clamping, diverting excess base drive, and reducing deep-saturation stored charge. The exercise uses its own static empirical collector/base ratio at the clamped operating point, not an extrapolated strict forward-active model."
      }
    ]
  },
  {
    "slug": "expansion-v6-bjt-degenerated-large-signal-steering",
    "title": "Linearize a differential pair without linearizing its junctions",
    "version": 1,
    "signature": "ec54d4ef",
    "method": "differential",
    "difficulty": "Hard",
    "trace": [
      "Let ΔI = IC1 − IC2. The common tail node cancels from emitter-voltage subtraction, giving vid = VT ln(IC1/IC2) + RE ΔI. Since IC1,2 = (IT ± ΔI)/2, solve 0.100 = 0.025 ln[(0.002 + ΔI)/(0.002 − ΔI)] + 200ΔI, with currents in A and |ΔI| < IT.",
      "The left-to-right voltage function is strictly increasing over the physical current interval, so there is one root. It gives ΔI = 0.443611390 mA, IC1 = 1.221805695 mA, and IC2 = 0.778194305 mA.",
      "The collector subtraction has the specified positive sign: vod = RC(IC1 − IC2) = +0.887222780 V. The collector voltages are 2.556389 V and 3.443611 V, both above their bases at 1.55 V and 1.45 V, confirming forward-active collector headroom.",
      "Because dIC1/dΔI = +1/2 and dIC2/dΔI = −1/2, dvid/dΔI = RE + (VT/2)(1/IC1 + 1/IC2). Thus the local gain is RC/[RE + (VT/2)(1/IC1 + 1/IC2)] = +8.838076404 V/V.",
      "The emitter resistors absorb most of the differential voltage and broaden the useful input range. The local derivative at this nonzero bias is distinct from vod/vid and from the undegenerated pair's small-input gain."
    ],
    "formula": "vid = VT ln(IC1/IC2) + RE(IC1 − IC2); Ad,local = RC/[RE + (VT/2)(1/IC1 + 1/IC2)]",
    "inputs": [
      "Tail / emitter resistors: 2.00 mA / RE1 = RE2 = 200 Ω",
      "Collector resistors / rail: RC1 = RC2 = 2.00 kΩ / +5.00 V",
      "Junction law: Matched IC = IS exp(VBE/VT); VT = 25.00 mV; β = infinity",
      "Input / output references: vid = VB1 − VB2 = +100 mV; vod = VC2 − VC1"
    ],
    "sources": [
      {
        "title": "Analog Devices: Differential Amplifiers, Chapter 12",
        "url": "https://wiki.analog.com/university/courses/electronics/text/chapter-12",
        "supports": "Primary explanation of emitter-degenerated differential pairs and increased input linearity. The new problem independently solves a nonzero-input exponential current ratio and differentiates it locally rather than quoting a small-signal zero-input result."
      }
    ]
  },
  {
    "slug": "expansion-v6-mos-off-state-body-diode-polarity",
    "title": "An off MOSFET can still conduct backward",
    "version": 1,
    "signature": "3874d388",
    "method": "bodyDiode",
    "difficulty": "Easy",
    "trace": [
      "The channel being off does not remove the body diode. A diode-off trial would give VS − VD = 5 V, inconsistent with its supplied 0.70 V forward boundary.",
      "The diode conducts and clamps VD = VS − 0.70 = −0.70 V. The resistor carries [−0.70 − (−5.00)]/1.00 kΩ = 4.30 mA from the drain node toward the −5 V supply.",
      "Diode current arrives at the drain from the source, so the total drain-to-source current is ID = −4.30 mA. A positive answer would reverse the requested terminal reference.",
      "At the clamped node, the greatest gate-to-lower-channel-terminal voltage is 0.70 V, below the supplied 2.00 V threshold. Thus the off-channel assumption is consistent; all device current in this model is diode current."
    ],
    "formula": "VD = VS − VF; ID = −[VD − Vnegative]/R",
    "inputs": [
      "Gate / labelled source / body: All held at 0 V",
      "Drain pull-down: 1.00 kΩ to −5.00 V",
      "Body diode: Source anode; drain cathode; conducting drop 0.70 V",
      "Channel / current sign: Hard-off threshold 2.00 V; ID positive drain → source"
    ],
    "sources": [
      {
        "title": "Nexperia: MOSFET Engineering FAQs",
        "url": "https://www.nexperia.com/products/mosfets.html",
        "supports": "Primary vendor discussion of intrinsic body-diode reverse conduction and the instantaneous voltage-times-current loss during transitions. The authored diode-polarity and simultaneous-ramp models state all hypothetical values explicitly."
      }
    ]
  },
  {
    "slug": "expansion-v6-mos-resistive-switching-overlap-integral",
    "title": "Integrate the overlap instead of assuming a triangle",
    "version": 1,
    "signature": "b6dae295",
    "method": "integration",
    "difficulty": "Medium",
    "trace": [
      "During turn-on, VDS = 24(1 − u) V and ID = 3u A. Their product is p = 72u(1 − u) W, a quadratic rather than a triangular power waveform.",
      "The dimensionless integral is ∫₀¹u(1 − u)du = 1/2 − 1/3 = 1/6. Therefore Eon = (24 V)(3 A)(20 ns)/6 = 240 nJ.",
      "Turn-off reverses both ramps, producing the same normalized product over a 30 ns interval. Eoff = (24 V)(3 A)(30 ns)/6 = 360 nJ.",
      "Each full switching cycle absorbs 600 nJ, so mean overlap power is (600 nJ)(200 kHz) = 0.120 W = 120 mW. A factor of 1/2 would apply to a different waveform assumption with constant current during a linear voltage fall; it overestimates these specified resistive-load ramps by a factor of three."
    ],
    "formula": "Etransition = ∫VDS ID dt = Vrail Ion tsw/6; Poverlap = fsw(Eon + Eoff)",
    "inputs": [
      "Supply / load: +24.00 V / 8.00 Ω, resistive",
      "Turn-on duration / endpoints: 20.0 ns; VDS 24 → 0 V, ID 0 → 3 A, simultaneously linear",
      "Turn-off duration / endpoints: 30.0 ns; VDS 0 → 24 V, ID 3 → 0 A, simultaneously linear",
      "Switching cycles: 200 kHz; one on and off transition per cycle"
    ],
    "sources": [
      {
        "title": "Nexperia: MOSFET Engineering FAQs",
        "url": "https://www.nexperia.com/products/mosfets.html",
        "supports": "Primary vendor discussion of intrinsic body-diode reverse conduction and the instantaneous voltage-times-current loss during transitions. The authored diode-polarity and simultaneous-ramp models state all hypothetical values explicitly."
      },
      {
        "title": "Texas Instruments: How to Drive Resistive, Inductive, Capacitive, and Lighting Loads",
        "url": "https://www.ti.com/lit/an/slvae30e/slvae30e.pdf",
        "supports": "Primary analysis of waveform overlap for resistive loads and inductive demagnetization with clamps, including continuing supply energy for across-switch clamping. The new low-side circuit uses an explicitly external TVS absorber and independently derives the lossless-coil voltage and energy balance."
      }
    ]
  },
  {
    "slug": "expansion-v6-mos-external-clamp-inductive-energy",
    "title": "The clamp absorbs more than the initial coil energy",
    "version": 1,
    "signature": "39049f7b",
    "method": "integration",
    "difficulty": "Medium",
    "trace": [
      "The current-reference voltage across the inductor is 12 − 48 = −36 V, so dI/dt = −36/(2.00 mH) = −18,000 A/s. The current declines linearly to zero in 3/18,000 s = 166.666667 µs.",
      "The total charge through the loop during decay is Q = I0 tend/2 = 250 µC. Thus the external clamp absorbs ETVS = (48 V)(250 µC) = 12.00 mJ.",
      "The still-connected supply delivers ESUPPLY = (12 V)(250 µC) = +3.00 mJ. The initial magnetic energy is EL,initial = LI0²/2 = 9.00 mJ, and the final magnetic energy is zero.",
      "Energy balance is 9.00 mJ of initial magnetic energy plus 3.00 mJ supplied during discharge equals 12.00 mJ absorbed by the TVS. Rating the across-switch clamp only for the initial coil energy would miss the continuing supply contribution in this topology.",
      "The time and energy apply to the supplied ideal constant-voltage clamp until extinction. A real design checks TVS pulse energy, peak power, tolerances, winding resistance, and MOSFET voltage margin separately."
    ],
    "formula": "tend = LI0/(Vclamp − Vsupply); Q = I0 tend/2; ETVS = Vclamp Q; ESUPPLY = Vsupply Q",
    "inputs": [
      "Coil / initial current: L = 2.00 mH; I0 = 3.00 A toward drain",
      "Connected supply: +12.00 V throughout the decay",
      "External TVS clamp: Cathode at drain, anode at ground; VD = +48.00 V while absorbing",
      "Switch state: NMOS channel off; no avalanche or other losses"
    ],
    "sources": [
      {
        "title": "Texas Instruments: How to Drive Resistive, Inductive, Capacitive, and Lighting Loads",
        "url": "https://www.ti.com/lit/an/slvae30e/slvae30e.pdf",
        "supports": "Primary analysis of waveform overlap for resistive loads and inductive demagnetization with clamps, including continuing supply energy for across-switch clamping. The new low-side circuit uses an explicitly external TVS absorber and independently derives the lossless-coil voltage and energy balance."
      }
    ]
  },
  {
    "slug": "expansion-v6-mos-cascode-grounded-body-headroom",
    "title": "Body effect changes the cascode bias budget",
    "version": 1,
    "signature": "da98170d",
    "method": "mosBody",
    "difficulty": "Hard",
    "trace": [
      "M1 has VSB1 = 0 and VOV1 = 0.80 − 0.40 = 0.40 V. It sets ID = (2.00 mA/V²)/2 × (0.40 V)² = 0.160 mA = 160 µA. Identical k and equal saturation current require the conducting M2 overdrive to also equal 0.40 V.",
      "At VG2 = 1.50 V, M2 therefore satisfies 1.50 − VX − {0.40 + 0.50[√(0.60 + VX) − √0.60]} = 0.40. The unique nonnegative root is VX = 0.550898619 V. Its threshold is 0.549101381 V. M1 has VDS1 = VX ≥ 0.40 V, and M2 at the initial output has VDS2 = 2.00 − VX ≥ 0.40 V, so both region assumptions are consistent.",
      "With fixed gate biases the minimum output is M2's saturation boundary: VOUT,min = VX + VOV2 = 0.950898619 V. M1 remains saturated there because VX does not change in this zero-CLM model.",
      "The minimum upper-gate bias occurs when VX is reduced to M1's boundary, VX = 0.40 V. At that node M2's threshold is 0.40 + 0.50(√1.00 − √0.60) = 0.512701665 V. Hence VG2,min = VX + VTH2 + VOV2 = 1.312701665 V. With output at 2.00 V, M2 has ample saturation headroom.",
      "Ignoring body effect would underestimate the upper-gate requirement and change the intermediate-node solution. These boundaries concern DC region compliance in the specified square-law model, not the cascode's output resistance or a real device's safe operating area."
    ],
    "formula": "ID = (k/2)VOV1²; VG2 = VX + VTH(VX) + VOV2; VOUT,min = VX + VOV2; VG2,min = VOV1 + VTH(VOV1) + VOV2",
    "inputs": [
      "Gate biases / initial output: VG1 = 0.80 V; VG2 = 1.50 V; VOUT = 2.00 V",
      "Grounded bodies / node: VB1 = VB2 = 0 V; VX = M1 drain = M2 source",
      "Threshold parameters: VTH0 = 0.40 V; γ = 0.50 V^(1/2); 2φF = 0.60 V",
      "Square-law convention: k = 2.00 mA/V²; ID = (k/2)VOV²; no CLM"
    ],
    "sources": [
      {
        "title": "MIT 6.012: MOSFET Body Effect, Lecture 9",
        "url": "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/4dd0f37dcb3a9617b66b82a33894ef73_MIT6_012S09_lec09.pdf",
        "supports": "Primary square-root threshold body-effect relation. The authored cascode combines that relation with identical-device saturation current and independently verifies both voltage-compliance boundaries."
      }
    ]
  },
  {
    "slug": "expansion-v6-interleaved-memory-byte-address",
    "title": "Split a byte address across interleaved memory banks",
    "version": 1,
    "signature": "78732140",
    "method": "address",
    "difficulty": "Easy",
    "trace": [
      "Hexadecimal 0x12AE equals decimal 4782. Dividing by four gives global word address 1195 with byte remainder 2.",
      "Consecutive word addresses cycle through four banks. Since 1195 = 4×298 + 3, the byte belongs to bank 3 at row 298, offset 2.",
      "Equivalently, byte-address bits [1:0] select the byte, bits [3:2] select the bank, and the remaining bits select the row. The low hexadecimal digit E = 1110₂ splits into bank bits 11 and byte bits 10.",
      "Reconstructing the byte address gives ((298×4 + 3)×4 + 2) = 4782, confirming the mapping. Selecting a bank directly from the lowest two BYTE-address bits would confuse the byte offset with the interleaved word index."
    ],
    "formula": "byte = address mod 4; word = floor(address/4); bank = word mod 4; row = floor(word/4)",
    "inputs": [
      "Banks: 4 banks, numbered 0…3; consecutive words interleaved",
      "Per-bank storage: 1024 rows × 4 bytes per row",
      "Address: 0x12AE, hexadecimal byte address",
      "Numbering: Bank, row and byte offset all start at zero"
    ],
    "sources": [
      {
        "title": "UC Davis, Norman Matloff: Memory Interleaving",
        "url": "https://heather.cs.ucdavis.edu/matloff/public_html/154A/PLN/Interleaving.pdf",
        "supports": "Low-order interleaving distributes consecutive word addresses across banks. For byte-addressable 32-bit words, the lowest two address bits first select a byte within the word. Ohm defines its own four-bank, 1024-row SRAM layout and checks its address reconstruction independently."
      }
    ]
  },
  {
    "slug": "expansion-v6-burst-payload-throughput",
    "title": "Measure useful bandwidth through burst overhead and stalls",
    "version": 1,
    "signature": "3fca23f1",
    "method": "throughput",
    "difficulty": "Medium",
    "trace": [
      "Each transaction uses 2 + 16 + 3 + 1 = 22 cycles. The clock period is 1/200 MHz = 5 ns, so eight transactions occupy 176 cycles or 880 ns, including the last completion.",
      "Each transaction carries 16×64 = 1024 payload bits. Eight carry 8192 bits, so useful payload rate is 8192/(880×10⁻⁹) = 9.30909×10⁹ bits/s = 9.30909 Gbits/s.",
      "The fraction of elapsed cycles with an accepted payload beat is 16/22. Multiplying by 100 gives 72.7273%. Counting valid-high stalled cycles as transfers would overstate this rate.",
      "The physical single-edge ceiling is 64×200 MHz = 12.8 Gbits/s. Multiplying by 16/22 agrees with the useful rate. A link that overlaps commands, data or completions would require a different schedule calculation."
    ],
    "formula": "cycles/transaction = command + accepted beats + stalls + completion; useful rate = payload bits / elapsed time",
    "inputs": [
      "Clock and payload width: 200 MHz, single-edge; 64 payload bits per accepted beat",
      "Command phase: 2 cycles per transaction; no payload",
      "Data phase: 16 accepted beats + 3 stalled cycles per transaction",
      "Completion phase: 1 cycle per transaction, including the final transaction",
      "Batch: 8 consecutive transactions; phases never overlap"
    ],
    "sources": [
      {
        "title": "Arm: Introduction to AXI Protocol, Understanding the AXI Interface",
        "url": "https://developer.arm.com/community/arm-community-blogs/b/soc-design-and-simulation-blog/posts/introduction-to-axi-protocol-understanding-the-axi-interface",
        "supports": "Synchronous ready/valid transfer requires both sides to assert their signals. Commands, data and responses may be separate channels. Ohm's explicitly serialized custom schedule is not an AXI timing requirement; its throughput is derived from the given accepted beats, stalled cycles and elapsed phases."
      }
    ]
  },
  {
    "slug": "expansion-v6-synchronizer-safe-phase-latency",
    "title": "Bound synchronization latency for safe input phases",
    "version": 1,
    "signature": "3012f2cf",
    "method": "cdc",
    "difficulty": "Medium",
    "trace": [
      "D1 changes after the hold interval of the t = 0 edge and at least 0.75 ns before the t = 5 ns edge. Every supplied phase therefore allows Q1 to capture 1 at t = 5 ns without a setup/hold violation.",
      "Q1 becomes 1 at 5.35 ns and D2 becomes 1 at 5.60 ns. Q2 captures it at t = 10 ns, then becomes 1 at 10.35 ns. It cannot capture the new value at the t = 5 ns launch edge.",
      "Latency is 10.35 − φ ns. Its minimum occurs at φ = 4.25 ns and is 6.10 ns; its maximum occurs at φ = 0.25 ns and is 10.10 ns.",
      "The interstage setup deadline is 10 − 0.20 = 9.80 ns. D2 arrives at 5.60 ns, leaving 4.20 ns of setup slack. The 0.60 ns launch-to-D2 delay also exceeds the 0.10 ns hold requirement.",
      "These finite latency bounds rely on the explicitly restricted safe phases and exact delay model. An unrestricted asynchronous transition can violate the first aperture; metastability resolution is probabilistic and does not inherit this deterministic upper bound."
    ],
    "formula": "Q2 transition = 2T + tCQ; latency = 2T + tCQ − φ; setup slack = T − tCQ − twire − tsetup",
    "inputs": [
      "Destination edges: 0, 5, 10… ns; no skew",
      "Both clock-to-Q delays: 0.35 ns exactly",
      "Both setup / hold requirements: 0.20 ns / 0.10 ns",
      "Q1→D2 wire delay: 0.25 ns exactly",
      "One stable input transition: At D1: φ ∈ [0.25, 4.25] ns after edge 0"
    ],
    "sources": [
      {
        "title": "MIT 6.004: Digital Study Guide, Flip-Flop Timing",
        "url": "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2009/8aab78cf087999514dd6e0b73c6ab43e_MIT6_004s09_study_digital_guide.pdf",
        "supports": "Flip-flop setup and hold define input stability requirements, while clock-to-Q and interstage propagation determine ordinary next-edge timing. The original latency exercise supplies exact delays, zero skew and input phases safely outside all relevant apertures; it does not derive a deterministic metastability bound."
      }
    ]
  },
  {
    "slug": "expansion-v6-cdc-system-mtbf-budget",
    "title": "Combine crossing failure rates before quoting system MTBF",
    "version": 1,
    "signature": "2d3a4f40",
    "method": "cdc",
    "difficulty": "Hard",
    "trace": [
      "T0 fclk fdata = 10⁻¹² × 250×10⁶ × 20×10⁶ = 5000 s⁻¹. Tres/τ = 1.20 ns / 0.040 ns = 30.",
      "The current single-crossing MTBF is exp(30)/5000 = 2.137294916×10⁹ s. Its failure rate is the reciprocal of that value.",
      "The 64 independent crossing failure rates add, so system MTBF = MTBFcross/64 = 3.339523307×10⁷ s. Quoting the much larger single-crossing value for the entire system would omit its other failure opportunities.",
      "The system target requires exp(Tres/τ)/(64×5000) ≥ 10⁹ s. Thus Tres ≥ τ ln(64×5000×10⁹) = 0.040 ns × ln(3.2×10¹⁴) = 1.335973684 ns.",
      "This is a mean interval under the supplied empirical and statistical assumptions, not a deterministic lifetime or latency guarantee. Real CDC signoff must use characterized corner-dependent constants, actual transition rates, implemented resolution paths and the appropriate system failure model."
    ],
    "formula": "λsystem = Σ(1/MTBFi); identical MTBFsystem = MTBFcross/N; required Tres = τ ln(N T0 fclk fdata MTBFtarget)",
    "inputs": [
      "One-crossing model: MTBFcross = exp(Tres/τ)/(T0 fclk fdata)",
      "Fitted constants: τ = 40 ps; T0 = 1 ps",
      "Clock / transition rates: fclk = 250 MHz; fdata = 20 million transitions/s",
      "Current resolution time: Tres = 1.20 ns",
      "System: 64 independent identical crossing failure processes",
      "Target system MTBF: 10⁹ s; all crossings use the same revised Tres"
    ],
    "sources": [
      {
        "title": "Altera / Intel AN 42: Metastability in Altera Devices",
        "url": "https://cdrdv2-public.intel.com/653636/an042.pdf",
        "supports": "The fitted MTBF model is exponential in allowed resolution time and inversely proportional to clock and data transition rates; constants are technology-dependent. Ohm reparameterizes C2 as 1/τ and C1 as T0, explicitly supplies hypothetical constants, and separately defines independent Poisson failure-rate addition for its original 64-crossing system."
      }
    ]
  },
  {
    "slug": "expansion-v6-hdl-masked-parity-error",
    "title": "Check even parity only over enabled data lanes",
    "version": 1,
    "signature": "802cf932",
    "method": "hdlLogic",
    "difficulty": "Easy",
    "trace": [
      "The participating data bits are a & ma and b & mb. A zero mask suppresses the corresponding data value.",
      "XORing those two qualified bits with p yields the odd-parity flag, so y = (a & ma) ^ (b & mb) ^ p reports a failed even-parity check.",
      "When both masks are zero, the included word consists only of p and the flag equals p. Ignoring p in that case would contradict the specified format.",
      "Parity detects an odd number of participating-bit errors relative to a correctly formed word, but does not identify or correct an erroneous bit and can miss even numbers of bit errors. This assignment implements only the supplied known-bit check."
    ],
    "formula": "error = XOR of included data bits and received even-parity bit",
    "inputs": [
      "Inputs: a, b, ma, mb, p; one known bit each",
      "Mask policy: ma includes a; mb includes b; excluded data contributes zero",
      "Received check bit: p always participates",
      "Output: y = 1 exactly when the included word fails even parity"
    ],
    "sources": [
      {
        "title": "Texas Instruments CD74HC280: Odd/Even Parity Generator/Checker",
        "url": "https://www.ti.com/lit/ds/symlink/cd74hc280.pdf",
        "supports": "Even and odd parity classify whether the number of asserted participating bits is even or odd. The original HDL check defines a custom mask over two data lanes and always includes the received check bit; its independent expected model counts participating ones."
      },
      {
        "title": "Cornell ECE 4750: Verilog Hardware Description Language Tutorial",
        "url": "https://www.csl.cornell.edu/courses/ece5745/handouts/ece4750-tut4-verilog.pdf",
        "supports": "Continuous assignments and scalar Boolean and conditional operators provide combinational logic. The four new HDL functions are original fully specified known-bit exercises, with expected rows derived independently of their reference assignments."
      }
    ]
  },
  {
    "slug": "expansion-v6-hdl-round-nearest-even-increment",
    "title": "Round a retained binary value to nearest, ties to even",
    "version": 1,
    "signature": "03dc4065",
    "method": "hdlLogic",
    "difficulty": "Medium",
    "trace": [
      "A finite fractional tail with g = 0 is less than 1/2, so all such cases keep K and force y = 0.",
      "When g = 1 and either r or s is 1, the tail exceeds 1/2 and the nearest integer is K + 1.",
      "The exact tie has g = 1, r = 0 and s = 0. If l = 1, K is odd and incrementing makes the rounded result even. If l = 0, keeping K already gives the even result.",
      "Combining strict-above-half and odd-tie cases gives y = g & (r | s | l). Using g alone instead implements ties upward, introducing a different rule for an even K."
    ],
    "formula": "increment = guard AND (round OR sticky OR retained LSB)",
    "inputs": [
      "Inputs: l, g, r, s; one bit each",
      "Retained LSB: l = K mod 2",
      "Discarded bits: g: weight 1/2; r: weight 1/4; s: OR of all lower bits",
      "Rounding mode: Nearest integer; exact ties choose even",
      "Output: y = increment K by one"
    ],
    "sources": [
      {
        "title": "Microchip AN575: IEEE 754 Compliant Floating Point Routines",
        "url": "https://www.microchip.com/content/dam/mchp/documents/MCU08/ApplicationNotes/ApplicationNotes/00575.pdf",
        "supports": "Nearest rounding treats an exact half-way case by choosing an even retained least significant bit. Lower discarded bits distinguish a true tie from a greater-than-half value. Ohm's original exercise is an unsigned fixed-point increment flag; independent tests compare all finite fractional tails against exact rational nearest-even decisions."
      },
      {
        "title": "Cornell ECE 4750: Verilog Hardware Description Language Tutorial",
        "url": "https://www.csl.cornell.edu/courses/ece5745/handouts/ece4750-tut4-verilog.pdf",
        "supports": "Continuous assignments and scalar Boolean and conditional operators provide combinational logic. The four new HDL functions are original fully specified known-bit exercises, with expected rows derived independently of their reference assignments."
      }
    ]
  },
  {
    "slug": "expansion-v6-hdl-round-robin-current-grant",
    "title": "Use saved round-robin priority only when requests compete",
    "version": 1,
    "signature": "821c6478",
    "method": "hdlLogic",
    "difficulty": "Medium",
    "trace": [
      "The factors en and r0 ensure that a disabled arbiter or absent client-0 request cannot grant client 0.",
      "If r1 = 0, client 0 is the sole requester and must win even when prefer1 = 1. If r1 = 1, client 0 wins only when prefer1 = 0.",
      "Those alternatives give ~r1 | ~prefer1, so y = en & r0 & (~r1 | ~prefer1). An equivalent form is en & r0 & ~(r1 & prefer1).",
      "This expression uses the supplied priority without changing it. Alternation under sustained accepted competing requests depends on the separately specified state update; failed or stalled acceptance must not consume a turn under this custom policy."
    ],
    "formula": "grant0 = enabled AND request0 AND NOT(request1 AND priority1)",
    "inputs": [
      "Inputs: en, r0, r1, prefer1; one known bit each",
      "Disable: en = 0 suppresses all grants",
      "Competition: prefer1 = 1 favors client 1; prefer1 = 0 favors client 0",
      "Sole request: Always wins when enabled, regardless of saved priority",
      "Output: y = current grant to client 0; state update is separate"
    ],
    "sources": [
      {
        "title": "AMD UG586: Round-Robin",
        "url": "https://docs.amd.com/r/en-US/ug586_7Series_MIS/Round-Robin",
        "supports": "Round-robin selection may depend on the last serviced request to favor another competing requester. Ohm explicitly defines a custom two-requester current-grant function and priority update on actual acceptance; passing a combinational truth table does not establish the behavior of the separate sequential state update."
      },
      {
        "title": "Cornell ECE 4750: Verilog Hardware Description Language Tutorial",
        "url": "https://www.csl.cornell.edu/courses/ece5745/handouts/ece4750-tut4-verilog.pdf",
        "supports": "Continuous assignments and scalar Boolean and conditional operators provide combinational logic. The four new HDL functions are original fully specified known-bit exercises, with expected rows derived independently of their reference assignments."
      }
    ]
  },
  {
    "slug": "expansion-v6-hdl-two-bit-carry-lookahead",
    "title": "Collapse a two-bit ripple carry into a lookahead flag",
    "version": 1,
    "signature": "4e322870",
    "method": "hdlLogic",
    "difficulty": "Hard",
    "trace": [
      "At the lower bit, both asserted inputs generate a carry: g0 = a0 & b0. If exactly one is asserted, p0 = a0 ^ b0 propagates ci, so c1 = g0 | (p0 & ci).",
      "The upper bit follows the same rule: y = g1 | (p1 & c1), where g1 = a1 & b1 and p1 = a1 ^ b1.",
      "Substituting c1 yields y = g1 | (p1 & g0) | (p1 & p0 & ci). Replacing each generate and propagate term with its input definition gives the reference statement.",
      "For example, A = 3, B = 0 and ci = 1 produce exact sum 4 and y = 1 through both propagation stages. A = 1, B = 1 and ci = 0 produce sum 2 and y = 0 even though the lower bit generates c1.",
      "Exhausting all 32 operand/carry patterns checks this known-bit carry flag against exact unsigned arithmetic. Physical critical-path improvement depends on synthesized gates and layout; the truth table alone does not promise a speedup."
    ],
    "formula": "gᵢ = aᵢbᵢ; pᵢ = aᵢ XOR bᵢ; carry-out = g1 OR p1g0 OR p1p0ci",
    "inputs": [
      "Inputs: a1, a0, b1, b0, ci; one known bit each",
      "Operand values: A = 2a1 + a0; B = 2b1 + b0; both unsigned",
      "Incoming carry: ci adds zero or one to the exact sum",
      "Output: y = carry beyond the retained two-bit result",
      "Workbench: One scalar assign statement; no arithmetic or vector syntax"
    ],
    "sources": [
      {
        "title": "University of Wisconsin ECE 552: Carry Lookahead Supplement",
        "url": "https://ece552.ece.wisc.edu/disc/Carrylookahead_supp4.pdf",
        "supports": "Generate and propagate terms expand an adder's carry recursion into lookahead equations. The original scalar two-bit task defines XOR-propagate explicitly and tests the carry-out against exact integer addition for all operand and carry-in combinations."
      },
      {
        "title": "Cornell ECE 4750: Verilog Hardware Description Language Tutorial",
        "url": "https://www.csl.cornell.edu/courses/ece5745/handouts/ece4750-tut4-verilog.pdf",
        "supports": "Continuous assignments and scalar Boolean and conditional operators provide combinational logic. The four new HDL functions are original fully specified known-bit exercises, with expected rows derived independently of their reference assignments."
      }
    ]
  }
];

export function editorialContentSignature(problem){let h=2166136261;const input=JSON.stringify([problem.title,problem.prompt,problem.task,problem.given,problem.type,problem.parts?.map(({id,label,unit})=>({id,label,unit}))??null]);for(let i=0;i<input.length;i++){h^=input.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0');}
