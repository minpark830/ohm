import {draw,diagram} from './diagram-primitives.js?v=22c97c590ebdf290';
const {box,text,arrow,path,note}=draw;
const entries=[];
function add(name,title,description,caption,body,height=380){entries.push(diagram({slug:`expansion-v6-${name}`,title,description,caption,body,height}));}

add('interleaved-memory-byte-address','Split a byte address across interleaved memory banks',
 'Byte address 0x12AE enters an address split. The byte offset uses the lowest two address bits, the next two bits select one of four interleaved SRAM banks, and the remaining bits select a row. Each bank has 1024 rows of four bytes. No decoded answer is displayed.',
 'The fields show the supplied word-interleaved mapping; decode the target address.',
 text(360,37,'Byte address 0x12AE; four-byte words interleaved across four banks')+
 box(55,73,350,68,['Upper byte-address bits','Bank-local row'])+box(405,73,135,68,['Bits [3:2]','Bank'])+box(540,73,125,68,['Bits [1:0]','Byte offset'])+
 Array.from({length:4},(_,bank)=>box(47+bank*169,210,156,80,[`Bank ${bank}`,'1024 × 4 bytes'])).join('')+
 path('M472 141V177H125M472 177H632M125 177V210M294 177V210M463 177V210M632 177V210')+
 note('No hashing or remapping; every index begins at zero.',347));

add('burst-payload-throughput','Measure useful bandwidth through burst overhead and stalls',
 'At 200 MHz a custom single-edge link sends 64-bit payload beats. Every non-overlapped transaction has two command cycles, sixteen accepted data beats plus three stalled cycles, and one completion cycle. Eight complete transactions run consecutively without overlap or gaps.',
 'Only accepted data beats carry payload; the final completion cycle also counts.',
 text(360,41,'200 MHz, single-edge; 64 payload bits per accepted beat')+
 box(45,95,148,90,['Command','2 cycles'])+box(205,95,299,90,['Data phase','16 accepted + 3 stalled cycles'])+box(517,95,157,90,['Completion','1 cycle'])+
 arrow(45,232,674,232)+text(360,267,'Repeat this full transaction eight times')+
 note('No phase overlap; valid AND ready accepts one data beat.',342));

add('synchronizer-safe-phase-latency','Bound synchronization latency for safe input phases',
 'Two initially zero D flip-flops share a 200 MHz clock with edges zero, five and ten nanoseconds. Both clock-to-Q delays are 0.35 ns; the interstage wire delays 0.25 ns. D1 makes a stable transition at phase phi from 0.25 to 4.25 ns after edge zero, safely away from its setup and hold aperture.',
 'Compute latency only for the stated safe phases; no metastability bound is drawn.',
 box(222,80,137,101,['DFF 1','Q1 initially 0'])+box(489,80,137,101,['DFF 2','Q2 initially 0'])+
 arrow(47,128,222,128)+text(130,108,'D1 transition at φ')+arrow(359,128,489,128)+text(424,108,'Wire: 0.25 ns')+arrow(626,128,681,128)+text(654,108,'Q2')+
 path('M291 181V239M557 181V239M104 239H557')+text(340,271,'Shared rising edges: 0, 5, 10… ns')+
 text(360,307,'Both: tCQ = 0.35 ns; setup = 0.20 ns; hold = 0.10 ns')+
 note('φ ∈ [0.25, 4.25] ns; input remains 1; zero clock skew.',351));

add('cdc-system-mtbf-budget','Combine crossing failure rates before quoting system MTBF',
 'Sixty-four identical synchronizer crossings feed a system-failure monitor: any escaped crossing failure counts as a system failure. The supplied model uses tau forty picoseconds, T0 one picosecond, 250 MHz clock, twenty million input transitions per second, and current resolution time 1.20 ns. The escaping failure processes are independent Poisson processes.',
 'The constants define a hypothetical fitted model; mean intervals are left to solve.',
 box(45,70,259,126,['One crossing model','τ = 40 ps; T0 = 1 ps','fclk = 250 MHz','fdata = 20M transitions/s'])+
 arrow(304,133,377,133)+box(377,70,298,126,['64 identical crossings','Independent escaping failures','Any one is a system failure'])+
 text(360,241,'Current Tres = 1.20 ns; target system MTBF ≥ 10⁹ s')+
 text(360,285,'MTBFcross = exp(Tres/τ) / (T0 × fclk × fdata)')+
 note('Add independent failure rates; no device guarantee is implied.',349));

