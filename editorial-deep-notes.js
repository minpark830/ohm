// Problem-specific extensions to the released worked derivations.
// Each entry: an alternate check, a discriminating mistake, a practical consequence.
export const editorialDeepNotes={
'floating-source-supernode':[
 'Introduce an explicit A→B source current j instead: VA/6 + j = 2 and VB/3 − j = 0 (mA, kΩ). Together with VA − VB = 3, these recover VA = 6, VB = 3 and j = 1 mA. This checks the supernode by a different set of unknowns.',
 'A 3 V floating source does not set VA = 3 V. That would require its negative terminal to be grounded; here VB is another unknown.',
 'The ideal voltage source enforces its difference while carrying 1 mA. A real floating reference would need the corresponding current capability and allowable common-mode voltage.'
],
'loaded-rc-transient':[
 'Use the differential equation directly: 10 μF·dv/dt = (12 − v)/6 kΩ − v/3 kΩ. At v = 1 V its slope is +150 V/s, agreeing with (4 − 1)/20 ms. At 40 ms, the derivative is still positive and the result must be below 4 V.',
 'Using 6 kΩ alone gives the wrong time constant. Shorting the ideal supply leaves both resistors connected from the capacitor node to ground.',
 'The load changes both target and speed: it lowers the final voltage to 4 V but lowers the seen resistance to 2 kΩ. Loading does not always mean slower settling.'
],
'emitter-resistor-bias':[
 'Solve in emitter current instead: IE = 4.3/[1 kΩ + 43 kΩ/100]. Then IB = IE/100 and IC = 99IE/100. This independently exposes which current flows in each resistor. The collector-base headroom is approximately 6.04615 − 3.70699 = 2.33916 V.',
 'Replacing IE by IC silently changes the 100 multiplier to 99. That small approximation is avoidable when the task explicitly retains finite beta.',
 'Emitter feedback reduces beta sensitivity, but it spends about 3.007 V at the emitter. Resistor feedback cannot preserve a bias point after collector headroom runs out.'
],
'nmos-source-self-bias':[
 'Over the physical domain 0 ≤ i < 1 mA, the residual f(i) = i − (1 − i)² has derivative 3 − 2i > 0. A sign change between 0 and 1 therefore brackets one and only one valid current root.',
 'The larger squared-equation root is not a second allowed bias point: it reverses the sign of the overdrive used to derive the equation.',
 'Source resistance improves bias feedback but consumes source voltage and reduces available drain-source headroom.'
],
'setup-time-budget':[
 'At the boundary T = 520 ps, the actual capture edge is 500 ps and its setup deadline is 430 ps. The maximum data arrival is also 430 ps. Reducing T by 1 ps moves the deadline earlier and creates exactly −1 ps of setup slack.',
 'Subtracting the 20 ps early-capture skew would suggest a faster clock even though the physical deadline moved earlier.',
 'This equality has zero modeled margin. A practical target would allocate uncertainty and other characterized corner effects; no such extra allowance is supplied here.'
],
'expansion-dependent-source-node':[
 'Move the controlled term to the conductance side. The effective node conductance is 1/4 + 1/6 − 0.10 = 19/60 mS, so a 3 mA independent injection produces 180/19 V. Setting gm to zero recovers the passive 7.2 V divider, a useful sign check.',
 'Treating the controlled source as a positive leaving current makes an injecting feedback source lower the node voltage, contrary to this model.',
 'As gm approaches 1/R1 + 1/R2 the ideal DC solution becomes highly sensitive. That algebraic singularity alone does not establish the dynamic stability of a real implementation.'
],
'expansion-rc-charge-then-discharge':[
 'At the second switch the capacitor stores 3.160603 V. The discharge has lasted one new time constant by the requested instant, so the ratio v(30 ms)/v(10 ms) must be 1/e. This ratio check separates the elapsed-time issue from the first interval calculation.',
 'Using 30 ms as the discharge duration counts the charging interval twice. Local time in interval two is t − 10 ms.',
 'The capacitor voltage is continuous, but resistor current can change immediately because the topology and resistance changed. Continuity applies to the state, not every circuit variable.'
],
'expansion-bjt-follower-source-loading':[
 'Factor the gain into two independently meaningful terms. Base input resistance is 2475 + 100×500 = 52475 Ω. Source attenuation is 52475/54975 and base-to-emitter gain is 50000/52475; their product is 50000/54975.',
 'Calling an emitter follower unity gain hides both its finite emitter tracking error and the input divider caused by the 2.5 kΩ source resistance.',
 'The follower presents a much larger input resistance than its 500 Ω emitter load. That impedance transformation is useful even though its voltage gain is below one.'
],
'expansion-bjt-unbypassed-emitter-gain':[
 'Use vπ = vin − ve and ve = (gm + 1/rπ)vπ RE. Then vout = −gm(RC||RL)vπ, giving −100/(1 + 10.1) = −9.009009. This controlled-source derivation agrees with the base-current derivation.',
 'The often-used −(RC||RL)/RE = −10 limit drops the finite intrinsic emitter resistance and finite-beta correction. The stated exact model gives a smaller magnitude.',
 'A bypass capacitor could restore higher AC gain at frequencies where it effectively shorts RE, while leaving the DC emitter feedback; it would introduce a new frequency-dependent design tradeoff.'
],
'expansion-mos-follower-body-effect':[
 'With vin = 1 infinitesimal volt, the source KCL requires 5(1 − vo) = (1 + 0.01 + 0.01 + 0.5)vo in mS·V. Thus vo = 5/6.52. Setting gmb to zero would raise the predicted gain to 5/5.52, showing the body term’s separate effect.',
 'A grounded body gives vbs = −vout, so its contribution opposes source following. Giving it the same sign as gm vin overestimates gain.',
 'Even a high-output-resistance bias sink contributes finite loading here. Improving that sink alone cannot remove the much larger body-effect conductance or 2 kΩ load.'
],
'expansion-hold-buffer-skew':[
 'The actual hold deadline is 170 ps and earliest unbuffered data is 120 ps. Inserting 50 ps lands the data exactly at the deadline. This timeline check avoids memorizing a skew sign.',
 'A longer clock period does not move this same-edge hold deadline. The relevant launch and capture events stay in the same cycle.',
 'A 50 ps minimum-delay repair is only an equality under the supplied early corner. Its maximum delay must also be tested against setup at the late corner.'
],
'expansion-hdl-priority-encoder-lsb':[
 'An alternate decision tree is r3 ? 1 : (r2 ? 0 : r1). In particular, r2 = r1 = 1 with r3 = 0 must return 0 because request 2 wins; r3 = 1 overrides all lower inputs.',
 'ORing r3 and r1 without suppressing r1 when r2 wins produces the wrong code bit for competing requests.',
 'The fact that r0 drops out of this low code bit does not mean request 0 is irrelevant to the complete encoder or valid flag. Output-specific simplification preserves only the requested contract.'
],
'expansion-v2-unbalanced-bridge-current':[
 'Remove the bridge temporarily. Its left and right endpoints sit at 8 V and 4 V; each side has 4/3 kΩ Thévenin resistance. Reconnecting 4 kΩ gives (8 − 4)/(4 + 8/3) = 0.6 mA, agreeing with the coupled node solution.',
 'The two open-bridge divider voltages do not remain fixed after the bridge carries current. Using their 4 V difference directly across 4 kΩ ignores source resistance.',
 'An almost balanced bridge produces a small differential output from larger common-mode voltages. Instrument input loading and resistor matching can then dominate measurement accuracy.'
],
'expansion-v2-charge-sharing-transient':[
 'At t = τ, charge conservation gives 2VA + 6VB = 16 in μC and the differential mode gives VA − VB = 8/e V. Solving these two equations yields VA = 2 + 6/e and VB = 2 − 2/e; the final common voltage is 2 V.',
 'Using R(C1 + C2) misses the differential mode. The resistor sees a series-equivalent 1.5 μF for the voltage difference, despite the two grounded storage capacitors.',
 'The common charge mode is constant while the differential mode decays. This is why the network has two capacitor voltages but only one nonzero decay pole in this isolated model.'
],
'expansion-v2-periodic-rc-ripple':[
 'Symmetry gives Vmax + Vmin = 5 V. Combining that with Vmin/Vmax = e⁻¹ reproduces both extrema and the 2.310586 V ripple without solving the full two-variable cycle equations again.',
 'Starting every high half-cycle from zero describes repeated resets, not the steady waveform. The previous low interval leaves a nonzero state.',
 'Increasing RC reduces ripple but slows response to a changing average input. Ripple and acquisition speed are competing requirements for a smoothing network.'
],
'expansion-v2-bjt-differential-output-gain':[
 'Apply a +1 mV differential perturbation: branch currents change by ±8 μA, so the two 5 kΩ collector voltages change by ∓40 mV. VC2 − VC1 therefore changes by +80 mV, verifying gain +80 and the factor of two.',
 'A single-ended collector gain has half the differential-output magnitude. Reversing the subtraction changes the sign even though each branch physics is unchanged.',
 'Differential readout doubles the signal relative to one collector under this symmetric model, but the receiver still needs compatible common-mode range and both collector headrooms.'
],
'expansion-v2-mos-mirror-load-compliance':[
 'At RL,max = 10.3333 kΩ the 300 μA current drops 3.1 V, leaving exactly 0.2 V at the output device drain. That equals the required overdrive boundary. A smaller resistor raises VDS and preserves the saturated mirror model.',
 'Using the 0.7 V gate voltage as the required drain voltage spends threshold headroom twice. Saturation requires VDS ≥ VOV in this model.',
 'A larger mirror ratio supplies more current but narrows the allowed resistive load for a fixed supply. Real mismatch and output slope would add current error inside the compliance window.'
],
'expansion-v2-mos-pass-high-body-effect':[
 'Define f(v) = 3.3 − v − 0.5 − 0.4[√(0.6 + v) − √0.6]. Its derivative is −1 − 0.2/√(0.6 + v), strictly negative. There is a unique root between 0 and the no-body-effect estimate 2.8 V.',
 'The 2.8 V estimate assumes VSB = 0 while the output/source is elevated above a grounded body. It violates the actual threshold relation.',
 'This is the unloaded limiting high in the supplied ideal model. A nonzero DC load can require finite overdrive and lower the delivered high level further.'
],
'expansion-v2-mos-cascode-output-resistance':[
 'Inject a 1 μA test current. The lower 50 kΩ device gives vx = 50 mV. The upper resistor drop must then be ro2(ix + gm2 vx) = 10.05 V, so vout = 10.10 V for the linear test ratio 10.1 MΩ.',
 'The large test voltage in a linearized calculation is a scaling device, not a permitted large-signal output swing. The ratio is interpreted in the infinitesimal limit.',
 'A cascode’s large incremental resistance improves current-source stiffness, while its stacked devices consume DC compliance voltage. Output resistance and usable swing must be checked separately.'
],
'expansion-v2-static-hazard-consensus':[
 'For p = q = 1, the added pq path stays high while s changes. For p or q = 0, pq contributes nothing, so the settled truth table remains unchanged. This separates functional redundancy from dynamic coverage.',
 'Boolean equivalence alone cannot guarantee that a synthesis tool retains the added covering path. The stated retained gate structure is part of the hazard argument.',
 'The consensus term uses extra logic to cover the specified single-input transition. Multiple changing inputs, routing delays and different physical mapping need their own analysis.'
],
'expansion-v4-series-rlc-half-power-frequencies':[
 'The two exact frequencies obey fH − fL = R/(2πL), while fLfH = f0². Their difference is about 1591.549431 Hz and their geometric mean is 1591.549431 Hz for these values. These independent identities check both roots.',
 'The arithmetic midpoint is about 1779.406359 Hz, not f0. Assuming symmetric ±bandwidth/2 offsets in linear frequency is inaccurate for this broad resonance.',
 'Low Q produces a broad response where narrow-band shortcuts are poor. Exact roots remain simple enough to use and make the meaning of the resonance bandwidth explicit.'
],
'expansion-v4-ac-resistor-only-power-match':[
 'Normalize P = 100RL/[(30 + RL)² + 40²]. Its derivative has the sign of 2500 − RL²; it changes from positive to negative at 50 Ω. This confirms a maximum without accidentally allowing a reactive load.',
 'Choosing 30 Ω applies only the real-part rule from conjugate matching while leaving +j40 Ω uncanceled. It does not achieve the quoted 0.833333 W complex-load optimum.',
 'A resistor-only constraint can come from the physical load. Adding reactive matching components can improve delivered power but adds bandwidth dependence, loss and component stress.'
],
'expansion-v4-unbuffered-rc-ladder-settling':[
 'The first state derivatives are VA′(0+) = 5/(RC) and VB′(0+) = 0. A cascade formula 5[1 − (1 + x)e⁻ˣ] would have repeated poles at −1 and would solve a different, buffered topology. The actual polynomial has roots −0.381966 and −2.618034.',
 'Multiplying two unloaded RC responses ignores the current drawn by the second stage from the first. Equal component values do not imply equal independent poles.',
 'Buffering isolates stages and simplifies the response, but adds amplifier power, offset, bandwidth and stability requirements. An unbuffered ladder can be smaller while settling more slowly.'
],
'expansion-v4-floating-capacitor-reconfiguration':[
 'Recover the nodes from the differential state: VA = 8 + v/3 and VB = 8 − 2v/3. At v(0+) = 2 V these give 8.666667 V and 6.666667 V. Their jump from earlier absolute levels need not violate the capacitor’s 2 V differential continuity.',
 'Holding VB at ground creates a different topology. Only VA − VB is the stored capacitor voltage in this floating connection.',
 'Both capacitor plates can move in common mode when switch connections change. Real parasitic capacitance to ground would introduce additional states and possibly alter those instantaneous node shifts.'
],
'expansion-v4-bjt-collector-feedback-kcl':[
 'Using the solved base current, the 100 kΩ resistor drop is 3.766667 V, so VC = 0.7 + 3.766667 = 4.466667 V. The independent supply-loop check gives the same collector voltage when RC carries IC + IB.',
 'Letting RC carry only IC loses the current that feeds the base resistor from the collector node. The topology explicitly shares the collector supply branch.',
 'Collector feedback opposes an increase in collector current by lowering base drive. It couples bias and collector headroom, so a desired gain/load change can also move the DC operating point.'
],
'expansion-v4-bjt-finite-beta-tail-steering':[
 'At the stated split, base currents are 2 mA/50 = 40 μA and 1 mA/100 = 10 μA. Adding them to 3 mA of collector current exactly accounts for the 3.05 mA emitter tail. This is a direct terminal-current audit.',
 'Dividing the full 3.05 mA tail in a 2:1 collector ratio assigns the base currents twice: the exponential ratio applies to collectors while the sink sees emitters.',
 'Unequal finite beta changes the relation between collector-output currents and tail current even with perfectly matched saturation currents. Tail-source design and gain accuracy use different terminal quantities.'
],
'expansion-v4-mos-source-bias-triode-root':[
 'Compare the region boundaries before solving: VOV − VDS = (1.5 − i) − (1 − i) = 0.5 V throughout 0 ≤ i ≤ 1. Every conducting candidate in that interval is triode. The valid root 2 − √2 gives VDS = √2 − 1 and positive overdrive.',
 'Assuming saturation first is unnecessary here and can produce an equation with no admissible saturation point. The source-dependent region inequality is simpler than the current law.',
 'A source resistor does not guarantee saturation. Drain voltage and gate bias still decide the branch, and feedback can create a unique well-behaved triode operating point.'
],
'expansion-v4-mos-differential-pair-steering-limit':[
 'Let a and b be nonnegative overdrives. At vid = 0.5 V, a − b = 0.5 and a² + b² = 1, so a + b = √1.75. These two geometric constraints give both currents without a higher-order polynomial. At complete steering b reaches zero.',
 'Continuing the both-on formula beyond the point where b becomes negative squares an unphysical overdrive, much like accepting a forbidden self-bias root.',
 'The square-law pair has a finite full-steering boundary, unlike an ideal exponential pair whose smaller current approaches zero asymptotically. The chosen device model matters to large-signal range.'
],
'expansion-v4-setup-hold-two-corners':[
 'Setup needs 150 ps of improvement at its own corner; hold needs 410 ps of additional minimum delay at another. A hypothetical element adding exactly 410 ps at both corners would worsen setup to −560 ps unless another change offsets its late delay.',
 'Combining the setup corner’s early skew with the hold corner’s minimum data delay manufactures an unstated corner and can hide the actual hold violation.',
 'A repair needs separate minimum/maximum delay characterization. Moving the critical path or clock tree can improve one constraint while worsening the other.'
],
'expansion-v4-onehot-recovery-output-window':[
 'Trace the current register explicitly: before the next edge it remains 1001 and fire = state[3] = 1. After the recovery update it becomes 0001 and fire = 0. The next-state value is never a substitute for the current output decode.',
 'Claiming immediate safe output from next-state recovery ignores the entire interval before the recovering clock edge.',
 'A requirement to suppress an output during illegal states needs an explicitly verified current-state qualification or independent mechanism. Recovery latency and output safety are separate design properties.'
],
'expansion-v4-hdl-fsm-next-busy-bit':[
 'An alternative case expression is s1 ? (~s0 & ~done) : (s0 & ack). It returns zero in illegal state 11 and ignores start because IDLE can transition only to codes whose high bit is zero. Checking all four states explains every discarded input.',
 'Using s1 & ~done without the ~s0 guard keeps the high bit asserted for illegal 11. A partial decode changes recovery behavior.',
 'Complete state decodes preserve illegal-state intent in the Boolean contract. The output bit alone does not establish a complete fault-tolerant FSM implementation.'
],
'expansion-v4-hdl-synchronous-reset-last-update':[
 'Write a scheduling table: at 10 ns schedule 0, then schedule old q = 1, so commit 1. At 14 ns schedule nothing because only posedge clk triggers the process. At 20 ns execute the synchronous reset branch and commit 0.',
 'Calling the active-low reset asynchronous because of its polarity confuses signal level with event sensitivity. The sensitivity list determines whether its falling edge runs the process.',
 'An intended load-enable template would choose the branch before scheduling one assignment. Multiple same-register assignments can be legal while giving a surprising priority.'
],
'expansion-v5-transmission-line-two-arrivals':[
 'Successive load increments form a geometric series: first increment 3 V and round-trip multiplier ΓLΓS = −1/6. Their sum is 3/(1 + 1/6) = 18/7 V, independently reproducing the 2.571429 V final DC divider.',
 'The load reaches 3 V at the first arrival even though its final DC level is lower. Treating the source’s 3 V step as an immediate steady divider misses both propagation and overshoot.',
 'The negative source reflection alternates successive corrections. Termination can suppress that ringing at the cost of static power or a different delivered amplitude.'
],
'expansion-v5-passive-twin-t-notch':[
 'At sRC = j2, multiply −3/(−3 + j8) by its conjugate to obtain (9 + j24)/73. Both real and imaginary parts are positive, so the principal phase is in quadrant one. At the exact zero, magnitude is zero and phase has no unique value.',
 'Adding a fixed −180° because the numerator is negative while ignoring the denominator’s quadrant gives the wrong above-notch phase.',
 'The deep ideal notch depends on branch ratios. Component mismatch, source impedance and finite output load can spoil cancellation even when the nominal zero frequency is correct.'
],
'expansion-v5-bjt-area-ratio-ptat-current':[
 'The finite-beta factor 99/100 multiplies the emitter-resistor current at both temperatures. Therefore the ratio IC(358 K)/IC(298 K) remains 358/298, and the increase is 60/298 of the cold current. This checks the temperature result independently of the logarithmic voltage calculation.',
 'Using a Celsius ratio or equating the resistor’s emitter current with collector current introduces separate errors. Neither is removed by matching the devices.',
 'The common IS temperature dependence cancels in ΔVBE under the supplied equal-current assumptions. Startup, amplifier offsets, resistor drift and loop stability remain outside this ideal PTAT calculation.'
],
'expansion-v5-mos-electrothermal-fixed-point':[
 'At the solved 134.988453 °C, the resistance law gives 33.198614 mΩ; multiplying by 64 A² gives 2.124711 W and θP returns the same temperature rise. The derivative of the power-update map is 0.3072, below unity.',
 'A finite algebraic solution with a negative denominator would not represent a stable positive operating point of the stated thermal feedback model.',
 'Near unity feedback, modest parameter errors cause large temperature changes. The 8.451543 A result is a model temperature boundary, not a safe current rating for an unnamed package.'
],
'expansion-v5-crc-codeword-syndrome':[
 'Use linearity over GF(2): syndrome(valid codeword XOR x⁶) = 0 XOR syndrome(x⁶). Since x³ ≡ x + 1 modulo the generator, x⁶ ≡ x² + 1, which is 101. This checks the erroneous-word remainder without dividing its entire payload again.',
 'Arithmetic subtraction or a reflected bit order changes the calculation. Here polynomial coefficients are the explicitly stated left-to-right bits and subtraction is XOR.',
 'A nonzero syndrome detects the stated error. It does not promise unique error location or correction for an arbitrary corruption pattern.'
],
'expansion-v5-hdl-secded-data-correction':[
 'Enumerate the eight syndrome values with valid = odd = 1. Only 3, 5, 6 and 7 assert the payload-correction flag, exactly the syndromes with at least two set bits. For odd = 0 or valid = 0 every syndrome must return zero.',
 'The test syndrome != 0 wrongly includes check-bit locations 1, 2 and 4. Syndrome zero with odd parity also identifies the overall parity bit, not payload.',
 'The correction decision depends on the stated at-most-two-error model. Higher-weight faults can imitate a single error, so this Boolean flag alone does not provide unrestricted data integrity.'
],
'expansion-v6-transformer-magnetizing-current':[
 'Use power as a separate audit: 12×0.241993 ≈ 2.903911 W is supplied, and 2|IS|² ≈ 0.246370 W is lost in the primary resistor. Their difference is the 2.657542 W load power. The magnetizing inductor contributes reactive current and zero mean loss.',
 'Adding the magnetizing and reflected-load current magnitudes overestimates or mis-phases the source current. Their real and imaginary components must be added at the primary voltage.',
 'An ideal magnetizing branch can increase RMS source and series-resistor heating without adding load watts. It is not a core-loss model.'
],
'expansion-v6-switched-capacitor-finite-reservoir':[
 'The cycle map is vnext+ = [COα/(CO + CF)]v+ + [CF/(CO + CF)]3. Its slope is about 0.822579, so perturbations shrink each cycle. At the fixed point, CF(3 − v+) = CO(v+ − v−), independently equating flying-capacitor delivery and load charge removal.',
 'Including CF during the entire hold interval changes α and the ripple. The prompt disconnects and resets that capacitor immediately after sharing.',
 'A continuous equivalent resistance can approximate small-ripple behavior, but cannot reproduce this finite-reservoir maximum and minimum exactly. The event model also omits finite transfer-time loss details.'
],
'expansion-v6-bjt-degenerated-large-signal-steering':[
 'Let F(ΔI) = 0.025 ln[(0.002 + ΔI)/(0.002 − ΔI)] + 200ΔI. Its derivative is positive on |ΔI| < 0.002 A, proving uniqueness. Evaluating the slope at the solved split gives the local gain 2000/F′, distinct from the chord 0.887223/0.100 = 8.87223.',
 'Using the zero-input derivative everywhere hides the change in junction incremental resistance as current steers. A DC output/input ratio is not a local derivative either.',
 'The 200 Ω resistors take most of the differential voltage and broaden the useful range. Both collector-base headrooms still need checking at the resulting nonlinear split.'
],
'expansion-v6-mos-cascode-grounded-body-headroom':[
 'At fixed current, the upper gate relation g(x) = x + VTH(x) + 0.4 has derivative 1 + 0.25/√(0.6 + x) > 0. Thus its node solution is unique. Minimum upper-gate bias occurs at lower-device boundary x = 0.4, not at the previously solved x = 0.550899.',
 'Reusing the 0.549101 V threshold at the gate-minimum boundary is inconsistent because the upper source has moved. Evaluate body effect again at that boundary.',
 'The upper-gate minimum and output minimum move different terminals while holding different conditions fixed. They are compliance boundaries in a zero-CLM model, not an output-resistance or safe-operating-area claim.'
],
'expansion-v6-cdc-system-mtbf-budget':[
 'The needed additional resolution time can be checked as τ ln(10⁹/MTBFsystem,current), about 0.135973684 ns. Adding that to 1.20 ns gives 1.335973684 ns, independently confirming the direct logarithmic solution.',
 'Averaging or adding MTBF values improves the reported lifetime when more failure opportunities are added. Independent Poisson failure rates, their reciprocals, are what add.',
 'The fitted exponential makes a small added timing interval valuable, but all crossings must actually achieve it at the characterized corner. A statistical mean never guarantees a failure-free mission interval.'
],
'expansion-v6-hdl-two-bit-carry-lookahead':[
 'An equivalent carry construction uses majority twice: c1 = (a0 & b0) | (a0 & ci) | (b0 & ci), then y = (a1 & b1) | ((a1 | b1) & c1). Substituting c1 gives another legal scalar expression and can be checked against all 32 exact integer sums.',
 'Lower-bit carry generation alone does not imply the final carry: A = 1, B = 1, ci = 0 generates c1 but yields exact sum 2 and y = 0.',
 'Lookahead expresses parallel carry dependencies, but this known-bit truth-table proof does not demonstrate a physical speedup. Synthesis cells, fanout and routing determine delay.'
]
};
