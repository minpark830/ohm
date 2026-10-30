// Case-specific alternate check, discriminating pitfall and practical consequence.
export const v7EditorialDeepNotes = {
  "expansion-v7-difference-amplifier-ratio-mismatch": [
    "An independent check applies equal unit voltages to both inputs and then opposite half-unit voltages while solving the two node KCL equations and N = P. Those two tests recover ACM and AD directly and reproduce the specified mixed-input output by superposition.",
    "The mismatch is in one explicitly specified resistor ratio; the ideal op amp itself still has zero common-mode error. Assuming perfect matched-network rejection, quoting a generic four-resistor worst-case bound, or treating VD as a change on only V2 would each answer a different model.",
    "Here a common-mode voltage of 2.500 V multiplies a small positive common-mode gain and contributes millivolts alongside an intended roughly 100 mV differential output. Ratio matching can therefore set measurement accuracy even when replacing the op amp cannot improve this idealized error."
  ],
  "expansion-v7-finite-edge-capacitive-crosstalk": [
    "A separate numerical integration uses CC times the derivative of the specified continuous aggressor as the injected current and retains both capacitances in the victim state equation. Searching its slope for zero and its later threshold crossing checks the closed-form two-exponential solution.",
    "An instantaneous ideal step would permit a charge-share voltage jump, but this 20 ns exponential edge is continuous and produces a delayed peak. Omitting CC from the relaxation capacitance or selecting the rising 1.250 V root changes the result materially despite using plausible first-order reasoning.",
    "A receiver sampled soon after an aggressor starts can see its largest disturbance later than the start of that edge, and the falling threshold identifies a separate recovery window. This conclusion applies to the stipulated linear lumped model; it does not predict distributed trace or clamp behavior."
  ],
  "expansion-v7-bjt-partial-bypass-pole-zero": [
    "An independent pole check grounds the ideal base input and applies a test voltage at X. The transistor emitter port then looks like 1/(gm + 1/rπ), so CE sees RE2 in parallel with RE1 plus that port resistance, independently reproducing the transfer-function pole.",
    "Opening CE only gives the low-frequency limit and shorting it only gives the high-frequency limit. At 100 Hz neither approximation is adequate; retaining the numerator zero as well as the denominator pole is necessary to obtain the intermediate gain.",
    "Partial emitter bypass preserves unbypassed RE1 degeneration while allowing larger AC gain above the transition. Finite base current alters the resistance CE sees, so ignoring rπ shifts both gain limits and the capacitor transition in this specified model."
  ],
  "expansion-v7-mos-common-source-feedforward-zero": [
    "Set drain output to zero at an arbitrary real Laplace coordinate. The drain equation reduces to (gm − sCgd)vg = 0; a nonzero gate signal therefore cancels drain output at positive s = gm/Cgd, independently establishing the zero sign without expanding the determinant.",
    "The two stable denominator roots do not imply that the feedforward zero is in the left half-plane. Reporting a negative zero coordinate or treating its real-s cancellation as a notch on the sinusoidal axis would discard the common-source nonminimum-phase behavior.",
    "The right-half-plane zero contributes unfavorable high-frequency phase when this stage is used inside feedback. A Miller capacitance estimate can approximate a dominant pole in some circuits, but it cannot preserve this exact feedforward cancellation or both poles for the stated values."
  ],
  "expansion-v7-burst-page-boundary-segmentation": [
    "Independently ignore burst choices and calculate the inclusive overall endpoint from initial byte 8112 plus 216 bytes minus one. It must equal the endpoint reconstructed from the final burst, while byte enumeration proves there are no gaps or repeated writes.",
    "The discriminating case is the initial address eighty bytes before a page boundary: a two-burst estimate based only on ceil(27/16) fails even though the total payload is small. Also test a beat ending exactly at a page edge, which is legal because its final byte remains on the old page.",
    "A controller that checks only its beat counter can issue a burst spanning two independently decoded address regions. Recomputing page room after every accepted burst prevents that boundary violation without silently padding or dropping a beat."
  ],
  "expansion-v7-hdl-alu-less-equal-flags": [
    "An independent operand-level check creates all 256 four-bit subtractions and computes signed overflow from whether the exact signed difference lies outside minus eight through plus seven. Comparing both signed and unsigned mathematical ordering checks more than a copied flag table.",
    "For A equal to +7 and B encoded as 1111, the retained sign is negative because the signed subtraction overflows. The signed comparison must be false while the unsigned comparison is true; this distinguishes sign-only, wrong-mode and inverted-carry implementations.",
    "A branch or limit-check unit using the wrong borrow convention can reverse unsigned conditions while ordinary positive signed examples still pass. Including equal operands and overflow boundaries in each mode protects the specified decision from both missed equality and wrapped-sign mistakes."
  ]
};
