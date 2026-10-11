// Curated public identities, not a second problem bank. Current catalog records
// supply every title, version, publication state, and solve status at render time.
export const roleTracks = [
  {
    id: 'analog', title: 'Analog design', short: 'Analog', icon: 'circuit',
    description: 'Move from bias and loading to gain, bandwidth, and feedback.',
    prerequisite: 'KCL, KVL, parallel resistance, and basic capacitor behavior.',
    coverage: ['Bias & small signal', 'Feedback & headroom', 'Bandwidth & measurement'],
    lesson: 'opamp', lessonLabel: 'Review negative feedback', extraView: 'debug', extraLabel: 'Practice circuit diagnosis',
    stages: [
      {title: 'Find the operating point', milestone: 'Explain loading and check a device’s bias before choosing a small-signal model.', slugs: [
        'loaded-voltage-divider', 'emitter-resistor-bias', 'bjt-transconductance',
        'nmos-source-self-bias', 'expansion-mos-transconductance-overdrive'
      ]},
      {title: 'Build useful gain', milestone: 'Track polarity and loading, then check the output against its available headroom.', slugs: [
        'expansion-bjt-loaded-common-emitter', 'expansion-bjt-unbypassed-emitter-gain',
        'expansion-mos-loaded-common-source-gain', 'expansion-v3-opamp-headroom', 'expansion-v3-difference-amplifier'
      ]},
      {title: 'Test the limits', milestone: 'Separate finite gain, bandwidth, slew rate, and a broken feedback path.', slugs: [
        'expansion-v3-finite-loop-gain', 'expansion-v3-opamp-bandwidth',
        'expansion-v3-opamp-slew-limit', 'expansion-v3-input-bias-offset', 'expansion-v3-debug-feedback-open'
      ]}
    ]
  },
  {
    id: 'fpga', title: 'FPGA & digital design', short: 'FPGA / digital', icon: 'code',
    description: 'Connect Boolean logic, clocked behavior, and timing constraints.',
    prerequisite: 'Binary arithmetic, Boolean operators, and basic Verilog syntax.',
    coverage: ['Logic & widths', 'State & reset', 'Timing & clock domains'],
    lesson: 'logic', lessonLabel: 'Review states and clock edges', extraView: 'hdl', extraLabel: 'Open the HDL workbench',
    stages: [
      {title: 'Make the logic precise', milestone: 'Distinguish stored width, carry, and signed overflow; express a small combinational function.', slugs: [
        'boolean-absorption', 'expansion-unsigned-adder-carry', 'signed-addition-overflow',
        'write-a-two-to-one-mux', 'expansion-hdl-even-parity-bit'
      ]},
      {title: 'Reason through each edge', milestone: 'Predict reset and nonblocking behavior, and identify unintended storage.', slugs: [
        'expansion-counter-width', 'nonblocking-pipeline-step', 'expansion-hdl-inferred-latch',
        'expansion-v2-hdl-asynchronous-reset-assertion', 'expansion-v2-fsm-encoding-storage'
      ]},
      {title: 'Check the implementation', milestone: 'Explain setup, hold, throughput, and why a synchronizer can miss a short pulse.', slugs: [
        'setup-time-budget', 'expansion-hold-buffer-skew', 'expansion-pipeline-throughput',
        'expansion-v2-cdc-short-pulse', 'expansion-v2-hdl-replication-width'
      ]}
    ]
  },
  {
    id: 'power', title: 'Power electronics', short: 'Power', icon: 'bolt',
    description: 'Check energy, switching conditions, conversion ratios, and loss.',
    prerequisite: 'Ohm’s law, energy and power, exponentials, and basic transistor regions.',
    coverage: ['Energy & power', 'Switching devices', 'Converters & heat'],
    lesson: 'power', lessonLabel: 'Review converter power checks', extraView: 'lab', extraLabel: 'Explore the circuit lab',
    stages: [
      {title: 'Balance power and energy', milestone: 'Use consistent source signs and distinguish stored energy from real power.', slugs: [
        'one-loop-two-resistors', 'expansion-v2-source-absorbed-power', 'expansion-rc-energy-released',
        'expansion-v3-series-rl-phasor', 'expansion-v3-rl-real-power'
      ]},
      {title: 'Check the switch model', milestone: 'Check current limits and operating regions before reasoning about gate-drive timing.', slugs: [
        'bjt-switch-current-limit', 'expansion-bjt-forced-beta-resistor', 'identify-nmos-region',
        'nmos-triode-current', 'expansion-mos-miller-plateau-time'
      ]},
      {title: 'Connect conversion and load', milestone: 'Relate duty ratio, ripple, input power, and regulator heat under the stated models.', slugs: [
        'expansion-v3-buck-ripple', 'expansion-v3-boost-duty', 'expansion-v3-linear-regulator-loss',
        'expansion-v2-cmos-switching-power', 'expansion-v2-periodic-rc-ripple'
      ]}
    ]
  },
  {
    id: 'embedded', title: 'Embedded hardware', short: 'Embedded', icon: 'grid',
    description: 'Follow a sensor signal from its analog interface into digital logic.',
    prerequisite: 'Divider circuits, binary numbers, and basic capacitor and logic behavior.',
    coverage: ['Signal conditioning', 'ADC interfaces', 'Digital boundaries'],
    lesson: 'converters', lessonLabel: 'Review resolution and accuracy', extraView: 'debug', extraLabel: 'Practice interface diagnosis',
    stages: [
      {title: 'Condition the signal', milestone: 'Account for load, settling, thresholds, and filtering at an input.', slugs: [
        'loaded-voltage-divider', 'rc-time-constant', 'expansion-rc-charging-threshold',
        'loaded-rc-transient', 'expansion-v3-lowpass-corner'
      ]},
      {title: 'Understand the conversion', milestone: 'Explain ADC codes, quantization, reference error, and the limits of a real measurement.', slugs: [
        'expansion-v3-adc-step-code', 'expansion-v3-adc-quantization-noise',
        'expansion-v3-debug-adc-reference', 'expansion-v3-opamp-headroom', 'expansion-v2-voltmeter-loading-limit'
      ]},
      {title: 'Cross into the digital world', milestone: 'Check noise margin, timing, pulse capture, state width, and switching power.', slugs: [
        'expansion-v2-interface-noise-margin', 'setup-time-budget', 'expansion-v2-cdc-short-pulse',
        'expansion-counter-width', 'expansion-v2-cmos-switching-power'
      ]}
    ]
  },
  {
    id: 'pcb', title: 'PCB bring-up & debugging', short: 'PCB / debug', icon: 'help',
    description: 'Practice electrical bring-up: expected readings, loading, and fault isolation.',
    prerequisite: 'Ground references, KCL, KVL, and basic meter and oscilloscope concepts.',
    coverage: ['Reference measurements', 'Instrument loading', 'Fault isolation'],
    lesson: 'debug', lessonLabel: 'Review measurement-led diagnosis', extraView: 'debug', extraLabel: 'Open circuit debugging',
    stages: [
      {title: 'Predict healthy readings', milestone: 'Establish expected node voltages, branch currents, logic margins, and heat before chasing a fault.', slugs: [
        'one-loop-two-resistors', 'balance-the-node', 'loaded-voltage-divider',
        'expansion-v2-interface-noise-margin', 'expansion-v3-linear-regulator-loss'
      ]},
      {title: 'Include the instrument', milestone: 'Recognize resistance and capacitance loading, and connect measured edges to the circuit model.', slugs: [
        'expansion-v2-voltmeter-loading-limit', 'expansion-v2-ten-to-ninety-rise-time',
        'expansion-v3-debug-probe-loading', 'expansion-v2-highpass-falling-pulse', 'expansion-v3-opamp-slew-limit'
      ]},
      {title: 'Separate likely causes', milestone: 'Compare competing explanations for an open path, a railed amplifier, or an incorrect conversion.', slugs: [
        'expansion-v3-debug-divider-open', 'expansion-v3-debug-feedback-open',
        'expansion-v3-debug-adc-reference', 'bjt-switch-current-limit', 'expansion-v3-input-bias-offset'
      ]}
    ]
  }
];

