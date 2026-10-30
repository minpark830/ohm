import {draw,diagram} from './diagram-primitives.js?v=5601ad9fd5efe681';
const {path,text,dot,ground,arrow,resistor,capacitor,current,box,npn,mos,note}=draw;
const make=(name,title,description,caption,body,height=460)=>diagram({slug:`expansion-v7-${name}`,title,description,caption,body,height});

export const v7TransistorDiagrams=[
 make('bjt-vbe-multiplier-base-loading',"Base current slightly stretches the bias spread",
  'A 2.00 mA source injects current into the NPN collector node. A 2.00 kilohm resistor joins collector to base, and a 1.00 kilohm resistor joins base to grounded emitter. The base-collector resistor supplies base current as well as the lower resistor current.',
  'Include the base current when applying KCL to the two resistor junctions.',
  current(460,75,'IT = 2.00 mA',true)+path('M460 20V8M460 130V190')+text(100,35,'Positive supply; sufficient compliance','start')+
  npn(430,245,'NPN')+resistor(275,130,275,245,'RCB = 2.00 kΩ',-1)+path('M275 130H460M275 245H375')+
  resistor(275,245,275,355,'RBE = 1.00 kΩ',-1)+path('M460 300V355H275')+ground(370,355)+dot(275,245)+dot(460,130)+
  text(240,249,'B','end')+text(485,180,'C','start')+text(485,333,'E','start')+arrow(295,165,295,207)+text(315,183,'IRCB','start')+
  note('VBE = 0.650 V; β = 99; ro → ∞; emitter reference = 0 V',411)),
 make('bjt-recombining-storage-charge',"Removing stored charge also allows recombination",
  'An NPN has initially 120 nanocoulombs of excess stored charge. A reverse base current extracts charge outward from its base. While charge is positive, the supplied rate law contains both constant extraction and exponential recombination with a four microsecond lifetime. Stop this model at the first zero charge.',
  'The storage boundary is the first Q = 0; collector fall time is outside this model.',
  npn(330,215,'NPN switch')+path('M360 160V105M360 270V325')+text(360,85,'Load-limited collector current')+ground(360,325)+
  arrow(275,215,145,215)+text(195,190,'IR outward from base')+text(195,248,'First case: 20.0 mA')+
  box(90,15,525,48,['Initially Q0 = 120 nC; τs = 4.00 µs'])+
  box(95,360,530,66,['While Q ≥ 0: dQ/dt = −IR − Q/τs','Second case: finish storage within 2.00 µs']),475),
 make('bjt-collector-shot-noise-referral',"Refer collector shot noise back to the input",
  'The AC collector node connects to ground through a four kilohm resistor and two parallel current sources: the dependent signal current gm times base input, and the only noise source with one-sided density 2qIC. The emitter is grounded and the base source is ideal. A brick-wall output measurement passes 100 hertz to 20.100 kilohertz.',
  'Only the specified collector shot noise is included; RC noise and all other sources are excluded.',
  path('M155 105H565M155 315H565')+resistor(155,105,155,315,'RC = 4.00 kΩ',-1)+current(330,210,'gm vIN',true,true)+
  path('M330 105V155M330 265V315')+current(565,210,'in',true)+path('M565 105V155M565 265V315')+ground(330,315)+dot(330,105)+
  text(350,85,'vOUT at collector')+text(600,280,'Si = 2qIC','end')+
  box(165,355,400,63,['IC = 0.500 mA; VT = 25.00 mV','Measurement: 100 Hz to 20.100 kHz'])+
  note('gm = IC/VT; ro → ∞; source and emitter at AC ground',453),490),
 make('bjt-partial-bypass-pole-zero',"A partial emitter bypass creates both a zero and a pole",
  'In the supplied AC circuit the ideal input directly fixes base voltage. Collector RC and RL are each five kilohms to AC ground. The emitter connects through RE1 of one hundred ohms to node X; RE2 of nine hundred ohms and CE of ten microfarads both join X to ground in parallel. The transistor has finite r-pi and infinite output resistance.',
  'CE bypasses RE2 only; retain RE1 and the finite base-current contribution.',
  npn(315,190,'Q')+path('M135 190H260')+text(125,194,'vIN','end')+
  resistor(345,35,345,135,'RC = 5.00 kΩ',-1)+ground(345,35)+path('M345 135H560')+
  resistor(560,135,560,255,'RL = 5.00 kΩ')+ground(560,255)+dot(345,135)+text(580,123,'vOUT')+
  resistor(345,245,345,335,'RE1 = 100 Ω',-1)+dot(345,335)+path('M345 335H560')+text(325,340,'X','end')+
  resistor(345,335,345,465,'RE2 = 900 Ω',-1)+capacitor(560,335,560,465,'CE = 10.0 µF')+path('M345 465H560')+ground(450,465)+
  note('AC model: gm = 40.0 mS; rπ = 2.50 kΩ; ro → ∞',525),560),
 make('mos-subthreshold-decade-swing',"Below threshold does not mean zero current",
  'The NMOS source and body are grounded and its drain is fixed at positive one volt. Its gate is set by an ideal voltage source. A box states the supplied weak-inversion exponential current law, reference bias and slope parameters. No hard zero-current cutoff is assumed.',
  'Use the exponential model over the full stated range; gate current and extra leakage are excluded.',
  mos(355,205,'NMOS')+path('M385 150V95M385 260V325M300 205H145')+text(385,75,'VD = +1.00 V')+
  text(135,209,'VGS','end')+ground(385,325)+text(430,299,'Source and body: 0 V','start')+
  box(105,355,510,72,['ID = IREF exp[(VGS − VREF)/(nUT)]','IREF = 1.00 µA; VREF = 0.350 V; n = 1.50; UT = 25.00 mV'])+
  note('First test: VGS = 0.275 V; positive ID flows from drain to source',462),495),
 make('mos-transmission-gate-resistance-envelope',"Find the weak point of a complementary analog switch",
  'An NMOS and PMOS connect in parallel between ports A and B. NMOS gate is 3.30 volts and its body is zero; PMOS gate is zero and its body 3.30 volts. The two ports have common voltage v plus an infinitesimal differential test voltage. Use the specified conductance curves and add the parallel conductances.',
  'The exercise explicitly excludes body effect, even with the bodies tied to opposite rails.',
  path('M130 80H555M130 300H555')+dot(130,80)+dot(130,300)+text(105,85,'A','end')+text(105,305,'B','end')+
  mos(300,190,'N')+path('M330 80V135M330 245V300M245 190H165')+text(170,165,'Gate 3.30 V')+
  mos(525,190,'P',true)+path('M555 80V135M555 245V300M470 190H405')+text(435,165,'Gate 0 V')+
  text(330,337,'Body 0 V')+text(555,337,'Body 3.30 V')+
  arrow(110,105,110,270)+text(90,192,'δv','end')+
  box(125,370,470,74,['gn(v) = kn max(3.30 − v − 0.600, 0)','gp(v) = kp max(v − 0.600, 0)'])+
  note('kn = 2.00 mS/V; kp = 1.00 mS/V; 0 ≤ v ≤ 3.30 V; δv → 0',478),510),
 make('mos-nonlinear-output-charge-energy',"A capacitance curve has different charge and energy integrals",
  'The only drain charge path is a reversible nonlinear differential capacitor from drain to grounded source, with gate and body also clamped to zero. A twenty milliampere ideal current source charges the drain from zero to forty volts. The capacitor law is Cdiff equals two nanofarads divided by one plus voltage over ten volts.',
  'This off-state lumped model uses dQ = Cdiff(V)dV and dE = VdQ.',
  current(230,185,'I = 20.0 mA',false)+path('M230 130V95H480M230 240V320H480')+
  capacitor(480,95,480,320,'Cdiff(V)')+ground(360,320)+dot(480,95)+text(495,75,'Drain V: 0 → 40.0 V','start')+
  text(455,145,'+')+text(455,285,'−')+box(140,365,440,72,['Cdiff(V) = 2.00 nF/(1 + V/10.0 V)','Gate, source and body: 0 V; Q(0) = E(0) = 0'])+
  note('VTH = +1.80 V; channel off; no breakdown, hysteresis or dissipation',475),510),
 make('mos-common-source-feedforward-zero',"Gate-drain feedforward adds a right-half-plane zero",
  'The ideal input drives the gate through ten kilohms. One hundred picofarads connect gate to ground, gate to drain, and drain to ground. At the drain, RD and ro are each twenty kilohms to ground, represented by their parallel combination, and a controlled source gm times gate voltage points from drain to grounded source. Cgd remains a bridge between the two unknown node voltages.',
  'Use both node equations; a real positive-s zero is not a sinusoidal frequency notch.',
  resistor(75,105,240,105,'RG = 10.0 kΩ')+text(62,110,'vIN','end')+dot(240,105)+text(240,76,'vg')+
  capacitor(240,105,420,105,'Cgd = 100 pF')+dot(420,105)+path('M420 105H640')+text(420,76,'vd = vOUT')+
  capacitor(240,105,240,300,'Cgs = 100 pF',-1)+capacitor(420,105,420,300,'')+
  resistor(520,105,520,300,'')+current(640,202,'gm vg',true,true)+path('M640 105V147M640 257V300M240 300H640')+ground(420,300)+
  text(420,338,'CL = 100 pF')+text(535,338,'RD ∥ ro')+
  box(105,405,510,66,['gm = 1.00 mS; RD = ro = 20.0 kΩ','Source and body at AC ground; all capacitors constant']),505)
];
