const fs = require("fs");

// ---------- Rational with BigInt ----------
class Rational {
  constructor(num, den = 1n) {
    if (den === 0n) throw new Error("Denominator 0");
    if (den < 0n) { num = -num; den = -den; }
    const g = Rational.gcd(num < 0n ? -num : num, den);
    this.n = num / g;
    this.d = den / g;
  }
  static fromBigInt(x) { return new Rational(x, 1n); }
  static gcd(a, b) { while (b) { const t = a % b; a = b; b = t; } return a; }
  static lcm(a, b) { return (a / Rational.gcd(a, b)) * b; }

  add(o) { return new Rational(this.n*o.d + o.n*this.d, this.d*o.d); }
  sub(o) { return new Rational(this.n*o.d - o.n*this.d, this.d*o.d); }
  mul(o) { return new Rational(this.n*o.n, this.d*o.d); }
  div(o) { return new Rational(this.n*o.d, this.d*o.n); }
  neg()  { return new Rational(-this.n, this.d); }

  toString() {
    if (this.d === 1n) return this.n.toString();
    return `${this.n.toString()}/${this.d.toString()}`;
  }
}

// ---------- Parse base-N string to BigInt ----------
function parseBase(str, base) {
  const digits = new Map();
  for (let i = 0; i <= 9; i++) digits.set(String(i), BigInt(i));
  for (let i = 0; i < 26; i++) {
    digits.set(String.fromCharCode(97 + i), BigInt(10 + i)); // a..z
    digits.set(String.fromCharCode(65 + i), BigInt(10 + i)); // A..Z
  }
  let v = 0n;
  for (const ch of str) {
    if (ch === '_' || ch === ' ') continue;
    const d = digits.get(ch);
    if (d === undefined || d >= BigInt(base)) {
      throw new Error(`Bad digit '${ch}' for base ${base}`);
    }
    v = v * BigInt(base) + d;
  }
  return v;
}

// ---------- Polynomial helpers (Rational coefficients) ----------
// Poly is [a0, a1, ..., ak] representing a0 + a1 x + ...
function polyAdd(a, b) {
  const n = Math.max(a.length, b.length);
  const res = Array.from({ length: n }, () => new Rational(0n));
  for (let i = 0; i < n; i++) {
    if (i < a.length) res[i] = res[i].add(a[i]);
    if (i < b.length) res[i] = res[i].add(b[i]);
  }
  return res;
}
function polyScale(a, s) {
  return a.map(c => c.mul(s));
}
function polyMulXminus(a, xi) { // multiply by (x - xi)
  const res = Array.from({ length: a.length + 1 }, () => new Rational(0n));
  const Xi = new Rational(xi, 1n);
  for (let i = 0; i < a.length; i++) {
    res[i+1] = res[i+1].add(a[i]);        // * x
    res[i]   = res[i].sub(a[i].mul(Xi));  // - xi
  }
  return res;
}

// Newton interpolation -> standard polynomial
function newtonInterpolate(points) {
  // points: [{x: BigInt, y: BigInt}]
  const n = points.length;
  const X = points.map(p => new Rational(p.x, 1n));
  const F = points.map(p => new Rational(p.y, 1n));

  // Divided differences coefficients
  const coef = [F[0]];
  let col = F.slice();
  for (let j = 1; j < n; j++) {
    const next = [];
    for (let i = 0; i < n - j; i++) {
      next.push( col[i+1].sub(col[i]).div( X[i+j].sub(X[i]) ) );
    }
    coef.push(next[0]);
    col = next;
  }

  // Convert Newton form to standard basis:
  // P(x) = sum_j coef[j] * Π_{i<j} (x - X[i])
  let total = [new Rational(0n)];
  let prod  = [new Rational(1n)];
  for (let j = 0; j < n; j++) {
    total = polyAdd(total, polyScale(prod, coef[j]));
    if (j < n-1) prod = polyMulXminus(prod, points[j].x);
  }
  return total; // [a0, a1, ..., a_{n-1}]
}

// Compact integer form: multiply by LCM of denominators
function toIntegerForm(coeffs) {
  let L = 1n;
  for (const c of coeffs) L = Rational.lcm(L, c.d);
  const ints = coeffs.map(c => (c.n * (L / c.d)));
  return { ints, denom: L };
}

function main() {
  // allow: node solve.js testcase.json  OR  node solve.js < testcase.json
  const input = process.argv[2]
    ? fs.readFileSync(process.argv[2], "utf8")
    : fs.readFileSync(0, "utf8");

  const obj = JSON.parse(input);

  const n = obj.keys.n;
  const k = obj.keys.k;       // degree m = k-1
  const entries = Object.entries(obj)
    .filter(([key]) => key !== "keys")
    .map(([key, rec]) => ({
      x: BigInt(key),                             // x is the numeric key (base-10)
      y: parseBase(rec.value, Number(rec.base)),  // y converted to BigInt from given base
      idx: Number(key)
    }))
    .sort((a, b) => a.idx - b.idx);

  if (entries.length !== n) {
    console.error(`Warning: keys.n (${n}) != actual entries (${entries.length})`);
  }

  // Use the first k points (can be any k)
  const chosen = entries.slice(0, k);

  const coeffs = newtonInterpolate(chosen);     // Rational coefficients
  const { ints, denom } = toIntegerForm(coeffs);

  console.log(`Degree m = ${k - 1}`);
  console.log("\nCoefficients (a0 + a1 x + ... + am x^m):\n");
  coeffs.forEach((c, i) => {
    console.log(`a${i} = ${c.toString()}`);
  });

  console.log(`\nEquivalent integer-coefficient polynomial Q(x) = D * P(x), with D = ${denom.toString()}:`);
  // Print in ascending powers: c0 + c1 x + ...
  console.log("Q(x) = " + ints.map((c, i) => `${c.toString()}*x^${i}`).join(" + "));
}

main();