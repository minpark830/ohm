// Curated public problem identities; solutions stay on the server.
export const roadmapStages = [
  {
    "id": "circuits",
    "title": "Circuit foundations",
    "description": "Turn circuit connections into equations, then use equivalents and power checks to simplify the result.",
    "prerequisite": "Comfort with Ohm’s law, series and parallel resistance, algebra, and engineering units.",
    "slugs": [
      "one-loop-two-resistors",
      "balance-the-node",
      "expansion-three-way-current-divider",
      "loaded-voltage-divider",
      "expansion-v2-source-absorbed-power",
      "expansion-v2-superposition-current-contribution",
      "expansion-two-mesh-shared-resistor",
      "floating-source-supernode",
      "expansion-thevenin-port-resistance",
      "expansion-norton-short-circuit-current",
      "expansion-maximum-load-power",
      "expansion-v2-controlled-source-port-resistance",
      "expansion-v2-weighted-opamp-summer"
    ]
  },
  {
    "id": "rc",
    "title": "RC response and filters",
    "description": "Connect initial conditions and time constants to charging, switching, and frequency response.",
    "prerequisite": "Circuit foundations, capacitor voltage continuity, exponentials, and logarithms.",
    "slugs": [
      "rc-time-constant",
      "expansion-rc-initial-reverse-current",
      "charging-after-one-tau",
      "discharge-to-quarter-voltage",
      "expansion-rc-charging-threshold",
      "expansion-rc-polarity-reversal",
      "expansion-rc-energy-released",
      "loaded-rc-transient",
      "expansion-rc-charge-then-discharge",
      "expansion-v2-ten-to-ninety-rise-time",
      "expansion-rc-lowpass-cutoff",
      "expansion-v2-highpass-gain-magnitude",
      "expansion-v2-highpass-falling-pulse"
    ]
  },
  {
    "id": "bjt",
    "title": "BJT building blocks",
    "description": "Move from DC switching and bias to small-signal gain, current mirrors, and differential pairs.",
    "prerequisite": "Circuit foundations and the forward-active and saturation models introduced in these problems.",
    "slugs": [
      "bjt-current-gain",
      "bjt-switch-current-limit",
      "expansion-bjt-forced-beta-resistor",
      "emitter-resistor-bias",
      "expansion-v2-bjt-vbe-current-ratio",
      "bjt-transconductance",
      "expansion-bjt-input-resistance-bias-network",
      "expansion-bjt-loaded-common-emitter",
      "expansion-bjt-unbypassed-emitter-gain",
      "expansion-bjt-exact-early-resistance",
      "expansion-v2-bjt-mirror-base-current-error",
      "expansion-v2-bjt-differential-current-steering"
    ]
  },
  {
    "id": "mosfet",
    "title": "MOSFETs and CMOS",
    "description": "Check operating regions before calculating current, gain, headroom, and CMOS behavior.",
    "prerequisite": "Circuit foundations; BJT small-signal practice is helpful but optional.",
    "slugs": [
      "identify-nmos-region",
      "nmos-saturation-current",
      "nmos-triode-current",
      "expansion-pmos-moving-drain-regions",
      "nmos-source-self-bias",
      "expansion-mos-transconductance-overdrive",
      "expansion-mos-channel-modulation-resistance",
      "expansion-mos-loaded-common-source-gain",
      "expansion-mos-follower-body-effect",
      "expansion-v2-mos-mirror-load-compliance",
      "expansion-v2-mos-cmos-static-high",
      "expansion-v2-mos-cmos-switching-point"
    ]
  },
  {
    "id": "digital",
    "title": "Digital logic and timing",
    "description": "Build fluency in logic, arithmetic, state encoding, timing constraints, and clock-domain boundaries.",
    "prerequisite": "Binary arithmetic and Boolean operators; basic voltage and capacitance concepts for interface and power questions.",
    "slugs": [
      "boolean-absorption",
      "full-adder-output",
      "expansion-unsigned-adder-carry",
      "signed-addition-overflow",
      "expansion-counter-width",
      "expansion-mux-shannon-decomposition",
      "expansion-v2-fsm-encoding-storage",
      "expansion-v2-interface-noise-margin",
      "expansion-v2-cmos-switching-power",
      "setup-time-budget",
      "expansion-hold-buffer-skew",
      "expansion-pipeline-throughput",
      "expansion-v2-cdc-short-pulse"
    ]
  },
  {
    "id": "hdl",
    "title": "HDL expressions and behavior",
    "description": "Write small combinational expressions and reason about simulation, storage, widths, and reset behavior.",
    "prerequisite": "Digital logic and timing; basic Verilog syntax. These exercises do not run full HDL modules.",
    "slugs": [
      "write-a-two-input-xor",
      "write-a-two-to-one-mux",
      "expansion-hdl-even-parity-bit",
      "expansion-hdl-full-adder-carry",
      "expansion-hdl-two-bit-equality",
      "expansion-hdl-priority-encoder-lsb",
      "repair-combinational-sensitivity",
      "expansion-hdl-inferred-latch",
      "nonblocking-pipeline-step",
      "expansion-v2-hdl-asynchronous-reset-assertion",
      "expansion-v2-hdl-replication-width",
      "expansion-hdl-signed-shift"
    ]
  }
];
