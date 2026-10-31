# PHYSIX — Interactive Physics Visualizer & Curriculum Hub

> **"Physics, Visualized."**  
> Go beyond rote memorization. Explore the physical laws of the universe through interactive simulations, visual explanations, and syllabus-verified practice.

---

## 🌌 Platform Overview

**PHYSIX** is a digital educational platform engineered for **Class 11, Class 12, JEE Main/Advanced, and NEET Physics aspirants**. Built with high-performance vanilla web standards and mathematical typesetting, PHYSIX empowers students to manipulate physical variables in real time—observing parabolic trajectories, ray optics lens transformations, wave superposition, and electric circuit flows.

---

## 🚀 Key Modules & Capabilities

### 1. 🪐 Celestial Orbit Hero Visualizer
- **Keplerian Trajectory**: Live HTML5 Canvas rendering an elliptical orbit with eccentricity $e = 0.38$.
- **Telemetry HUD**: Real-time orbital velocity calculation ($v \approx 7.82\text{ km/s}$), gravitational center glow, and cosmic particle system.
- **Interactive Cursor Deflection**: Canvas reacts dynamically to mouse movement while respecting `prefers-reduced-motion` for accessibility.

### 2. 📚 Complete NCERT Curriculum Pathways (Class 11 & Class 12)
- **Class 11 Foundation & Mechanics**: 28 topics spanning Mechanics, Thermodynamics, Oscillations & Waves, Gravitation, and Properties of Matter.
- **Class 12 Electromagnetism & Modern Physics**: 35 topics covering Electrostatics, Current Electricity, Magnetism, Electromagnetic Induction & AC, Ray & Wave Optics, and Modern Quantum Physics.
- **Interactive Syllabus Inspector**: Deep-dive chapter modals detailing subtopics, weightage metrics for JEE & NEET, and conceptual baselines.

### 3. 🔬 Interactive Simulation Lab
Five fully functional simulation engines with live canvas rendering, variable sliders, and telemetry readout:
1. **Projectile Motion**:
   - Adjustable launch angle ($15^\circ - 85^\circ$), initial speed ($10 - 60\text{ m/s}$), and mass.
   - Celestial gravity presets: Earth ($9.8\text{ m/s}^2$), Moon ($1.62\text{ m/s}^2$), Mars ($3.71\text{ m/s}^2$), Jupiter ($24.79\text{ m/s}^2$).
   - Dynamic telemetry: Flight time ($t$), horizontal range ($x$), apex height ($y$), instantaneous velocity, and a real-time **Kinetic vs. Potential Energy Balance Bar**.
2. **Ray Optics & Lens Bench**:
   - Converging (Biconvex) and Diverging (Biconcave) thin lens modes.
   - Adjustable focal length ($|f|$), object distance ($|u|$), and object height ($h_o$).
   - Real vs. virtual image identification, live magnification $m = v/u$, and geometric ray tracing (parallel ray, optical center ray, focal ray).
3. **Wave Superposition & SHM**:
   - Standing waves and travelling transverse wave propagation.
   - Controls for frequency ($f$), amplitude ($A$), and wave speed ($v = f\lambda$).
   - Live identification of stationary nodes and oscillating antinodes.
4. **DC Electric Circuits**:
   - Interactive closed loop with adjustable battery EMF ($2 - 24\text{ V}$) and load resistance ($1 - 20\ \Omega$).
   - Ohm's law ($I = V/R$) and Joule heating power dissipation ($P = V \cdot I$) telemetry.
   - Visualized electron drift velocity proportional to electric current.
5. **Photoelectric Effect & Einstein's Quantum Engine**:
   - Interactive verification of Einstein's photoelectric law: $E = h\nu = \phi + K_{\max} = \phi + eV_0$.
   - Target cathode metals with authentic work functions: Cesium ($2.14\text{ eV}$), Potassium ($2.30\text{ eV}$), Sodium ($2.75\text{ eV}$), Zinc ($4.31\text{ eV}$), Platinum ($5.65\text{ eV}$).
   - Monochromatic wavelength slider ($160 - 780\text{ nm}$) with real-time RGB spectrum color rendering, beam intensity, and applied voltage ($-5.0\text{ V}$ to $+5.0\text{ V}$).
   - Dual visualization modes: **Evacuated Quartz Apparatus** (live photon wave packets, electron trajectories with retarding/accelerating electric field deflection) and **Scientific Graphs** ($K_{\max}\text{ vs }\nu$ and $I\text{-}V$ characteristic curves showing stopping potential $-V_0$ and saturation current).

