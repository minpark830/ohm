// Public company preparation metadata, checked 2026-10-30.
// All exercises are original Ohm practice. Source evidence supports topics or
// role alignment, never a claim that an employer asked these exact questions.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const companyEvidence=freeze({
 'official-prep':{label:'Official prep topics',detail:'The company publishes interview preparation topics. Ohm selected original exercises to practice them.'},
 'role-aligned':{label:'Role-aligned practice',detail:'Ohm inferred relevant practice from a published role or team description. This is not an interview-question report.'}
});
export const companies=freeze([
  {
    "id": "amazon",
    "name": "Amazon",
    "mark": "a",
    "role": "Student & graduate hardware",
    "kind": "official-prep",
    "scope": "Technical foundations for student and graduate hardware roles. Pair this set with your project stories and the company’s behavioral preparation.",
    "topics": [
      "Analog & digital fundamentals",
      "Embedded interfaces",
      "Measurement & debugging"
    ],
    "source": {
      "title": "Amazon — Interview prep for hardware roles",
      "url": "https://www.amazon.jobs/content/en/how-we-hire/university/hardware",
      "summary": "Amazon’s university guide lists analog and digital skills, embedded systems experience, debugging, and interactions between consumer electronics blocks. It describes verbal and virtual whiteboard exercises.",
      "checkedOn": "2026-10-30"
    },
    "problems": [
      {
        "slug": "expansion-v3-debug-divider-open",
        "title": "Debug a divider stuck at the supply",
        "version": 1,
        "focus": "Diagnose a circuit from measurements"
      },
      {
        "slug": "expansion-v3-debug-probe-loading",
        "title": "The probe changes the edge you measure",
        "version": 1,
        "focus": "Account for the measurement instrument"
      },
      {
        "slug": "expansion-v3-debug-adc-reference",
        "title": "Diagnose an ADC reading half scale",
        "version": 1,
        "focus": "Check the complete signal chain"
      },
      {
        "slug": "expansion-v2-interface-noise-margin",
        "title": "Find the weaker logic noise margin",
        "version": 1,
        "focus": "Verify a digital interface margin"
      },
      {
        "slug": "expansion-v5-uart-framing-latency",
        "title": "Budget UART time including every framing bit",
        "version": 1,
        "focus": "Reason through serial framing"
      },
      {
        "slug": "expansion-v5-hdl-spi-sample-edge",
        "title": "Select the sampling edge in all four SPI modes",
        "version": 1,
        "focus": "Apply an interface timing convention"
      },
      {
        "slug": "expansion-v5-fifo-stall-buffer-budget",
        "title": "Keep a burst through a downstream stall",
        "version": 1,
        "focus": "Trace buffering and backpressure"
      },
      {
        "slug": "expansion-v5-adc-acquisition-source-budget",
        "title": "Set the sampling time before trusting twelve bits",
        "version": 1,
        "focus": "Connect analog settling to conversion"
      },
      {
        "slug": "expansion-v3-opamp-headroom",
        "title": "Check gain before accepting an output",
        "version": 1,
        "focus": "Check an analog output limit"
      },
      {
        "slug": "expansion-v6-schmitt-two-state-thresholds",
        "title": "Use the output state to find both trip points",
        "version": 1,
        "focus": "Analyze hysteresis at an input"
      },
      {
        "slug": "expansion-v7-current-loop-compliance-budget",
        "title": "Leave enough voltage for the two-wire transmitter",
        "version": 1,
        "focus": "Budget a sensor interface"
      },
      {
        "slug": "expansion-v7-sram-write-end-window",
        "title": "Intersect every setup and hold limit before ending the write",
        "version": 1,
        "focus": "Intersect interface timing constraints"
      }
    ]
  },
  {
    "id": "ti",
    "name": "Texas Instruments",
    "mark": "TI",
    "role": "Circuit analysis & design foundations",
    "kind": "official-prep",
    "scope": "A technical foundation set for circuit and design conversations. Choose the device and application topics that fit your specific TI role.",
    "topics": [
      "Circuit reasoning",
      "Analog devices",
      "Design constraints"
    ],
    "source": {
      "title": "Texas Instruments — Recruitment process",
      "url": "https://careers.ti.com/en/sites/CX/pages/recruitment-process/?DCMP=ThinkInnovate",
      "summary": "TI’s recruitment guide says technical questions may include circuit analysis, design scenarios, and coding problems. The specific circuits below are Ohm’s original exercises selected for those broad preparation areas.",
      "checkedOn": "2026-10-30"
    },
    "problems": [
      {
        "slug": "expansion-two-mesh-shared-resistor",
        "title": "The shared mesh resistor",
        "version": 1,
        "focus": "Explain a circuit-law derivation"
      },
      {
        "slug": "expansion-dependent-source-node",
        "title": "A node with controlled injection",
        "version": 1,
        "focus": "Include a controlled source"
      },
      {
        "slug": "expansion-v3-finite-loop-gain",
        "title": "Closed-loop gain with finite open-loop gain",
        "version": 1,
        "focus": "Test a feedback assumption"
      },
      {
        "slug": "expansion-v3-input-bias-offset",
        "title": "Follow the bias-current direction",
        "version": 1,
        "focus": "Track an analog error source"
      },
      {
        "slug": "expansion-v4-bjt-loaded-divider-bias",
        "title": "A bias divider sags under base current",
        "version": 1,
        "focus": "Include bias-network loading"
      },
      {
        "slug": "expansion-v2-bjt-differential-output-gain",
        "title": "Keep track of both collector signs",
        "version": 1,
        "focus": "Track differential gain and signs"
      },
      {
        "slug": "expansion-v2-mos-mirror-load-compliance",
        "title": "How large can the mirror load be?",
        "version": 1,
        "focus": "Check a device design boundary"
      },
      {
        "slug": "expansion-v4-mos-source-degenerated-gain",
        "title": "An unbypassed source resistor changes transconductance",
        "version": 1,
        "focus": "Analyze local feedback"
      },
      {
        "slug": "expansion-v7-quarter-bridge-finite-strain",
        "title": "Keep the finite strain in a quarter bridge",
        "version": 1,
        "focus": "Model a sensor bridge"
      },
      {
        "slug": "expansion-v7-difference-amplifier-ratio-mismatch",
        "title": "A tiny ratio mismatch leaks the common-mode voltage",
        "version": 1,
        "focus": "Quantify an analog mismatch"
      },
      {
        "slug": "expansion-v7-charge-amplifier-finite-current-pulse",
        "title": "A finite sensor pulse charges and leaks at the same time",
        "version": 1,
        "focus": "Analyze a sensor front end"
      },
      {
        "slug": "expansion-v7-bjt-partial-bypass-pole-zero",
        "title": "A partial emitter bypass creates both a zero and a pole",
        "version": 1,
        "focus": "Explain an amplifier’s frequency response"
      }
    ]
  },
  {
    "id": "nvidia",
    "name": "NVIDIA",
    "mark": "N",
    "role": "ASIC / RTL & circuit solutions",
    "kind": "role-aligned",
    "scope": "Fundamentals aligned to the published ASIC Design Engineer — RTL and Circuits role (JR2023989). A role example, rather than a promise about an interview or a currently open vacancy.",
    "topics": [
      "RTL & combinational logic",
      "Timing & clock crossings",
      "Datapath reasoning"
    ],
    "source": {
      "title": "NVIDIA — ASIC Design Engineer, RTL and Circuits",
      "url": "https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/ASIC-Design-Engineer---RTL-and-Circuits_JR2023989",
      "summary": "This role describes digital IP microarchitecture, Verilog/SystemVerilog, front-end verification, clock-domain checks, timing analysis, and behavioral RTL for mixed-signal blocks. Ohm infers the practice selection from these responsibilities.",
      "checkedOn": "2026-10-30"
    },
    "problems": [
      {
        "slug": "expansion-v4-setup-hold-two-corners",
        "title": "Check setup and hold at different timing corners",
        "version": 1,
        "focus": "Check both timing corners"
      },
      {
        "slug": "expansion-v4-critical-path-migration",
        "title": "A faster branch exposes another bottleneck",
        "version": 1,
        "focus": "Reason about a moving bottleneck"
      },
      {
        "slug": "expansion-v2-cdc-short-pulse",
        "title": "Can two synchronizer registers capture every pulse?",
        "version": 1,
        "focus": "Recognize a crossing limitation"
      },
      {
        "slug": "expansion-v6-synchronizer-safe-phase-latency",
        "title": "Bound synchronization latency for safe input phases",
        "version": 1,
        "focus": "Bound crossing latency"
      },
      {
        "slug": "expansion-v4-hdl-fsm-next-busy-bit",
        "title": "Recover the illegal state while computing the next bit",
        "version": 1,
        "focus": "Define recovery and next-state logic"
      },
      {
        "slug": "expansion-v6-hdl-round-robin-current-grant",
        "title": "Use saved round-robin priority only when requests compete",
        "version": 1,
        "focus": "Respect stored arbitration state"
      },
      {
        "slug": "expansion-v6-hdl-round-nearest-even-increment",
        "title": "Round a retained binary value to nearest, ties to even",
        "version": 1,
        "focus": "Write a datapath control function"
      },
      {
        "slug": "expansion-v7-cache-associative-address-fields",
        "title": "A way is not another address-index field",
        "version": 1,
        "focus": "Partition a memory address"
      },
      {
        "slug": "expansion-v7-fixed-point-negative-product-floor",
        "title": "Drop fractional product bits with the stated negative rounding rule",
        "version": 1,
        "focus": "Keep signed arithmetic conventions"
      },
      {
        "slug": "expansion-v7-hdl-radix4-booth-negative",
        "title": "A high recoding bit does not always mean a negative partial product",
        "version": 1,
        "focus": "Decode an arithmetic control signal"
      },
      {
        "slug": "expansion-v7-hdl-alu-less-equal-flags",
        "title": "Choose signed or unsigned ordering from the same subtraction",
        "version": 1,
        "focus": "Interpret datapath flags"
      },
      {
        "slug": "expansion-v7-interconnect-elmore-area-delay",
        "title": "Measure delay by the area above the RC step response",
        "version": 1,
        "focus": "Connect RC loading to delay"
      }
    ]
  },
  {
    "id": "apple",
    "name": "Apple",
    "mark": "A",
    "role": "Hardware & mixed-signal design",
    "kind": "role-aligned",
    "scope": "Fundamentals for the analog, digital, board, and mixed-signal specialties described on Apple’s hardware careers page. Individual teams and seniority levels vary.",
    "topics": [
      "Analog & mixed signal",
      "Board measurement",
      "Power & signal integrity"
    ],
    "source": {
      "title": "Apple — Hardware careers",
      "url": "https://www.apple.com/careers/us/work-at-apple/teams/hardware.html",
      "summary": "Apple describes hardware specialties including analog and digital circuit design, mixed-signal design, verification, boards, and power and signal integrity. The exercises are Ohm’s interpretation of those areas.",
      "checkedOn": "2026-10-30"
    },
    "problems": [
      {
        "slug": "expansion-v5-kelvin-shunt-lead-error",
        "title": "Sense inside the current-carrying leads",
        "version": 1,
        "focus": "Separate sensing from current leads"
      },
      {
        "slug": "expansion-v5-transmission-line-two-arrivals",
        "title": "Follow the first two reflected arrivals",
        "version": 1,
        "focus": "Trace reflected signal arrivals"
      },
      {
        "slug": "expansion-v5-sensor-noise-rss-budget",
        "title": "Add independent noise by power",
        "version": 1,
        "focus": "Combine independent noise contributions"
      },
      {
        "slug": "expansion-v5-adc-acquisition-source-budget",
        "title": "Set the sampling time before trusting twelve bits",
        "version": 1,
        "focus": "Budget analog acquisition settling"
      },
      {
        "slug": "expansion-v6-compensated-scope-probe",
        "title": "Match the probe and scope time constants",
        "version": 1,
        "focus": "Check measurement frequency response"
      },
      {
        "slug": "expansion-v3-opamp-slew-limit",
        "title": "A sine wave meets the slew limit",
        "version": 1,
        "focus": "Distinguish bandwidth from slew limits"
      },
      {
        "slug": "expansion-v4-mos-active-load-swing-window",
        "title": "Two current-source compliances limit one output",
        "version": 1,
        "focus": "Find analog output headroom"
      },
      {
        "slug": "expansion-v7-mos-transmission-gate-resistance-envelope",
        "title": "Find the weak point of a complementary analog switch",
        "version": 1,
        "focus": "Analyze an analog switch"
      },
      {
        "slug": "expansion-v7-finite-edge-capacitive-crosstalk",
        "title": "A slower aggressor moves the victim peak away from the edge",
        "version": 1,
        "focus": "Model capacitive signal coupling"
      },
      {
        "slug": "expansion-v7-bjt-collector-shot-noise-referral",
        "title": "Refer collector shot noise back to the input",
        "version": 1,
        "focus": "Refer noise through a signal chain"
      },
      {
        "slug": "expansion-v4-setup-hold-two-corners",
        "title": "Check setup and hold at different timing corners",
        "version": 1,
        "focus": "Check digital timing margins"
      },
      {
        "slug": "expansion-v6-hdl-round-nearest-even-increment",
        "title": "Round a retained binary value to nearest, ties to even",
        "version": 1,
        "focus": "Implement a rounding decision"
      }
    ]
  },
  {
    "id": "amd",
    "name": "AMD",
    "mark": "AMD",
    "role": "ASIC / SoC RTL design",
    "kind": "role-aligned",
    "scope": "Foundation practice aligned to RTL Design Engineer role 84990 in Silicon IP and SoC design. The published role is senior; this set covers a small technical foundation, not the full experience requirement.",
    "topics": [
      "RTL implementation",
      "IP & protocol reasoning",
      "Arithmetic & verification"
    ],
    "source": {
      "title": "AMD — RTL Design Engineer, role 84990",
      "url": "https://careers.amd.com/careers-home/jobs/84990?lang=en-us",
      "summary": "AMD’s role describes IP microarchitecture, RTL design and integration, verification plans, Verilog simulation, and interface IP. Ohm maps these responsibilities to original digital and HDL foundations.",
      "checkedOn": "2026-10-30"
    },
    "problems": [
      {
        "slug": "expansion-v4-masked-arbitration-selection",
        "title": "Mask requests before choosing a winner",
        "version": 1,
        "focus": "Mask before arbitrating requests"
      },
      {
        "slug": "expansion-v5-fifo-stall-buffer-budget",
        "title": "Keep a burst through a downstream stall",
        "version": 1,
        "focus": "Size buffering through a stall"
      },
      {
        "slug": "expansion-v6-burst-payload-throughput",
        "title": "Measure useful bandwidth through burst overhead and stalls",
        "version": 1,
        "focus": "Measure useful interface throughput"
      },
      {
        "slug": "expansion-v6-interleaved-memory-byte-address",
        "title": "Split a byte address across interleaved memory banks",
        "version": 1,
        "focus": "Decode byte-addressed memory"
      },
      {
        "slug": "expansion-v4-hdl-next-register-clear-enable",
        "title": "Write a register’s next-value input",
        "version": 1,
        "focus": "Specify register control priority"
      },
      {
        "slug": "expansion-v5-hdl-queue-accept-replacement",
        "title": "Accept a full-queue replacement without accepting illegal state",
        "version": 1,
        "focus": "Handle simultaneous queue operations"
      },
      {
        "slug": "expansion-v6-hdl-two-bit-carry-lookahead",
        "title": "Collapse a two-bit ripple carry into a lookahead flag",
        "version": 1,
        "focus": "Construct a carry control function"
      },
      {
        "slug": "expansion-v7-burst-page-boundary-segmentation",
        "title": "Split at both the page edge and controller burst cap",
        "version": 1,
        "focus": "Respect transfer boundaries"
      },
      {
        "slug": "expansion-v7-fixed-point-negative-product-floor",
        "title": "Drop fractional product bits with the stated negative rounding rule",
        "version": 1,
        "focus": "Preserve arithmetic rounding rules"
      },
      {
        "slug": "expansion-v7-hdl-two-phase-pending",
        "title": "A completed toggle must be acknowledged before it is idle",
        "version": 1,
        "focus": "Track a toggle protocol state"
      },
      {
        "slug": "expansion-v7-hdl-signed-times-four-fit",
        "title": "Check the sign extension before shifting two places",
        "version": 1,
        "focus": "Check arithmetic representability"
      },
      {
        "slug": "expansion-v7-hdl-alu-less-equal-flags",
        "title": "Choose signed or unsigned ordering from the same subtraction",
        "version": 1,
        "focus": "Verify signed and unsigned ordering"
      }
    ]
  },
  {
    "id": "tesla",
    "name": "Tesla",
    "mark": "T",
    "role": "Power electronics hardware",
    "kind": "role-aligned",
    "scope": "Fundamentals aligned to Staff Electrical Engineer, Power Electronics (251460). The published role also calls for substantial hands-on design experience beyond these exercises.",
    "topics": [
      "Converter fundamentals",
      "Gate drive & losses",
      "Magnetics & thermal checks"
    ],
    "source": {
      "title": "Tesla — Staff Electrical Engineer, Power Electronics",
      "url": "https://www.tesla.com/careers/search/job/staff-electrical-engineer-power-electronics-251460",
      "summary": "Tesla’s role covers converters, power semiconductors, gate drive, sensing, magnetics, capacitors, switching waveforms, and loss modeling. Ohm infers this foundational practice set from that scope.",
      "checkedOn": "2026-10-30"
    },
    "problems": [
      {
        "slug": "expansion-v3-buck-ripple",
        "title": "Size a buck converter operating point",
        "version": 1,
        "focus": "Apply converter balance equations"
      },
      {
        "slug": "expansion-v3-boost-duty",
        "title": "Duty ratio of an ideal boost stage",
        "version": 1,
        "focus": "Find a converter operating point"
      },
      {
        "slug": "expansion-v5-mos-hot-on-state-loss",
        "title": "Budget conduction loss at the hot resistance",
        "version": 1,
        "focus": "Use the hot on-resistance"
      },
      {
        "slug": "expansion-v5-mos-bootstrap-charge-budget",
        "title": "Keep a high-side gate alive between refreshes",
        "version": 1,
        "focus": "Budget a gate-drive reservoir"
      },
      {
        "slug": "expansion-v5-mos-drain-slew-false-turnon",
        "title": "A drain ramp lifts an off-state gate",
        "version": 1,
        "focus": "Check unintended gate coupling"
      },
      {
        "slug": "expansion-v5-mos-electrothermal-fixed-point",
        "title": "Solve the feedback between on resistance and heat",
        "version": 1,
        "focus": "Close a thermal feedback loop"
      },
      {
        "slug": "expansion-v6-mos-off-state-body-diode-polarity",
        "title": "An off MOSFET can still conduct backward",
        "version": 1,
        "focus": "Check reverse conduction polarity"
      },
      {
        "slug": "expansion-v6-mos-resistive-switching-overlap-integral",
        "title": "Integrate the overlap instead of assuming a triangle",
        "version": 1,
        "focus": "Integrate a switching loss"
      },
      {
        "slug": "expansion-v6-mos-external-clamp-inductive-energy",
        "title": "The clamp absorbs more than the initial coil energy",
        "version": 1,
        "focus": "Account for clamp energy"
      },
      {
        "slug": "expansion-v6-transformer-magnetizing-current",
        "title": "Include the current that never reaches the load",
        "version": 1,
        "focus": "Include magnetizing current"
      },
      {
        "slug": "expansion-v6-coupled-inductor-series-dots",
        "title": "Reversing one winding changes the series inductance",
        "version": 1,
        "focus": "Track winding polarity"
      },
      {
        "slug": "expansion-v7-mos-nonlinear-output-charge-energy",
        "title": "A capacitance curve has different charge and energy integrals",
        "version": 1,
        "focus": "Integrate nonlinear capacitance"
      }
    ]
  },
  {
    "id": "intel",
    "name": "Intel",
    "mark": "i",
    "role": "SoC logic design",
    "kind": "role-aligned",
    "scope": "Foundations aligned to the published SoC Logic Design Engineer role JR0288123. Team-specific interviews and experience requirements extend beyond this set.",
    "topics": [
      "RTL & SoC integration",
      "Power / performance / timing",
      "Logic verification"
    ],
    "source": {
      "title": "Intel — SoC Logic Design Engineer, JR0288123",
      "url": "https://intel.wd1.myworkdayjobs.com/External/job/Costa-Rica-San-Jose/SoC-Logic-Design-Engineer_JR0288123",
      "summary": "Intel’s role describes creating and optimizing SoC RTL, integrating logic blocks, and meeting power, performance, and timing requirements. Ohm infers these digital and HDL foundation exercises from that work.",
      "checkedOn": "2026-10-30"
    },
    "problems": [
      {
        "slug": "expansion-pipeline-throughput",
        "title": "Find the pipeline bottleneck",
        "version": 1,
        "focus": "Identify a pipeline bottleneck"
      },
      {
        "slug": "expansion-v2-cmos-switching-power",
        "title": "Budget the capacitive switching power",
        "version": 1,
        "focus": "Budget capacitive switching power"
      },
      {
        "slug": "expansion-v4-setup-hold-two-corners",
        "title": "Check setup and hold at different timing corners",
        "version": 1,
        "focus": "Check timing at both corners"
      },
      {
        "slug": "expansion-v4-critical-path-migration",
        "title": "A faster branch exposes another bottleneck",
        "version": 1,
        "focus": "Evaluate a timing optimization"
      },
      {
        "slug": "expansion-v6-interleaved-memory-byte-address",
        "title": "Split a byte address across interleaved memory banks",
        "version": 1,
        "focus": "Separate memory address fields"
      },
      {
        "slug": "expansion-v6-burst-payload-throughput",
        "title": "Measure useful bandwidth through burst overhead and stalls",
        "version": 1,
        "focus": "Account for transfer overhead"
      },
      {
        "slug": "expansion-v4-hdl-two-bit-signed-overflow",
        "title": "Detect overflow of the exact signed sum",
        "version": 1,
        "focus": "Distinguish overflow from carry"
      },
      {
        "slug": "expansion-v6-hdl-two-bit-carry-lookahead",
        "title": "Collapse a two-bit ripple carry into a lookahead flag",
        "version": 1,
        "focus": "Expand generate / propagate logic"
      },
      {
        "slug": "expansion-v7-cache-associative-address-fields",
        "title": "A way is not another address-index field",
        "version": 1,
        "focus": "Partition a cache address"
      },
      {
        "slug": "expansion-v7-hdl-signed-times-four-fit",
        "title": "Check the sign extension before shifting two places",
        "version": 1,
        "focus": "Check signed datapath headroom"
      },
      {
        "slug": "expansion-v7-hdl-radix4-booth-negative",
        "title": "A high recoding bit does not always mean a negative partial product",
        "version": 1,
        "focus": "Specify arithmetic recoding logic"
      },
      {
        "slug": "expansion-v7-hdl-alu-less-equal-flags",
        "title": "Choose signed or unsigned ordering from the same subtraction",
        "version": 1,
        "focus": "Interpret arithmetic condition flags"
      }
    ]
  }
]);
export const companyIds=Object.freeze(companies.map(company=>company.id));
export const companyFor=id=>companies.find(company=>company.id===id)||null;
export function companyProblemMapping(problem,id){
 const company=companyFor(id);
 if(!company||!problem||![true,1].includes(problem.published)||problem.version!==1)return null;
 return company.problems.find(item=>item.slug===problem.slug&&item.title===problem.title&&item.version===problem.version)||null;
}
export const matchesCompanyProblem=(problem,id)=>Boolean(companyProblemMapping(problem,id));
export const companiesForProblem=problem=>companies.filter(company=>matchesCompanyProblem(problem,company.id));
export function companySelection(problems,id){
 const company=companyFor(id);if(!company)return [];
 const available=new Map();for(const problem of Array.isArray(problems)?problems:[]){if(Number.isSafeInteger(problem?.id)&&problem.id>0&&matchesCompanyProblem(problem,id)&&!available.has(problem.slug))available.set(problem.slug,problem);}
 return company.problems.flatMap(item=>available.has(item.slug)?[{problem:available.get(item.slug),focus:item.focus}]:[]);
}
