import {draw,diagram} from './diagram-primitives.js?v=22c97c590ebdf290';
const {box,text,arrow,path,note}=draw;
const entries=[];
const add=(slug,title,description,caption,body,height=380)=>entries.push(diagram({slug:`expansion-v8-${slug}`,title,description,caption,body,height}));

add('shortened-secded-storage','Count the check bits before packing the memory word',
 'A twenty-four-bit payload enters a shortened Hamming encoder with r ordinary check bits, followed by one extra overall parity bit. The codeword has no metadata or byte padding. The unknown Hamming count and total storage width are left to solve.',
 'The ordinary syndrome-location budget and extra overall parity are separate.',
 box(42,70,174,87,['24-bit payload','No padding'])+arrow(216,114,268,114)+box(268,70,205,87,['Shortened Hamming','r check bits to find'])+arrow(473,114,525,114)+box(525,70,151,87,['Overall parity','One extra bit'])+
 text(360,219,'Choose the smallest r satisfying 2ʳ ≥ 24 + r + 1')+
 box(155,257,410,55,['Stored word: payload + Hamming + overall parity'])+
 note('Efficiency = payload bits / all stored bits; no byte rounding.',356));

add('clock-gate-enable-phase','An enable change during clock high can cut a pulse short',
 'The source clock is high from zero to five, ten to fifteen, and twenty to twenty-five nanoseconds. Enable rises at two and falls at thirteen nanoseconds. A raw AND and a low-level-transparent latch followed by an AND are compared. The initial latch is zero; solved output waveforms are omitted.',
 'Track the latch during each low phase before drawing either output.',
 text(360,32,'Given waveforms; zero-delay ideal model')+
 text(94,87,'clk','end')+path('M115 68H215V101H315V68H415V101H515V68H615')+
 text(94,153,'en','end')+path('M115 167H155V134H375V167H615')+
 [0,5,10,15,20,25].map((v,i)=>text(115+i*100,194,`${v} ns`)).join('')+
 box(74,238,223,73,['raw = clk AND en'])+box(343,238,303,73,['L follows en when clk is LOW','gated = clk AND L'])+
 note('Enable rises at 2 ns, falls at 13 ns; L initially 0.',357));

add('branch-flush-pipeline-drain','Flush younger work without discarding the branch',
 'A four-stage F, D, E, C pipeline advances one stage per four-nanosecond cycle. Branch B is fetched in cycle three and resolves at the end of execute in cycle five. Wrong-path W0 and W1 are squashed; T0 fetch starts in cycle six. Five useful targets must still drain through commit.',
 'The redirect discards younger work; commitment is at the end of stage C.',
 ['F: fetch','D: decode','E: execute','C: commit'].map((label,i)=>box(42+i*169,65,147,66,[label])).join('')+
 arrow(189,98,211,98)+arrow(358,98,380,98)+arrow(527,98,549,98)+
 box(42,180,286,102,['B fetched in cycle 3','Resolves at end of E, cycle 5','W0 and W1 are younger'])+
 box(365,180,313,102,['Target T0 fetched in cycle 6','Then T1, T2, T3, T4','No fetch after T4'])+
 note('Cycle k spans [4(k−1), 4k) ns; commit happens at its end.',354));

add('majority-voter-common-cause','A majority vote does not remove the common-cause term',
 'Each decision selects disjoint common-cause or no-common-cause branches. Common cause has probability 0.002 and makes all three reports wrong. Otherwise channels A, B and C independently flip with probabilities 0.010, 0.030 and 0.020 and feed a perfect binary majority voter. No combined probabilities are shown.',
 'The channel flip probabilities are conditional on common cause being absent.',
 box(44,56,281,94,['Common cause C','Probability 0.002','All reports complemented'])+
 box(44,196,281,115,['No common cause','Conditional independent flips','A: 0.010; B: 0.030; C: 0.020'])+
 arrow(325,104,409,104)+arrow(325,251,409,251)+path('M409 104V251M409 178H455')+
 box(455,131,220,93,['Perfect majority voter','Wrong if ≥2 wrong'])+
 note('One binary decision interval; no voter faults or erasures.',359));