add('hdl-masked-parity-error','Check even parity only over enabled data lanes',
 'Data a and b each pass through their inclusion mask ma or mb. The parity checker also receives check bit p, which always participates. It emits y for a failed even-parity check. Excluded data values do not participate.',
 'Masks include or exclude data; p always participates, including an empty mask.',
 box(231,68,221,61,['Lane a inclusion'])+box(231,153,221,61,['Lane b inclusion'])+
 arrow(47,98,231,98)+text(127,80,'a, ma')+arrow(47,183,231,183)+text(127,165,'b, mb')+
 path('M452 98H505V214M452 183H484V214')+box(393,214,245,80,['Even-parity check','y = failed check'])+
 arrow(105,252,393,252)+text(245,233,'p, always included')+arrow(638,252,684,252)+text(661,234,'y')+
 note('Settled bits only; no correction or separate valid signal.',350));

add('hdl-round-nearest-even-increment','Round a retained binary value to nearest, ties to even',
 'The retained integer K provides least significant bit l. Its discarded finite tail provides first bit g of weight one half, second bit r of weight one quarter, and s as OR of every still-lower bit. A nearest-even decision emits y to increment K by one.',
 'The supplied bit roles define the fractional tail; implement the increment flag.',
 box(40,73,219,83,['Retained integer K','l = retained LSB'])+box(277,73,96,83,['g','Weight 1/2'])+box(390,73,97,83,['r','Weight 1/4'])+box(505,73,174,83,['Remaining bits','s = OR of tail'])+
 path('M150 156V206H592V156M325 156V206M438 156V206M360 206V232')+
 box(237,232,249,64,['Nearest, ties-to-even'])+arrow(486,263,643,263)+text(568,244,'y = increment')+
 note('Finite nonnegative tail; addition and overflow handling are elsewhere.',348));

add('hdl-round-robin-current-grant','Use saved round-robin priority only when requests compete',
 'Requests r0 and r1, saved priority prefer1, and enable en enter a custom two-client selector. A sole request wins when enabled; saved priority breaks only a tie. The output y is current grant0. Separate priority state updates only after actual acceptance.',
 'This draws current selection, not the separate priority-state update.',
 box(266,76,247,164,['Two-client selection','Sole requester wins','Tie uses saved priority'])+
 arrow(49,117,266,117)+text(151,99,'en')+arrow(49,171,266,171)+text(151,153,'r0, r1')+arrow(49,222,266,222)+text(151,204,'prefer1')+
 arrow(513,159,664,159)+text(589,139,'y = grant0')+
 note('en = 0 suppresses; prefer1 = 1 favors client 1 in a tie.',302)+
 note('Separate state changes only when a grant is accepted.',346));

add('hdl-two-bit-carry-lookahead','Collapse a two-bit ripple carry into a lookahead flag',
 'Scalar operand bits a1 a0 and b1 b0 plus incoming carry ci enter an unsigned two-bit adder. Low sum bits are handled elsewhere. y is the carry beyond bit one, indicating exact mathematical sum at least four. No carry Boolean expression is drawn.',
 'Compute the carry-out from scalar inputs; this is unsigned carry, not signed overflow.',
 box(256,82,250,159,['Unsigned two-bit addition','A = 2a1 + a0','B = 2b1 + b0'])+
 arrow(48,117,256,117)+text(144,99,'a1, a0')+arrow(48,175,256,175)+text(144,157,'b1, b0')+arrow(48,225,256,225)+text(144,207,'ci')+
 arrow(506,132,660,132)+text(582,112,'y = carry-out')+arrow(506,207,660,207)+text(582,186,'Low sum elsewhere')+
 note('No vector arithmetic in this workbench; all inputs are known bits.',345));

export const v6DigitalDiagrams=entries;
