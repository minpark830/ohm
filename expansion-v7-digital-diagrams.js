import {draw,diagram} from './diagram-primitives.js?v=5601ad9fd5efe681';
const {box,text,arrow,path,note}=draw;
const entries=[];
const add=(slug,title,description,caption,body,height=380)=>entries.push(diagram({slug:`expansion-v7-${slug}`,title,description,caption,body,height}));

add('cache-associative-address-fields','A way is not another address-index field',
 'A 32-bit byte address is divided into an upper tag, a set index and a low byte offset. An indexed set compares tags across eight parallel ways. The cache holds 16 KiB of data with 64 bytes per line. Field widths and the number of sets remain to be found.',
 'Use data capacity to count sets; ways are compared within a selected set.',
 text(360,39,'32-bit physical byte address')+
 box(47,69,284,68,['Upper tag','Width to find'])+box(331,69,186,68,['Set index','Width to find'])+box(517,69,156,68,['Byte offset','Width to find'])+
 path('M424 137V174H360V197')+box(168,197,384,94,['Selected set: eight parallel ways','64 data bytes per line'])+
 note('16 KiB data capacity; metadata excluded; no address hashing.',349));

add('fixed-point-negative-product-floor','Drop fractional product bits with the stated negative rounding rule',
 'Signed sixteen-bit hexadecimal inputs F68B and 0A35 each have twelve fractional bits. A full signed thirty-two-bit product feeds a floor quantizer that retains eight fractional bits in signed sixteen-bit output Y. The error is output minus exact product, measured in output LSB.',
 'Decode signed inputs, retain a full product, then apply the supplied floor rule.',
 box(40,65,211,83,['Araw = 0xF68B','16-bit signed; ÷4096'])+box(40,173,211,83,['Braw = 0x0A35','16-bit signed; ÷4096'])+
 path('M251 106H286V156H316M251 214H286V156')+
 box(316,109,161,92,['Full product P','32-bit signed'])+arrow(477,155,520,155)+box(520,109,159,92,['Floor P/65536','16-bit signed Y'])+
 text(360,297,'Exact real product: P/2²⁴; represented output: Y/256')+
 note('One output LSB = 1/256; error sign is output minus exact.',350));

// These bands show given stability intervals only, not the solved T interval.
add('sram-write-end-window','Intersect every setup and hold limit before ending the write',
 'A pin-level timeline shows address stable from 3 to 40 ns, CE low from 5 to 42 ns, WE falling at 8 ns with an unknown rising end T before 42 ns, and data stable from 18 to 31 ns. OE remains high. Timing minima are supplied in the question; no solved write-end interval is drawn.',
 'Bars show supplied pin intervals; intersect setup, pulse-width and hold limits.',
 text(360,30,'Pin times in ns; bars show givens, not the solved end window')+
 text(116,91,'Address','end')+box(156,63,440,44,['Stable: 3…40 ns'])+
 text(116,151,'CE#','end')+box(178,123,440,44,['Low: 5…42 ns'])+
 text(116,214,'WE#','end')+path('M146 191H211V221H495V191H619')+text(217,246,'Fall: 8 ns','start')+text(499,181,'Rise: T < 42 ns','start')+
 text(116,300,'Data','end')+box(327,272,154,44,['Stable: 18…31 ns'])+
 note('OE# stays high; each limiting equality meets the stated minimum.',365),395);

add('burst-page-boundary-segmentation','Split at both the page edge and controller burst cap',
 'A contiguous 27-beat write begins at hexadecimal byte address 1FB0. Each beat has eight bytes. A controller divides it into longest legal bursts, each at most sixteen beats and wholly within one aligned 4096-byte page. A page boundary is drawn schematically; no burst counts or solved endpoint addresses are shown.',
 'Apply both limits again after each burst; the last written byte is inclusive.',
 box(47,62,253,90,['Contiguous write','27 beats × 8 bytes'])+box(421,62,253,90,['Custom controller','At most 16 beats per burst'])+
 text(360,191,'Increasing byte addresses; initial address 0x1FB0')+
 arrow(58,240,666,240)+path('M367 209V276','currentColor','5 5')+text(367,300,'Aligned 4096-byte page boundary')+
 note('A burst may end at a page edge, but it may not cross it.',349));