add('hdl-natural-alignment-valid','Reject an unaligned transfer and the reserved size code',
 'A custom memory-port predicate receives transfer-size bits s1 s0 and byte-address low bits a1 a0. Size codes select one, two or four bytes; code eleven is reserved. The predicate emits y only for a legal naturally aligned request. No solved Boolean expression is shown.',
 'Natural alignment uses transfer size; the reserved code always fails.',
 box(49,66,264,111,['Size s1 s0','00: 1 byte; 01: 2 bytes','10: 4 bytes; 11: reserved'])+
 box(49,212,264,65,['Byte-address low bits a1 a0'])+
 arrow(313,122,392,122)+arrow(313,245,392,245)+box(392,102,240,160,['Legal size?','Naturally aligned?'])+
 arrow(632,182,684,182)+text(658,162,'y')+
 note('Custom port contract; upper address bits are arbitrary.',355));

add('hdl-two-consumer-fork-release','Keep a forked beat until both consumers have accepted it',
 'One held valid beat is forked to consumers zero and one. State bits a0 and a1 remember prior acceptance of that same beat, while r0 and r1 describe readiness at the upcoming edge. A release predicate outputs y only once both consumers have completed by that edge. State updates are separate.',
 'An earlier acceptance counts even when that consumer is no longer ready.',
 box(44,108,190,103,['One held beat','valid; stable data'])+
 arrow(234,140,328,100)+arrow(234,179,328,250)+
 box(328,55,314,90,['Consumer 0','a0: accepted earlier; r0: ready now'])+box(328,205,314,90,['Consumer 1','a1: accepted earlier; r1: ready now'])+
 note('Release y only when both are done; do not send a duplicate.',358));

add('hdl-crc3-enabled-middle-state','Advance a streaming CRC tap only when a bit is accepted',
 'Pre-edge scalar state bits q2 q1 q0 represent polynomial q2 x squared plus q1 x plus q0. Enabled input d advances the polynomial by taking the remainder of xR plus d x cubed modulo x cubed plus x plus one. A disabled edge holds the state. Only the next middle state bit y is requested.',
 'The polynomial convention fixes where the incoming bit enters before reduction.',
 ['q2: x²','q1: x','q0: 1'].map((label,i)=>box(170+i*124,61,124,67,[label])).join('')+
 path('M356 128V173')+box(202,173,397,83,['If en: remainder of xR + d x³','G(x) = x³ + x + 1'])+
 arrow(41,213,202,213)+text(118,192,'en, d')+
 arrow(401,256,401,304)+text(450,302,'y = next q1','start')+
 note('If disabled, hold state and consume no input bit.',357));

add('hdl-gray-fifo-next-full','Compare the next Gray pointer against a full-distance target',
 'A four-entry asynchronous FIFO comparison uses upper next-write Gray bits wn2 wn1, upper synchronized read Gray bits r2 r1, and precomputed low-bit equality eq0. The write pointer includes a separately chosen candidate advance. The synchronized read snapshot may lag. No full-flag Boolean answer is shown.',
 'Compare the NEXT write pointer with a synchronized read snapshot, not a raw remote bus.',
 box(43,63,288,92,['Candidate NEXT write Gray','wn2, wn1; low bit wn0'])+
 box(43,213,288,92,['Synchronized read Gray','r2, r1; low bit r0'])+
 arrow(331,111,405,111)+arrow(331,260,405,260)+box(405,98,271,169,['Four-entry distance test','eq0 supplies wn0 = r0','y = next-full'])+
 note('Depth 4; pointers modulo 8; reflected Gray encoding.',356));

export const v8DigitalDiagrams=entries;
