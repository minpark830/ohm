import {draw,diagram} from './diagram-primitives.js?v=22c97c590ebdf290';
const {path,text,dot,ground,arrow,resistor,capacitor,source,box,npn,mos,note}=draw;
const make=(name,title,description,caption,body,height=450)=>diagram({slug:`expansion-v8-${name}`,title,description,caption,body,height});
const inductor=(x,y,xx,label)=>{const m=(x+xx)/2;return path(`M${x} ${y}H${m-36}a9 9 0 0 1 18 0a9 9 0 0 1 18 0a9 9 0 0 1 18 0a9 9 0 0 1 18 0H${xx}`)+text(m,y-24,label);};
export const v8TransistorDiagrams=[
 make('bjt-exact-one-pole-current-gain','Unity current gain is different from the beta pole',
  'A base-current input drives the supplied one-pole current-gain model and produces collector current. The collector is AC shorted around an established active DC bias. The low-frequency gain is ten and the measured magnitude is five at two megahertz. The pole and unity crossing are not shown.',
  'This is the supplied current-gain characterization; it is not a loaded voltage-amplifier bandwidth.',
  arrow(65,185,230,185)+text(140,156,'ib')+box(230,112,275,148,['β(s) = β0/[1 + s/(2πfβ)]','β0 = 10.0'])+arrow(505,185,660,185)+text(585,156,'ic')+
  box(130,310,460,66,['Measured |β| = 5.00 at f = 2.00 MHz','Collector at AC ground; DC bias remains forward active'])+note('Find fβ and the crossing |β(j2πfT)| = 1 within this exact model.',414)),
 make('bjt-follower-output-port-test','Test the emitter port with the input turned off',
  'In the zero-input incremental circuit an NPN collector is at AC ground. The base sees 7.50 kilohms to ground, emitter sees RE of one kilohm, and ro of fifty kilohms joins collector and emitter. The output test port is the emitter. A separate case connects a 220 ohm AC load and draws ten microamperes from that same port.',
  'Keep RE in the unloaded output-resistance test. Add RL only for the second-case current perturbation.',
  npn(350,190,'Q')+resistor(130,190,295,190,'RB = 7.50 kΩ')+ground(130,190)+path('M380 135V65H540')+ground(380,65)+
  resistor(540,65,540,245,'ro = 50.0 kΩ')+path('M380 245H640')+dot(380,245)+dot(540,245)+text(645,228,'ve')+
  resistor(380,245,380,385,'RE = 1.00 kΩ',-1)+ground(380,385)+
  box(65,430,590,76,['gm = 40.0 mS; rπ = 2.50 kΩ; collector at AC ground','Case 2: add RL = 220 Ω and a +10.0 µA outward current sink'])+
  note('Port test: kill independent input; retain dependent gm(vb − ve).',548),580),
 make('bjt-source-noise-optimum-bias','More collector current does not always reduce total input noise',
  'Three independent one-sided input voltage spectral densities enter a sum: series voltage noise 2qVT squared divided by collector current, shunt current noise 2qIC over beta converted through RS squared, and source resistor thermal noise 4kTRS. The summed density is integrated over the stated band and converted to RMS. Collector bias is the adjustable variable.',
  'The supplied equivalent model is already input referred; independent terms add as variance.',
  box(35,60,420,82,['Series voltage PSD','Se = 2qVT²/IC'])+box(35,177,420,82,['Current-noise voltage PSD','Si RS² = (2qIC/β)RS²'])+box(35,294,420,82,['Source-resistor voltage PSD','4kTRS'])+
  [101,218,335].map(y=>arrow(455,y,515,y)).join('')+box(515,80,165,277,['Sum PSD','Integrate band','Take square root'])+
  note('RS = 10.0 kΩ; β = 100; T = 300 K; band 1.00 to 11.00 kHz',423)+note('5.00 µA ≤ IC ≤ 200 µA; all three equivalent sources uncorrelated',452),485),
 make('bjt-tail-capacitance-cmrr','A capacitive tail weakens common-mode rejection at high frequency',
  'Two matched NPN emitters join at E. Collector one sees five kilohms and collector two 4.75 kilohms to AC ground. Their bases are ideal drives v1 and v2. E connects to AC ground through a hundred kilohms in parallel with one nanofarad. This is the incremental tail network; a separate established DC current sink is omitted from the AC view. Differential output is collector one minus collector two.',
  'Only the collector loads differ. Use the same emitter node for both differential and common-mode drives.',
  npn(220,185,'Q1')+npn(470,185,'Q2')+resistor(250,45,250,130,'RC1 = 5.00 kΩ',-1)+resistor(500,45,500,130,'RC2 = 4.75 kΩ')+
  ground(250,45)+ground(500,45)+text(150,189,'v1','end')+text(400,189,'v2','end')+text(275,128,'vc1','start')+text(525,128,'vc2','start')+
  path('M250 240V275H500V240M375 275V315H280M375 315H500')+dot(375,275)+dot(375,315)+text(396,291,'E','start')+
  resistor(280,315,280,455,'RT = 100 kΩ',-1)+capacitor(500,315,500,455,'CT = 1.00 nF')+path('M280 455H500')+ground(390,455)+
  note('Incremental view: each gm = 40.0 mS; rπ = 2.50 kΩ; ro → ∞',514)+note('vod = vc1 − vc2; established DC tail sink = 2.02 mA',544),575),
 make('mos-source-inductance-die-vgs','The driver voltage is not always the die gate-source voltage',
  'An ideal driver referenced to external ground drives the gate of an NMOS. Its die source and body join at SD. Two nanohenries of common-source inductance lie from SD to external ground, carrying positive iS toward external ground. The drain stays at ten volts. The two supplied current-slope snapshots use the same current direction.',
  'Reference the gate voltage to the moving die source; the body follows SD.',
  mos(350,180,'NMOS')+source(150,235,'vG')+path('M150 180H295M380 125V65M380 235V320')+ground(150,290)+text(380,43,'VD = +10.0 V')+
  inductor(380,320,610,'LS = 2.00 nH')+ground(610,320)+dot(380,320)+text(395,280,'SD and body','start')+arrow(430,365,580,365)+text(505,391,'positive iS toward GND')+
  box(70,430,580,80,['Turn-on: vG = +5.00 V; diS/dt = +0.600 A/ns','Commanded off: vG = 0 V; diS/dt = −1.20 A/ns'])+
  note('GND = 0 V; VTH = 1.80 V; prescribed instantaneous slopes only',546),580),
 make('mos-pair-mismatch-integer-cell-area','Size matched devices by pair variance, then round up the cell count',
  'Two nominally identical NMOS devices have the same fixed overdrive, grounded source and body, and one volt on each drain. Each complete device contains N parallel independent unit cells, with area 25N square micrometres. The supplied coefficients already describe the difference between the complete devices. N is not shown as a solved count.',
  'Both devices use the same integer N. Pair coefficients already include differencing; do not add √2.',
  mos(240,180,'M1')+mos(490,180,'M2')+path('M270 125V65M520 125V65M185 180H105M435 180H365')+
  text(270,43,'VD = +1.00 V')+text(520,43,'VD = +1.00 V')+text(105,155,'Shared VG')+text(380,155,'Shared VG')+
  ground(270,235)+ground(520,235)+box(75,295,255,82,['Device 1: N unit cells','A = 25.0N µm²'])+box(390,295,255,82,['Device 2: N unit cells','A = 25.0N µm²'])+
  box(75,415,570,85,['VOV = 0.200 V; one cell nominal current = 200 µA','Pair: Aβ = 0.0100 µm; AVT = 0.00300 V·µm','Target: 3σε ≤ 1.00%'])+note('Independent, zero-mean pair differences; no systematic gradients',538),570),
 make('mos-two-slope-body-diode-recovery','Recover the body-diode triangle before budgeting switching loss',
  'A diode-current waveform begins at the zero crossing, falls linearly to negative IRM over ta, and returns linearly to zero over tb. Total reverse interval is seventy nanoseconds and tb over ta is 1.80. Forward diode current is positive; the plotted recovery current is negative and IR is its positive magnitude. No computed peak or interval subdivision is labeled.',
  'The whole depicted triangle occurs after the zero crossing; the preceding forward ramp is excluded.',
  arrow(120,300,120,55)+arrow(120,110,670,110)+text(90,68,'iD','end')+text(665,88,'t')+
  path('M160 110L325 270L620 110','var(--diagram-accent, #20b6a3)')+path('M325 270V110','currentColor','4 6')+
  text(160,139,'0')+text(325,139,'ta')+text(620,139,'trr = 70.0 ns')+text(350,278,'−IRM','start')+text(235,185,'Slope = −a','end')+
  text(245,322,'ta')+text(470,322,'tb')+text(380,359,'a = 120 A/µs; S = tb/ta = 1.80')+
  box(85,400,550,83,['IR = −iD during recovery; Qrr = ∫IR dt','Supplied loss: Eadd = VBUS Qrr','VBUS = 48.0 V; one event each 100 kHz cycle']),515),
 make('mos-gate-loop-overshoot-resistor-bound','Damp the gate loop enough to meet the peak-voltage limit',
  'An ideal zero-to-ten-volt step source drives a series one-ohm driver resistance, external gate resistance and twenty-nanohenry gate inductance. The output is across two nanofarads of constant gate capacitance to the Kelvin die source at ground. Initial gate voltage and inductor current are zero. The external resistance is one ohm in the first case and adjustable for the peak constraint.',
  'Both series resistors contribute damping. This is the isolated linear gate-network characterization.',
  source(105,225,'0 → 10.0 V')+path('M105 170V100M105 280V330H625')+
  resistor(105,100,260,100,'RDRV = 1.00 Ω')+resistor(260,100,440,100,'REXT')+inductor(440,100,625,'LG = 20.0 nH')+
  capacitor(625,100,625,330,'CG = 2.00 nF',-1)+dot(625,100)+text(643,77,'VGS','end')+ground(370,330)+
  box(95,385,555,92,['First case: REXT = 1.00 Ω','Initial VGS = 0 V; initial inductor current = 0 A','Design target: peak VGS ≤ 11.50 V'])+
  note('Kelvin source, body and drain at 0 V; no Miller coupling or clamps',520),555)
];