export function roleTrackById(id) { return roleTracks.find(track => track.id === id) || null; }
export function roleTrackSlugs(track) { return [...new Set((track?.stages || []).flatMap(stage => stage.slugs))]; }

/** Resolve by canonical slug so owner edits and allocated IDs stay authoritative. */
export function resolveRoleTrack(id, problems, progress = {}) {
  const track = roleTrackById(id);
  if (!track) return null;
  const bySlug = new Map(), seenIds = new Set();
  for (const problem of Array.isArray(problems) ? problems : []) {
    if (!problem || !Number.isSafeInteger(problem.id) || problem.id < 1 || problem.published === false || problem.published === 0 || seenIds.has(problem.id) || bySlug.has(problem.slug)) continue;
    bySlug.set(problem.slug, problem); seenIds.add(problem.id);
  }
  const solved = new Set(Array.isArray(progress.solved) ? progress.solved : []);
  const stages = track.stages.map(stage => {
    const available = stage.slugs.map(slug => bySlug.get(slug)).filter(Boolean);
    return {...stage, problems: available, total: available.length, completed: available.filter(p => solved.has(p.id)).length, missing: stage.slugs.length - available.length};
  });
  const available = stages.flatMap(stage => stage.problems);
  return {...track, stages, problems: available, total: available.length,
    completed: available.filter(p => solved.has(p.id)).length,
    missing: roleTrackSlugs(track).length - available.length,
    next: available.find(p => !solved.has(p.id)) || null};
}
