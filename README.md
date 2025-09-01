# Hashira Polynomial Solver (Node.js)

This project solves the **Hashira Placements assignment**: reconstruct a polynomial of degree `m = k-1` from `k` points provided in JSON format.  
It parses arbitrary-base numbers, applies **Newton interpolation** with exact rational arithmetic (`BigInt`), and outputs coefficients both as fractions and as an integer-scaled polynomial.

---

##  Features
- Handles **large integers** with `BigInt`
- Parses numbers from **any base (2–36)** (supports a–z digits)
- Computes coefficients using **Newton interpolation**
- Outputs:
  - Coefficients `a0...am` as simplified fractions
  - Equivalent integer polynomial `Q(x)` with a common denominator `D`

---

##  Files
- `solve.js` → Main solver
- `verify.js` → Checker to evaluate polynomial on all provided points
- `testcase1.json` → Sample test case
- `testcase2.json` → Second assignment test case
- `OUTPUT.md` → Example solver output
- `README.md` → Documentation

---
## How to Run

Clone this repo:
```bash
git clone https://github.com/kanishkdw/hashira-polynom

```
---

## Run the solver on JSON inputs:

node solve.js testcase1.json
node verify.js testcase1.json

node solve.js testcase2.json
node verify.js testcase2.json

## Tech Stack
-Language: JavaScript (Node.js v20+)
-Editor: VS Code
-Version Control: Git & GitHub

## Author
-Kanishk Dwivedi
-B.Tech Computer and Communication Engineering
-Manipal University Jaipur

