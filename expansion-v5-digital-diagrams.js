import {draw,diagram} from './diagram-primitives.js?v=d8a3ac5afc6a4ca2';
const {box,text,arrow,path,dot,note,flow}=draw;
const entries=[];
function add(name,title,description,caption,body,height=380){entries.push(diagram({slug:`expansion-v5-${name}`,title,description,caption,body,height}));}

add('uart-framing-latency','Budget UART time including every framing bit',
 'A 128-byte payload is framed into separate 8N1 and 8E2 streams at 230400 baud. 8N1 includes start, eight data and one stop bit. 8E2 adds an even parity bit and uses two stop bits. There are no extra gaps.',
 'The two rows show specified frame fields, not calculated transfer times.',
 text(360,40,'128 payload bytes; 230400 baud; no extra inter-frame gap')+
 text(60,116,'8N1','start')+box(126,82,82,65,['Start'])+box(208,82,302,65,['8 data bits'])+box(510,82,132,65,['1 stop'])+
 text(60,227,'8E2','start')+box(126,193,82,65,['Start'])+box(208,193,230,65,['8 data bits'])+box(438,193,92,65,['Parity'])+box(530,193,112,65,['2 stops'])+
 arrow(126,289,642,289)+text(384,317,'Repeat one frame for each payload byte')+note('Measure through the end of the final stop bit.',354));

add('fractional-enable-spacing','Separate average enable rate from tick spacing',
 'An accumulator stores a modulo-ten value, initially zero. A one-hundred-megahertz clock adds three every rising edge. A comparison with ten selects whether to subtract ten and assert a one-cycle enable event.',
 'Trace the accumulator and event on rising clock edges; the event is an enable.',
 box(45,104,155,92,['Accumulator a','Reset value 0'])+arrow(200,150,260,150)+box(260,104,175,92,['t = old a + 3'])+
 arrow(435,150,498,150)+box(498,86,178,130,['If t ≥ 10:','event = 1; a = t − 10','Else:','event = 0; a = t'])+
 path('M586 216V275H122V196')+arrow(122,239,122,196)+text(360,300,'Every rising edge of the 100 MHz system clock')+
 note('Modulus 10; no additional reset; one-cycle events.',347));

add('fifo-stall-buffer-budget','Keep a burst through a downstream stall',
 'An initially empty FIFO receives one word at each of eight rising edges. The consumer-ready values are one, one, zero, zero, zero, one, one, one. No empty bypass is allowed; a same-edge pop frees a slot for a push.',
 'This is the offered traffic and ready schedule; occupancy is left to determine.',
 text(360,38,'Initial FIFO empty; producer offers one word at every edge')+
 box(42,86,178,88,['Producer','No backpressure'])+arrow(220,130,270,130)+box(270,86,180,88,['FIFO','Depth = ?'])+arrow(450,130,500,130)+box(500,86,178,88,['Consumer','Ready schedule below'])+
 text(90,221,'Edge','start')+text(90,262,'ready','start')+
 Array.from({length:8},(_,i)=>text(225+i*58,221,String(i+1))+text(225+i*58,262,String([1,1,0,0,0,1,1,1][i]))).join('')+
 note('Pop requires pre-edge data; no empty bypass.',314)+note('A simultaneous pop frees a slot for that edge’s push.',346));

add('crc-codeword-syndrome','Verify a CRC with explicit bit-order conventions',
 'The six-bit payload 110101 is followed by three zeros and divided over GF(2) by generator 1011, equivalent to x cubed plus x plus one. The computed three-bit field replaces the zeros. The third bit from the left of the nine-bit codeword is inverted for the receiver check.',
 'Bit order and augmentation are specified; neither computed remainder is drawn.',
 box(40,75,245,90,['Payload: 110101','Append exactly 000'])+arrow(285,120,355,120)+box(355,75,325,90,['GF(2) division by 1011','CRC = remainder, three bits'])+
 path('M518 165V192H164V214')+box(40,214,247,86,['Codeword = payload + CRC','9 bits; flip bit 3 from left'])+
 arrow(287,257,355,257)+box(355,214,325,86,['Receiver: divide by 1011','Append NO extra zeros'])+
 note('G(x) = x³ + x + 1; MSB first; no reflection or final XOR.',353));

add('hdl-exactly-one-mode','Reject zero-hot and multi-hot mode settings',
 'Three settled mode bits m2, m1 and m0 enter an exact-one legality check. Only the supplied legal patterns 001, 010 and 100 should assert one-bit y. All other patterns must be rejected.',
 'The listed legal patterns are input specifications, not a submitted assignment.',
 flow(['m2','m1','m0'],['Exact-one legality','Legal: 001, 010, 100'],['y = legal'],'Reject every zero-hot or multi-hot known-bit pattern.'));

add('hdl-spi-sample-edge','Select the sampling edge in all four SPI modes',
 'Inputs cs_n, cpol, cpha and rise enter a combinational SPI edge selector. CPOL defines the idle level; CPHA zero selects the leading edge, and CPHA one selects the trailing edge. rise describes the candidate edge. y is the selected sample decision.',
 'rise is an edge-description bit, not the serial clock level.',
 flow(['cs_n','cpol, cpha','rise: candidate edge'],['SPI sample selector','Leading: away from idle','Trailing: toward idle'],['y = sample'],'cs_n = 1 deselects; cpha = 0 leading, cpha = 1 trailing.'));

add('hdl-queue-accept-replacement','Accept a full-queue replacement without accepting illegal state',
 'A two-word custom queue has occupancy encodings 00 empty, 01 one word, 10 full and 11 illegal. Inputs rst, valid and ready combine with count bits c1 and c0 to decide if an incoming word is accepted. A same-edge pop frees a full-queue slot; reset and illegal count reject.',
 'Compute the admission flag only; storage and the edge update are separate.',
 box(252,77,218,187,['Custom 2-word queue','00 empty / 01 one word','10 full / 11 illegal','No empty bypass'])+
 arrow(50,112,252,112)+text(145,94,'rst')+arrow(50,155,252,155)+text(145,137,'c1 c0')+arrow(50,213,252,213)+text(145,194,'valid')+
 arrow(646,213,470,213)+text(570,194,'consumer ready')+arrow(470,112,646,112)+text(570,94,'y = input accepted')+
 note('Full + pop may accept a replacement; rst = 1 suppresses transfers.',331));

add('hdl-secded-data-correction','Distinguish a data correction from a parity-bit error',
 'Conventional extended Hamming positions one through eight are labeled: check bits at one, two and four; payload at three, five, six and seven; overall parity at eight. The classifier receives valid, failed overall parity odd, and syndrome s2 s1 s0 and emits a payload-correction flag.',
 'The decoder receives syndrome and overall parity results; it does not recompute them.',
 text(360,35,'Extended Hamming (8,4), even parity; at most two errors')+
 Array.from({length:8},(_,i)=>box(43+i*79,71,75,68,[String(i+1),[1,2,4].includes(i+1)?'Check':i===7?'Overall':'Data'])).join('')+
 box(247,202,237,86,['Correction classifier','Payload correction only'])+
 arrow(57,227,247,227)+text(145,210,'valid, odd')+arrow(57,270,247,270)+text(145,254,'s2 s1 s0')+
 arrow(484,247,656,247)+text(571,227,'y = flip payload')+note('S = 4s2 + 2s1 + s0; odd = failed overall-even-parity check.',344));

export const v5DigitalDiagrams=entries;