### 4. 🧮 Formula of the Day & Live Parameter Calculator
- **Mathematical Typesetting**: Rendered with **KaTeX** for publication-quality LaTeX math notation.
- **Variable SI Breakdown**: Precise definition, physical symbol, and SI unit for each term.
- **Live Interactive Calculator**: Change initial velocity $u$, acceleration $a$, or time $t$ to compute instantaneous velocity in real time.
- **Formula Repository Modal**: Instant access to core kinematic, gravitational, energy, and optical equations.

### 5. 🎯 Diagnostic Practice Zone
- **JEE Advanced & Main Problem Set**: Multi-concept analytical problems with calculus-based derivations.
- **NEET Medical Physics Problem Set**: High-yield conceptual and formula speed MCQs aligned with NCERT.
- **Concept Check Quizzes**: Diagnostic questions designed to eliminate common physical misconceptions.
- **Instant Diagnostic Feedback**: Option-by-option color-coded validation, step-by-step mathematical solutions, and end-of-quiz score telemetry.

### 6. 🔍 Live Omnisearch & Deep-Linking
- Substring and keyword indexing across chapters, concepts, formulas, and simulations.
- Category filter chips (`All`, `Simulations`, `Formulas`, `Chapters`, `Practice`).
- Keyboard navigation (Up/Down arrow keys + Enter + Esc) and instant deep-linking.

### 7. 🌐 Bilingual Internationalization (i18n)
- One-click instant language toggle between **English** and **Hindi (हिंदी)**.
- Localizes navigation, hero headlines, curriculum descriptions, and practice interfaces while preserving standard mathematical symbols and SI conventions.

---

## 🎨 Design System & Visual Aesthetic

- **Color Tokens**:
  - Obsidian Dark Base: `#090B0A`
  - Emerald Primary Accent: `#35D39A` (Neon / Scientific Glow)
  - Champagne Gold Secondary Accent: `#D6B878` (Formulas & Diagnostic Badges)
  - Card Glass Surfaces: `rgba(22, 33, 27, 0.75)` with subtle `backdrop-filter: blur(16px)`
- **Typography**:
  - Headings: `Outfit` (Modern geometric sans)
  - Body & UI: `Inter` (Optimized screen legibility)
  - Telemetry & Math: `JetBrains Mono` & KaTeX
- **Responsive Layout**: Fluid breakpoints from mobile screens ($<480\text{px}$) to wide 4K displays with dedicated slide-out drawer navigation for touch devices.

---

## 📁 Project Structure

```
PhysiX/
├── index.html                   # Main application entry point
├── README.md                    # Platform documentation & manual
├── assets/
│   └── icons.svg                # Master SVG vector sprite definitions
├── css/
│   ├── main.css                 # Design tokens, reset, typography & container grid
│   ├── hero.css                 # Cinematic space hero & celestial orbit canvas styles
│   ├── components.css           # Cards, buttons, search bar, modals, quizzes & simulation layouts
│   └── responsive.css           # Breakpoints, mobile navigation drawer & touch optimizations
└── js/
    ├── app.js                   # Application bootstrap & event orchestration
    ├── data.js                  # Syllabi, simulation parameters, formulas & search index
    ├── i18n.js                  # Centralized English/Hindi translation engine
    ├── celestial-hero.js        # HTML5 Canvas Keplerian planetary orbit visualizer
    ├── formula-explorer.js      # KaTeX formula renderer & live parameter calculator
    ├── quiz.js                  # Interactive practice MCQ engine with solutions
    ├── search.js                # Live index search with keyboard navigation
    └── simulations/
        ├── simulation-modal.js  # Dynamic mounting & lifecycle manager for simulations
        ├── projectile.js        # 2D projectile kinematics & energy conservation engine
        ├── optics.js            # Thin lens geometrical optics & ray tracing engine
        ├── waves.js             # Transverse & standing wave superposition engine
        ├── circuits.js          # DC circuit Ohm's law & electron drift engine
        └── photoelectric.js     # Photoelectric effect quantum engine & I-V graphs
```

---

## 💻 How to Run

PHYSIX is built entirely on modern web standards with zero build-step requirements:

### Method 1: Direct File Launch
Simply double-click [`index.html`](file:///c:/Users/dnyan/Desktop/PhysiX/index.html) or open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari.

### Method 2: Local HTTP Server (Recommended)
You can run a lightweight local static server using Python or Node.js:

```bash
# Using Python 3:
python -m http.server 8080

# Or using Node.js:
npx serve .
```

Then visit `http://localhost:8080` in your browser.

