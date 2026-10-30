// Method boundaries for this expansion's explicitly stipulated models.
export const v8EditorialGuides={
 matching:{
  title:'Propagate parameter mismatch before sizing the device array',
  takeaway:'A pair-difference specification and a single-device variation are different inputs to a mismatch model.',
  steps:[
   'Identify whether each supplied coefficient describes one device or the difference of a matched pair. Apply the area and unit convention stated for that coefficient.',
   'Use the stipulated small-error sensitivities to refer each parameter variation to the requested current, voltage or gain error. Sum independent variances and include correlations only when supplied.',
   'Apply the specified area or cell-count scaling, solve the bound continuously, and round the required number of cells upward. Verify both that integer and the preceding integer.'
  ],
  mistake:'Add another factor of square root of two to a coefficient already specified for pair mismatch.',
  reason:'The pair statistic already incorporates its stated device combination. Changing its convention or summing standard deviations directly alters the design constraint.',
  check:'Reconstruct each independent variance contribution at the chosen integer size. Confirm the resulting total statistic satisfies the bound and that one fewer cell fails it.',
  design:'Increasing area can improve the supplied random mismatch statistic while costing capacitance, layout area and settling time. Systematic gradients and shared errors need separate treatment.',
  assumptions:'The stated local sensitivity, coefficient convention and independence model define this exercise. A sigma bound is a statistical model result rather than a deterministic fabrication guarantee.'
 },
 noiseSpectrum:{
  title:'Integrate the stated noise spectrum over its actual transfer function',
  takeaway:'A noise density becomes a variance only after a squared transfer function and a bandwidth integral.',
  steps:[
   'Identify whether the supplied spectrum is one-sided or two-sided, and whether it is a power density or an amplitude density. Convert to a consistent frequency variable before integrating.',
   'Refer each independent source to the requested node using the magnitude squared of its transfer function. Add variances or power spectra under the stated independence assumptions.',
   'Integrate over the stated band, then take a square root for RMS noise. Keep absolute temperature, bias dependence and any optimization constraints explicit.'
  ],
  mistake:'Multiply an amplitude density by the bandwidth, or add independent RMS voltages directly.',
  reason:'Independent noise powers add. An amplitude density is multiplied by the square root of an equivalent noise bandwidth only when its assumed flat spectrum and filtering justify that shortcut.',
  check:'Check that the integrated quantity has units of squared voltage or current. Compare a numerical frequency integral with the closed form and inspect the admitted low- and high-frequency limits.',
  design:'Changing capacitance, source impedance, bandwidth or bias trades noise against settling, loading and power. Only the noise sources and temperature law supplied in the model are included.',
  assumptions:'White-noise or infinite-band approximations belong to the stipulated educational model. Correlation, flicker noise, parasitics and device bandwidth require additional information.'
 },
 coupledStates:{
  title:'Retain every independent state and the forcing term',
  takeaway:'A circuit with a dynamic feedback or guard path can have more than one natural mode.',
  steps:[
   'Choose the capacitor voltages and dynamic control variables named by the model. Derive their coupled state equations from terminal current balance and the supplied controller law.',
   'Solve the forced state equations with the actual initial conditions. Use the characteristic roots to describe the modes without replacing the input by a source-free decay.',
   'Recover the requested terminal signal, differentiate to locate extrema where needed, and verify both the initial behavior and the DC equilibrium.'
  ],
  mistake:'Replace a frequency-dependent feedback path by its DC gain before analyzing a transient.',
  reason:'That substitution removes a state and can erase poles, overshoot or ringing. A static equivalent capacitance cannot preserve a finite-bandwidth control loop’s complete response.',
  check:'Numerically integrate the original state equations and compare with the derived waveform, extrema and long-time equilibrium. Test the characteristic coefficients against the stated stability range.',
  design:'Active guarding and feedback may reduce static loading while changing transient response. Driver bandwidth, stability, headroom and current capability need separate real-circuit checks.',
  assumptions:'Use the supplied linear state model, initial conditions and forcing. A reduced two-state model does not establish physical stability with omitted delays or parasitics.'
 },
 reliability:{
  title:'Separate shared failures from conditionally independent channels',
  takeaway:'Redundancy only reduces the failure modes that the model actually makes independent.',
  steps:[
   'Partition the experiment into the supplied common-cause event and its complement. State which channel failure probabilities are conditional on the complement.',
   'Within the independent branch, enumerate the mutually exclusive channel combinations that defeat the voter. Include the count of equivalent combinations exactly once.',
   'Weight each branch by its probability, then check the zero-channel-fault and zero-common-cause limits. Keep voter failure separate unless the problem explicitly includes it.'
  ],
  mistake:'Apply a binomial majority formula directly to marginal channel probabilities that already include a common cause.',
  reason:'The independence assumption is conditional. Mixing marginal probabilities into that branch double-counts shared failures and gives an unjustified reliability benefit.',
  check:'Enumerate all channel fault masks in the no-common-cause branch; verify their probabilities sum to one, and compare the weighted failure event to the closed-form expression.',
  design:'Redundant channels can reduce independent faults while sharing power, clock, environmental or implementation failures. The supplied probability model is a calculation exercise, not a field reliability certification.',
  assumptions:'Use the stated event probabilities and fault model. Do not infer failure rates, repair behavior, time dependence or a perfect real voter from a single static trial.'
 }
};
