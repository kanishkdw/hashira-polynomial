# Hashira Polynomial Solver (Node.js)

This project solves the **Hashira Placements assignment**: reconstruct a polynomial of degree `m = k-1` from `k` roots provided in JSON format.  
The solver reads the JSON input, parses numbers in arbitrary bases, and applies **Newton interpolation** with exact rational arithmetic using JavaScript `BigInt`.  
The result is printed both as simplified rational coefficients and as an integer-scaled polynomial with a single denominator.

---

##  Features
- Handles **large integers** using `BigInt`
- Parses values from any base (2–36, a–z digits supported)
- Uses **Newton interpolation** to compute coefficients
- Outputs:
  - Coefficients `a0...am` as simplified fractions
  - Equivalent integer polynomial `Q(x)` with common denominator `D`

---

##  Files
- `solve.js` → Main solver
- `verify.js` → Optional checker to evaluate polynomial at all provided points
- `testcase1.json` → Sample test case
- `testcase2.json` → Second assignment test case
- `OUTPUT.md` → Example solver output (for testcase2)
- `README.md` → Project documentation

---

##  How to Run

Clone this repo:
```bash
git clone https://github.com/kanishkdw/hashira-polynomial.git
cd hashira-polynomial
---
Run the solver on a JSON input:
node solve.js testcase1.json
node verify.js testcase1.json
node solve.js testcase2.json
node verify.js testcase2.json

Tech Stack

Language: JavaScript (Node.js v20+)

Editor: VS Code

Version Control: Git & GitHub


Author

Kanishk Dwivedi
B.Tech Computer and Communication Engineering, Manipal University Jaipur


---

 This README covers **what it is, how it works, how to run, example output, and tech stack** — exactly what recruiters/teachers expect on GitHub.  

Do you want me to also add a **“Steps to Reproduce / Installation”** section (with Node.js + Git setup) so it’s beginner-friendly for anyone cloning your repo?

