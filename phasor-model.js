// Rectangular/polar phasors and complex Ohm's law use the same complex arithmetic.
// Reference: https://ocw.mit.edu/courses/es-1803-differential-equations-spring-2024/mites_1803_s24_complex_impedance.pdf
// Numbers use ordinary double precision. Nothing here parses expressions or
// infers units, frequency, peak/RMS conventions, or a circuit's topology.
const maxAngle = 1e9;
const rangeError = () => new RangeError('The result is outside this calculator’s numeric range. Use less extreme values.');
const zero = value => value === 0 ? 0 : value;

function number(value, label) {
 if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${label} must be a finite number.`);
 return zero(value);
}

function components(value) {
 if (!value || typeof value !== 'object' || Array.isArray(value) || !Object.hasOwn(value,'re') || !Object.hasOwn(value,'im')) throw new TypeError('A phasor needs finite real and imaginary components.');
 return {re:number(value.re,'Real component'),im:number(value.im,'Imaginary component')};
}

function angle(value) {
 const wrapped = value % 360;
 return zero(wrapped > 180 ? wrapped - 360 : wrapped <= -180 ? wrapped + 360 : wrapped);
}

export function describePhasor(value) {
 const {re,im} = components(value), magnitude = Math.hypot(re,im);
 if (!Number.isFinite(magnitude)) throw rangeError();
 return {re,im,magnitude,angleDegrees:magnitude === 0 ? null : angle(Math.atan2(im,re) * (180 / Math.PI))};
}

export const rectangular = describePhasor;

export function fromPolar(magnitude,angleDegrees) {
 number(magnitude,'Magnitude');number(angleDegrees,'Angle in degrees');
 if (magnitude < 0) throw new RangeError('Magnitude must be zero or greater.');
 if (Math.abs(angleDegrees) > maxAngle) throw new RangeError('Use an angle from −1,000,000,000° to +1,000,000,000°.');
 if (magnitude === 0) return describePhasor({re:0,im:0});
 const degrees = angle(angleDegrees), radians = degrees * (Math.PI / 180);
 // Exact axes avoid showing a tiny trigonometric residue as a real component.
 const re = degrees === 90 || degrees === -90 ? 0 : degrees === 180 ? -magnitude : degrees === 0 ? magnitude : magnitude * Math.cos(radians);
 const im = degrees === 0 || degrees === 180 ? 0 : degrees === 90 ? magnitude : degrees === -90 ? -magnitude : magnitude * Math.sin(radians);
 if (re === 0 && im === 0) throw rangeError();
 return describePhasor({re,im});
}

// A scaled real number is m × 2^e. Keeping the exponent separate allows
// division and products to finish before rejecting a genuinely overflowing
// result. This also preserves a tiny imaginary component beside a large real
// component; scaling an entire phasor by its largest component would lose it.
function scaled(m,e=0) {
 if (m === 0) return {m:0,e:0};
 const shift = Math.max(-1074,Math.min(1023,Math.floor(Math.log2(Math.abs(m)))));
 return {m:m / 2 ** shift,e:e + shift};
}

function product(a,b) {
 if (a === 0 || b === 0) return {m:0,e:0};
 const left = scaled(a), right = scaled(b);
 return scaled(left.m * right.m,left.e + right.e);
}

function sum(a,b) {
 if (a.m === 0) return b;
 if (b.m === 0) return a;
 const e = Math.max(a.e,b.e);
 return scaled(a.m * 2 ** (a.e-e) + b.m * 2 ** (b.e-e),e);
}

const negate = value => ({m:-value.m,e:value.e});
const quotient = (a,b) => a.m === 0 ? a : scaled(a.m/b.m,a.e-b.e);

function valueOf(value) {
 if (value.m === 0) return 0;
 if (value.e > 1023) throw rangeError();
 // Split subnormal scaling so 2^e is not rounded to zero before the
 // significand participates. Reject underflow instead of returning false zero.
 const result = value.e < -1022 ? (value.m * 2 ** (value.e+1022)) * 2 ** -1022 : value.m * 2 ** value.e;
 if (!Number.isFinite(result) || result === 0) throw rangeError();
 return zero(result);
}

export function operatePhasors(a,b,operation) {
 const left = components(a), right = components(b);
 if (!['add','subtract','multiply','divide'].includes(operation)) throw new TypeError('Choose add, subtract, multiply, or divide.');
 if (operation === 'add' || operation === 'subtract') {
  const direction = operation === 'add' ? 1 : -1;
  const re = left.re + direction * right.re, im = left.im + direction * right.im;
  if (!Number.isFinite(re) || !Number.isFinite(im)) throw rangeError();
  return describePhasor({re,im});
 }
 const ac = product(left.re,right.re), bd = product(left.im,right.im),
       ad = product(left.re,right.im), bc = product(left.im,right.re);
 if (operation === 'multiply') return describePhasor({re:valueOf(sum(ac,negate(bd))),im:valueOf(sum(ad,bc))});
 if (right.re === 0 && right.im === 0) throw new RangeError('Cannot divide by a zero-magnitude phasor.');
 const denominator = sum(product(right.re,right.re),product(right.im,right.im));
 return describePhasor({re:valueOf(quotient(sum(ac,bd),denominator)),im:valueOf(quotient(sum(bc,negate(ad)),denominator))});
}