add('hdl-two-phase-pending','A completed toggle must be acknowledged before it is idle',
 'Settled same-domain request and acknowledgment phases enter a phase-state pending detector, with a reporting enable. Equal phases mean idle, while an unmatched toggle remains outstanding. Separate synchronization and protocol state updates are outside this one-bit function.',
 'The enable masks reporting; it never acknowledges an outstanding event.',
 box(265,69,254,164,['Two-phase pending flag','Equal phases: idle','Unmatched toggle: pending'])+
 arrow(47,105,265,105)+text(149,86,'req')+arrow(47,164,265,164)+text(149,145,'ack')+arrow(47,218,265,218)+text(149,199,'en')+
 arrow(519,151,675,151)+text(598,131,'y')+
 note('req and ack already synchronized into the same observation domain.',301)+
 note('State updates and CDC implementation are separate.',349));

add('hdl-signed-times-four-fit','Check the sign extension before shifting two places',
 'Four input bits a3 a2 a1 a0 encode a signed four-bit two’s-complement integer A. An exact multiply-by-four fit decision produces y for a product in the range minus eight through plus seven. No wrapped result or solved Boolean expression is shown.',
 'Test the exact product range before any four-bit truncation.',
 text(360,37,'Signed four-bit operand A; a3 is the sign bit')+
 ['a3','a2','a1','a0'].map((label,i)=>box(150+i*106,73,106,64,[label])).join('')+
 path('M362 137V184')+box(214,184,298,80,['Does exact 4×A fit','the signed range −8…+7?'])+
 arrow(512,224,657,224)+text(588,205,'y = fits')+
 note('No wrap or saturation; implement a scalar predicate only.',349));

add('hdl-radix4-booth-negative','A high recoding bit does not always mean a negative partial product',
 'Overlapping group bits h m l and enable en enter a radix-four Booth sign-decision block. The supplied signed digit is D equals minus two h plus m plus l. The output y flags an enabled strictly negative digit, not zero. Magnitude selection and accumulation are elsewhere.',
 'Use the supplied signed digit definition; zero requests no negative partial product.',
 box(45,70,211,88,['Group h m l','l is overlapping bit'])+arrow(256,114,322,114)+box(322,70,345,88,['Supplied recoding rule','D = −2h + m + l'])+
 path('M495 158V207')+box(322,207,345,74,['Enabled negative-digit decision'])+arrow(45,244,322,244)+text(181,223,'en')+
 arrow(495,281,495,318)+text(532,315,'y','start')+
 note('Magnitude, negation and accumulation are separate datapath functions.',358));

add('hdl-alu-less-equal-flags','Choose signed or unsigned ordering from the same subtraction',
 'One subtraction A minus B supplies sign n, overflow v, carry c and zero z to a signed-or-unsigned less-than-or-equal selector controlled by u. Carry one means no unsigned borrow. Mode u one selects unsigned, and mode zero selects signed. The block emits y and includes equality.',
 'Flags come from the same subtraction; carry follows the stated no-borrow convention.',
 box(41,73,235,111,['A − B flags','n, v, c, z','c = 1: no borrow'])+arrow(276,128,346,128)+box(346,73,327,111,['Selected A ≤ B predicate','u = 1: unsigned','u = 0: signed'])+
 arrow(169,250,510,250)+path('M510 250V184')+text(273,230,'u, interpretation select')+
 arrow(673,128,699,128)+text(687,106,'y')+
 note('All known flag patterns have explicitly defined checker behavior.',349));

export const v7DigitalDiagrams=entries;
