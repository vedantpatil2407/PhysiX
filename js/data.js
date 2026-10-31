/**
 * PHYSIX Physics Curriculum, Simulations, Formulas & Practice Data
 * Verified content for Class 11, Class 12, JEE, and NEET preparation.
 */

const PHYSIX_DATA = {
  // -------------------------------------------------------------------------
  // 1. Course Syllabi (Class 11 & Class 12)
  // -------------------------------------------------------------------------
  courses: {
    class11: {
      id: "class-11",
      titleKey: "class11_title",
      badgeKey: "class11_badge",
      descKey: "class11_desc",
      topicsCount: 28,
      chapters: [
        {
          id: "mechanics",
          name: "Mechanics",
          topicsCount: 8,
          subtopics: [
            "Kinematics in 1D & 2D",
            "Newton's Laws & Friction",
            "Work, Energy & Power",
            "Center of Mass & Collisions",
            "Rotational Dynamics & Torque",
            "Moment of Inertia Theorems",
            "Circular Motion & Banking",
            "Conservation of Angular Momentum"
          ],
          weightage: "JEE: 24% | NEET: 20%"
        },
        {
          id: "thermodynamics",
          name: "Thermodynamics",
          topicsCount: 5,
          subtopics: [
            "Zeroth & First Law of Thermodynamics",
            "Isothermal & Adiabatic Processes",
            "Heat Engines & Carnot Cycle",
            "Second Law & Entropy",
            "Kinetic Theory of Gases (KTG)"
          ],
          weightage: "JEE: 10% | NEET: 12%"
        },
        {
          id: "oscillations-waves",
          name: "Oscillations and Waves",
          topicsCount: 6,
          subtopics: [
            "Simple Harmonic Motion (SHM)",
            "Damped & Forced Oscillations",
            "Wave Characteristics & Speed",
            "Superposition Principle & Beats",
            "Standing Waves in Strings & Pipes",
            "Doppler Effect in Sound"
          ],
          weightage: "JEE: 8% | NEET: 7%"
        },
        {
          id: "gravitation",
          name: "Gravitation",
          topicsCount: 4,
          subtopics: [
            "Newton's Universal Law of Gravitation",
            "Acceleration Due to Gravity (g) Variations",
            "Gravitational Potential & Escape Velocity",
            "Kepler's Laws of Planetary Motion"
          ],
          weightage: "JEE: 6% | NEET: 6%"
        },
        {
          id: "properties-matter",
          name: "Properties of Matter",
          topicsCount: 5,
          subtopics: [
            "Elastic Moduli (Young's, Bulk, Shear)",
            "Fluid Statics & Pascal's Law",
            "Viscosity & Stokes' Law",
            "Bernoulli's Principle & Venturimeter",
            "Surface Tension & Capillarity"
          ],
          weightage: "JEE: 7% | NEET: 8%"
        }
      ]
    },
    class12: {
      id: "class-12",
      titleKey: "class12_title",
      badgeKey: "class12_badge",
      descKey: "class12_desc",
      topicsCount: 35,
      chapters: [
        {
          id: "electrostatics",
          name: "Electrostatics",
          topicsCount: 6,
          subtopics: [
            "Coulomb's Law & Electric Field",
            "Electric Flux & Gauss's Theorem",
            "Electrostatic Potential & Dipoles",
            "Capacitance & Dielectrics",
            "Energy Stored in Capacitors",
            "Van de Graaff Generator"
          ],
          weightage: "JEE: 9% | NEET: 9%"
        },
        {
          id: "current-electricity",
          name: "Current Electricity",
          topicsCount: 5,
          subtopics: [
            "Drift Velocity & Ohm's Law",
            "Resistors in Series & Parallel",
            "Kirchhoff's Laws & Circuit Analysis",
            "Wheatstone Bridge & Metre Bridge",
            "Potentiometer & Internal Resistance"
          ],
          weightage: "JEE: 8% | NEET: 8%"
        },
        {
          id: "magnetism",
          name: "Magnetism",
          topicsCount: 6,
          subtopics: [
            "Biot-Savart Law & Ampere's Circuital Law",
            "Lorentz Force & Cyclotron",
            "Magnetic Field of Solenoids & Toroids",
            "Force Between Parallel Currents",
            "Earth's Magnetism & Magnetic Dipole",
            "Para, Dia, and Ferromagnetism"
          ],
          weightage: "JEE: 8% | NEET: 8%"
        },
        {
          id: "emi-ac",
          name: "Electromagnetic Induction & AC",
          topicsCount: 5,
          subtopics: [
            "Faraday's Laws & Lenz's Law",
            "Motional EMF & Eddy Currents",
            "Self & Mutual Inductance",
            "Alternating Current & LCR Circuits",
            "Transformers & Resonance"
          ],
          weightage: "JEE: 9% | NEET: 8%"
        },
        {
          id: "optics",
          name: "Optics",
          topicsCount: 7,
          subtopics: [
            "Reflection & Refraction at Spherical Surfaces",
            "Lens Maker's Formula & Thin Lenses",
            "Prism Dispersion & Optical Instruments",
            "Wave Optics: Huygens' Principle",
            "Young's Double Slit Experiment (YDSE)",
            "Diffraction at a Single Slit",
            "Polarization & Brewster's Law"
          ],
          weightage: "JEE: 10% | NEET: 10%"
        },
        {
          id: "modern-physics",
          name: "Modern Physics",
          topicsCount: 6,
          subtopics: [
            "Photoelectric Effect & Einstein's Equation",
            "De Broglie Wavelength & Dual Nature",
            "Bohr's Model of Hydrogen Atom",
            "Atomic Spectra & Energy Levels",
            "Radioactivity & Nuclear Binding Energy",
            "Semiconductors, Diodes & Logic Gates"
          ],
          weightage: "JEE: 11% | NEET: 12%"
        }
      ]
    }
  },

  // -------------------------------------------------------------------------
  // 2. Interactive Simulations
  // -------------------------------------------------------------------------
  simulations: [
    {
      id: "projectile-motion",
      titleKey: "sim_projectile_title",
      descKey: "sim_projectile_desc",
      category: "Mechanics",
      badge: "Class 11",
      previewSvg: `<svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="180" fill="#101A15"/>
        <line x1="20" y1="150" x2="280" y2="150" stroke="#29372E" stroke-width="2"/>
        <line x1="20" y1="20" x2="20" y2="150" stroke="#29372E" stroke-width="2"/>
        <!-- Trajectory curve -->
        <path d="M 30 150 Q 140 10 250 150" stroke="#35D39A" stroke-width="2.5" stroke-dasharray="4 4" fill="none"/>
        <circle cx="30" cy="150" r="6" fill="#35D39A"/>
        <circle cx="140" cy="45" r="7" fill="#D6B878" filter="drop-shadow(0 0 6px #D6B878)"/>
        <!-- Vectors -->
        <line x1="140" y1="45" x2="190" y2="45" stroke="#35D39A" stroke-width="2"/>
        <polygon points="192,45 186,42 186,48" fill="#35D39A"/>
        <text x="148" y="38" fill="#F3F2EC" font-size="11" font-family="sans-serif">vx = v₀ cos θ</text>
        <text x="130" y="80" fill="#A2B0A5" font-size="10" font-family="sans-serif">H_max = 52.3 m</text>
      </svg>`
    },
    {
      id: "ray-optics",
      titleKey: "sim_optics_title",
      descKey: "sim_optics_desc",
      category: "Optics",
      badge: "Class 12",
      previewSvg: `<svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="180" fill="#101A15"/>
        <!-- Principal Axis -->
        <line x1="10" y1="90" x2="290" y2="90" stroke="#29372E" stroke-width="1.5" stroke-dasharray="3 3"/>
        <!-- Biconvex Lens -->
        <path d="M 150 20 Q 165 90 150 160 Q 135 90 150 20" fill="rgba(53, 211, 154, 0.15)" stroke="#35D39A" stroke-width="2"/>
        <!-- Object Arrow -->
        <line x1="60" y1="90" x2="60" y2="45" stroke="#D6B878" stroke-width="3"/>
        <polygon points="60,40 56,48 64,48" fill="#D6B878"/>
        <!-- Parallel Ray -->
        <line x1="60" y1="45" x2="150" y2="45" stroke="#35D39A" stroke-width="1.5"/>
        <line x1="150" y1="45" x2="240" y2="135" stroke="#35D39A" stroke-width="1.5"/>
        <!-- Central Ray -->
        <line x1="60" y1="45" x2="240" y2="135" stroke="#D6B878" stroke-width="1.5" stroke-dasharray="3 2"/>
        <!-- Real Image Arrow -->
        <line x1="240" y1="90" x2="240" y2="135" stroke="#35D39A" stroke-width="2.5"/>
        <polygon points="240,140 236,132 244,132" fill="#35D39A"/>
      </svg>`
    },
    {
      id: "wave-motion",
      titleKey: "sim_waves_title",
      descKey: "sim_waves_desc",
      category: "Waves",
      badge: "Class 11",
      previewSvg: `<svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="180" fill="#101A15"/>
        <line x1="20" y1="90" x2="280" y2="90" stroke="#29372E" stroke-width="1.5"/>
        <!-- Sine Wave 1 -->
        <path d="M 20 90 Q 52.5 30 85 90 T 150 90 T 215 90 T 280 90" stroke="#35D39A" stroke-width="2.5" fill="none"/>
        <!-- Sine Wave 2 (Phase shifted) -->
        <path d="M 20 90 Q 52.5 130 85 90 T 150 90 T 215 90 T 280 90" stroke="#D6B878" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
        <circle cx="85" cy="90" r="4" fill="#35D39A"/>
        <circle cx="150" cy="90" r="4" fill="#35D39A"/>
        <text x="75" y="112" fill="#A2B0A5" font-size="10" font-family="sans-serif">Node</text>
        <text x="105" y="42" fill="#D6B878" font-size="10" font-family="sans-serif">Antinode (λ/2)</text>
      </svg>`
    },
    {
      id: "electric-circuits",
      titleKey: "sim_circuits_title",
      descKey: "sim_circuits_desc",
      category: "Current Electricity",
      badge: "Class 12",
      previewSvg: `<svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="180" fill="#101A15"/>
        <!-- Circuit Loop -->
        <rect x="50" y="40" width="200" height="100" rx="8" fill="none" stroke="#29372E" stroke-width="2"/>
        <!-- Battery Symbol -->
        <line x1="50" y1="80" x2="50" y2="100" stroke="#101A15" stroke-width="6"/>
        <line x1="38" y1="84" x2="62" y2="84" stroke="#D6B878" stroke-width="3"/>
        <line x1="44" y1="94" x2="56" y2="94" stroke="#A2B0A5" stroke-width="2"/>
        <text x="24" y="92" fill="#D6B878" font-size="11" font-weight="bold">V</text>
        <!-- Resistor Symbol -->
        <line x1="120" y1="40" x2="180" y2="40" stroke="#101A15" stroke-width="6"/>
        <path d="M 120 40 L 126 32 L 138 48 L 150 32 L 162 48 L 174 32 L 180 40" stroke="#35D39A" stroke-width="2.5" fill="none"/>
        <text x="144" y="24" fill="#35D39A" font-size="11" font-weight="bold">R</text>
        <!-- Animated electron flow indication -->
        <circle cx="100" cy="40" r="3" fill="#35D39A"/>
        <circle cx="210" cy="40" r="3" fill="#35D39A"/>
        <circle cx="250" cy="90" r="3" fill="#35D39A"/>
        <circle cx="150" cy="140" r="3" fill="#35D39A"/>
        <text x="135" y="160" fill="#A2B0A5" font-size="10" font-family="sans-serif">I = V / R</text>
      </svg>`
    },
    {
      id: "photoelectric-effect",
      titleKey: "sim_photoelectric_title",
      descKey: "sim_photoelectric_desc",
      category: "Modern Physics",
      badge: "Class 12",
      previewSvg: `<svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="180" fill="#101A15"/>
        <!-- Tube Envelope -->
        <rect x="40" y="35" width="220" height="110" rx="20" stroke="#29372E" stroke-width="2" fill="rgba(22,33,27,0.6)"/>
        <!-- Light Source Lamp -->
        <circle cx="100" cy="20" r="12" fill="#BB9AF7"/>
        <!-- Photon Beam Cone -->
        <polygon points="94,28 106,28 85,80 75,80" fill="rgba(187,154,247,0.25)"/>
        <line x1="100" y1="20" x2="80" y2="80" stroke="#BB9AF7" stroke-width="1.5" stroke-dasharray="3 3"/>
        <!-- Cathode Plate -->
        <rect x="70" y="55" width="8" height="70" rx="2" fill="#D6B878"/>
        <text x="56" y="94" fill="#D6B878" font-size="9" font-weight="bold">Cs</text>
        <!-- Anode Plate -->
        <rect x="220" y="55" width="8" height="70" rx="2" fill="#A2B0A5"/>
        <text x="232" y="94" fill="#A2B0A5" font-size="9" font-weight="bold">+</text>
        <!-- Photoelectrons escaping -->
        <circle cx="95" cy="80" r="3.5" fill="#38BDF8"/>
        <circle cx="125" cy="74" r="3.5" fill="#38BDF8"/>
        <circle cx="155" cy="85" r="3.5" fill="#38BDF8"/>
        <circle cx="185" cy="78" r="3.5" fill="#38BDF8"/>
        <line x1="125" y1="74" x2="145" y2="74" stroke="#38BDF8" stroke-width="1.5"/>
        <polygon points="147,74 142,71 142,77" fill="#38BDF8"/>
        <text x="95" y="132" fill="#35D39A" font-size="10" font-family="sans-serif">K_max = hν - φ</text>
      </svg>`
    }
  ],

  // -------------------------------------------------------------------------
  // 3. Featured Formulas
  // -------------------------------------------------------------------------
  featuredFormulas: [
    {
      id: "kinematics-first",
      name: "First Equation of Motion",
      category: "Kinematics",
      latex: "v = u + at",
      example: "A particle starts from rest (u = 0 m/s) with acceleration a = 3 m/s² for t = 5 s. Final velocity v = 15 m/s.",
      variables: [
        { symbol: "v", meaning: "Final Velocity", unit: "m/s", defaultVal: 15 },
        { symbol: "u", meaning: "Initial Velocity", unit: "m/s", defaultVal: 0 },
        { symbol: "a", meaning: "Acceleration", unit: "m/s²", defaultVal: 3 },
        { symbol: "t", meaning: "Time Elapsed", unit: "s", defaultVal: 5 }
      ],
      calcType: "solve_v",
      calculate: (inputs) => {
        const u = parseFloat(inputs.u) || 0;
        const a = parseFloat(inputs.a) || 0;
        const t = parseFloat(inputs.t) || 0;
        return (u + a * t).toFixed(2);
      }
    },
    {
      id: "gravitation-law",
      name: "Universal Law of Gravitation",
      category: "Gravitation",
      latex: "F = G \\frac{m_1 m_2}{r^2}",
      example: "Gravitational attraction between two 10 kg spheres placed 2 m apart.",
      variables: [
        { symbol: "F", meaning: "Gravitational Force", unit: "N", defaultVal: "1.67e-9" },
        { symbol: "m₁", meaning: "Mass of Object 1", unit: "kg", defaultVal: 10 },
        { symbol: "m₂", meaning: "Mass of Object 2", unit: "kg", defaultVal: 10 },
        { symbol: "r", meaning: "Separation Distance", unit: "m", defaultVal: 2 }
      ],
      calculate: (inputs) => {
        const G = 6.674e-11;
        const m1 = parseFloat(inputs.m1) || 0;
        const m2 = parseFloat(inputs.m2) || 0;
        const r = parseFloat(inputs.r) || 1;
        return (G * (m1 * m2) / (r * r)).toExponential(3);
      }
    },
    {
      id: "kinetic-energy",
      name: "Translational Kinetic Energy",
      category: "Work, Energy & Power",
      latex: "E_k = \\frac{1}{2} m v^2",
      example: "Kinetic energy of a 2 kg object traveling at 4 m/s.",
      variables: [
        { symbol: "E_k", meaning: "Kinetic Energy", unit: "J", defaultVal: 16 },
        { symbol: "m", meaning: "Mass", unit: "kg", defaultVal: 2 },
        { symbol: "v", meaning: "Velocity", unit: "m/s", defaultVal: 4 }
      ],
      calculate: (inputs) => {
        const m = parseFloat(inputs.m) || 0;
        const v = parseFloat(inputs.v) || 0;
        return (0.5 * m * v * v).toFixed(2);
      }
    },
    {
      id: "snells-law",
      name: "Snell's Law of Refraction",
      category: "Ray Optics",
      latex: "n_1 \\sin \\theta_1 = n_2 \\sin \\theta_2",
      example: "Light entering water (n₂ = 1.33) from air (n₁ = 1.0) at 30° incident angle.",
      variables: [
        { symbol: "n₁", meaning: "Refractive Index 1", unit: "dimensionless", defaultVal: 1.0 },
        { symbol: "θ₁", meaning: "Angle of Incidence", unit: "degrees", defaultVal: 30 },
        { symbol: "n₂", meaning: "Refractive Index 2", unit: "dimensionless", defaultVal: 1.33 },
        { symbol: "θ₂", meaning: "Angle of Refraction", unit: "degrees", defaultVal: 22.08 }
      ],
      calculate: (inputs) => {
        const n1 = parseFloat(inputs.n1) || 1;
        const theta1Rad = ((parseFloat(inputs.theta1) || 0) * Math.PI) / 180;
        const n2 = parseFloat(inputs.n2) || 1.33;
        const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2;
        if (Math.abs(sinTheta2) > 1) return "Total Internal Reflection";
        return ((Math.asin(sinTheta2) * 180) / Math.PI).toFixed(2);
      }
    }
  ],

  // -------------------------------------------------------------------------
  // 4. Practice Questions (JEE, NEET, Concept Check)
  // -------------------------------------------------------------------------
  practiceSets: {
    jee: {
      title: "JEE Advanced & Main Physics",
      description: "Rigorous analytical problems focusing on multi-concept synthesis and numerical accuracy.",
      questions: [
        {
          id: "jee-q1",
          topic: "Mechanics - Projectile Motion",
          examTag: "JEE Main",
          question: "A projectile is fired at an angle $\\theta = 45^\\circ$ with the horizontal with initial velocity $u = 20\\sqrt{2}\\text{ m/s}$. Taking $g = 10\\text{ m/s}^2$, what is the radius of curvature $\\rho$ of its trajectory at the highest point?",
          options: [
            "$20\\text{ m}$",
            "$40\\text{ m}$",
            "$80\\text{ m}$",
            "$10\\text{ m}$"
          ],
          correctIndex: 1,
          explanation: "At the highest point, vertical velocity $v_y = 0$, so the velocity is purely horizontal: $v = u \\cos 45^\\circ = (20\\sqrt{2})(1/\\sqrt{2}) = 20\\text{ m/s}$. The normal centripetal acceleration is $a_n = g = 10\\text{ m/s}^2$. The radius of curvature is $\\rho = \\frac{v^2}{a_n} = \\frac{20^2}{10} = 40\\text{ m}$."
        },
        {
          id: "jee-q2",
          topic: "Electrostatics - Gauss's Law",
          examTag: "JEE Advanced",
          question: "A solid insulating sphere of radius $R$ carries a uniform volume charge density $\\rho$. At what radial distance $r$ from the center is the magnitude of the electric field equal to half of its value at the surface?",
          options: [
            "$r = R/2$ and $r = \\sqrt{2}R$",
            "$r = R/2$ only",
            "$r = R/2$ and $r = 2R$",
            "$r = R/4$ and $r = \\sqrt{2}R$"
          ],
          correctIndex: 0,
          explanation: "Inside the sphere ($r \\le R$), $E_{\\text{in}}(r) = \\frac{\\rho r}{3\\varepsilon_0}$. At the surface ($r = R$), $E(R) = \\frac{\\rho R}{3\\varepsilon_0}$. Setting $E_{\\text{in}} = \\frac{1}{2}E(R)$ gives $r = R/2$. Outside the sphere ($r > R$), $E_{\\text{out}}(r) = \\frac{\\rho R^3}{3\\varepsilon_0 r^2}$. Setting $E_{\\text{out}} = \\frac{1}{2}E(R)$ gives $\\frac{R^3}{r^2} = \\frac{R}{2} \\implies r^2 = 2R^2 \\implies r = \\sqrt{2}R$."
        },
        {
          id: "jee-q3",
          topic: "Modern Physics - Photoelectric Effect",
          examTag: "JEE Main",
          question: "Light of frequency $\\nu = 2\\nu_0$ is incident on a photosensitive metal surface of threshold frequency $\\nu_0$, ejecting photoelectrons with maximum kinetic energy $K_1$. When the incident light frequency is increased to $\\nu = 5\\nu_0$, the maximum kinetic energy becomes $K_2$. What is the ratio $K_1 : K_2$?",
          options: [
            "$1 : 4$",
            "$1 : 2$",
            "$2 : 5$",
            "$1 : 5$"
          ],
          correctIndex: 0,
          explanation: "By Einstein's photoelectric equation, $K_{\\text{max}} = h\\nu - \\phi = h\\nu - h\\nu_0$. In the first case with $\\nu_1 = 2\\nu_0$: $K_1 = 2h\\nu_0 - h\\nu_0 = h\\nu_0$. In the second case with $\\nu_2 = 5\\nu_0$: $K_2 = 5h\\nu_0 - h\\nu_0 = 4h\\nu_0$. Hence, the ratio is $\\frac{K_1}{K_2} = \\frac{h\\nu_0}{4h\\nu_0} = \\frac{1}{4}$ (or $1 : 4$)."
        },
        {
          id: "jee-q4",
          topic: "Rotational Dynamics - Pure Rolling",
          examTag: "JEE Advanced",
          question: "A uniform solid cylinder of mass $M$ and radius $R$ rolls smoothly without slipping down an inclined plane of inclination angle $\\theta = 30^\\circ$. Taking $g = 10\\text{ m/s}^2$, what is the linear acceleration $a$ of its center of mass?",
          options: [
            "$\\frac{10}{3}\\text{ m/s}^2$",
            "$5\\text{ m/s}^2$",
            "$\\frac{20}{3}\\text{ m/s}^2$",
            "$2.5\\text{ m/s}^2$"
          ],
          correctIndex: 0,
          explanation: "For an object rolling without slipping down an incline, linear acceleration is $a = \\frac{g \\sin\\theta}{1 + I_{\\text{cm}}/(MR^2)}$. For a solid cylinder, $I_{\\text{cm}} = \\frac{1}{2}MR^2$, so $1 + \\frac{I_{\\text{cm}}}{MR^2} = 1 + \\frac{1}{2} = \\frac{3}{2}$. Therefore, $a = \\frac{g \\sin 30^\\circ}{3/2} = \\frac{10 \\times 0.5}{1.5} = \\frac{5}{1.5} = \\frac{10}{3}\\text{ m/s}^2 \\approx 3.33\\text{ m/s}^2$."
        },
        {
          id: "jee-q5",
          topic: "Current Electricity & AC Circuits",
          examTag: "JEE Main",
          question: "A series $LCR$ circuit consists of resistance $R = 10\\,\\Omega$, inductive reactance $X_L = 24\\,\\Omega$, and capacitive reactance $X_C = 14\\,\\Omega$ connected across an AC source of voltage $V = 100\\text{ V}$. What is the total circuit impedance $Z$ and the power factor $\\cos\\phi$?",
          options: [
            "$Z = 14.14\\,\\Omega,\\;\\cos\\phi = \\frac{1}{\\sqrt{2}}$",
            "$Z = 20\\,\\Omega,\\;\\cos\\phi = 0.5$",
            "$Z = 10\\,\\Omega,\\;\\cos\\phi = 1.0$",
            "$Z = 28\\,\\Omega,\\;\\cos\\phi = 0.7$"
          ],
          correctIndex: 0,
          explanation: "The total impedance is $Z = \\sqrt{R^2 + (X_L - X_C)^2} = \\sqrt{10^2 + (24 - 14)^2} = \\sqrt{100 + 100} = \\sqrt{200} = 10\\sqrt{2} \\approx 14.14\\,\\Omega$. The power factor is $\\cos\\phi = \\frac{R}{Z} = \\frac{10}{10\\sqrt{2}} = \\frac{1}{\\sqrt{2}} \\approx 0.707$."
        }
      ]
    },
    neet: {
      title: "NEET Medical Physics",
      description: "High-yield conceptual and formula-driven problems aligned with NCERT and medical entrance patterns.",
      questions: [
        {
          id: "neet-q1",
          topic: "Ray Optics - Refraction & TIR",
          examTag: "NEET",
          question: "A ray of light traveling inside a transparent medium of refractive index $\\mu = \\sqrt{2}$ strikes the medium-air boundary. What is the critical angle $\\theta_c$ for total internal reflection to occur?",
          options: [
            "$30^\\circ$",
            "$45^\\circ$",
            "$60^\\circ$",
            "$90^\\circ$"
          ],
          correctIndex: 1,
          explanation: "The critical angle $\\theta_c$ is determined by Snell's Law: $\\sin\\theta_c = \\frac{1}{\\mu} = \\frac{1}{\\sqrt{2}}$. Therefore, $\\theta_c = \\arcsin(1/\\sqrt{2}) = 45^\\circ$."
        },
        {
          id: "neet-q2",
          topic: "Thermodynamics - Heat Engines",
          examTag: "NEET",
          question: "A reversible Carnot heat engine operates between temperatures $T_1 = 500\\text{ K}$ (source) and $T_2 = 300\\text{ K}$ (sink). What is its maximum theoretical thermodynamic efficiency $\\eta$?",
          options: [
            "$60\\%$",
            "$40\\%$",
            "$20\\%$",
            "$50\\%$"
          ],
          correctIndex: 1,
          explanation: "Carnot efficiency is $\\eta = 1 - \\frac{T_2}{T_1} = 1 - \\frac{300\\text{ K}}{500\\text{ K}} = 1 - 0.60 = 0.40$ (or $40\\%$)."
        },
        {
          id: "neet-q3",
          topic: "Wave Optics - Interference (YDSE)",
          examTag: "NEET",
          question: "In a Young's double-slit experiment, monochromatic light of wavelength $\\lambda = 600\\text{ nm}$ is used. The slit separation is $d = 1\\text{ mm}$ and the distance to the screen is $D = 1\\text{ m}$. What is the fringe width $\\beta$ observed on the screen?",
          options: [
            "$0.6\\text{ mm}$",
            "$1.2\\text{ mm}$",
            "$0.3\\text{ mm}$",
            "$6.0\\text{ mm}$"
          ],
          correctIndex: 0,
          explanation: "Fringe width in YDSE is given by $\\beta = \\frac{\\lambda D}{d}$. Substituting the values: $\\beta = \\frac{(600 \\times 10^{-9}\\text{ m})(1\\text{ m})}{1 \\times 10^{-3}\\text{ m}} = 6 \\times 10^{-4}\\text{ m} = 0.6\\text{ mm}$."
        },
        {
          id: "neet-q4",
          topic: "Gravitation - Acceleration due to Gravity",
          examTag: "NEET",
          question: "If the radius of the Earth shrinks by $1\\%$ while its mass $M$ remains strictly constant, what will be the percentage change in the acceleration due to gravity $g$ at the Earth's surface?",
          options: [
            "Increases by $\\approx 2\\%$",
            "Decreases by $\\approx 1\\%$",
            "Increases by $\\approx 1\\%$",
            "Decreases by $\\approx 2\\%$"
          ],
          correctIndex: 0,
          explanation: "Surface gravity is $g = \\frac{GM}{R^2} = GM R^{-2}$. For small fractional changes with constant $M$: $\\frac{\\Delta g}{g} \\approx -2\\frac{\\Delta R}{R}$. Since $R$ contracts by $1\\%$ ($\\frac{\\Delta R}{R} = -1\\%$), we obtain $\\frac{\\Delta g}{g} \\approx -2(-1\\%) = +2\\%$. Thus, $g$ increases by approximately $2\\%$."
        },
        {
          id: "neet-q5",
          topic: "Mechanics - Work, Energy & Power",
          examTag: "NEET",
          question: "A body of mass $m = 2\\text{ kg}$ is thrown vertically upward with initial kinetic energy $E_k = 490\\text{ J}$. Taking $g = 9.8\\text{ m/s}^2$ and neglecting air resistance, what is the maximum height $H$ reached by the body?",
          options: [
            "$25\\text{ m}$",
            "$50\\text{ m}$",
            "$12.5\\text{ m}$",
            "$100\\text{ m}$"
          ],
          correctIndex: 0,
          explanation: "By conservation of mechanical energy, all kinetic energy converts to gravitational potential energy at the peak height: $E_k = mgH \\implies H = \\frac{E_k}{mg} = \\frac{490\\text{ J}}{(2\\text{ kg})(9.8\\text{ m/s}^2)} = \\frac{490}{19.6} = 25\\text{ m}$."
        }
      ]
    },
    concept: {
      title: "Concept Check Quizzes",
      description: "Quick diagnostic quizzes to test fundamental intuitive grasp of core physical principles.",
      questions: [
        {
          id: "concept-q1",
          topic: "Mechanics - Newton's First Law",
          examTag: "Concept Check",
          question: "An astronaut in deep space far from gravitational bodies throws a ball with velocity $\\vec{v}$. What net external force $\\vec{F}_{\\text{net}}$ is required to keep the ball moving at constant velocity?",
          options: [
            "$\\vec{F}_{\\text{net}} = 0$",
            "$\\vec{F}_{\\text{net}} = m\\vec{v}$",
            "$\\vec{F}_{\\text{net}} = m\\vec{a}$",
            "$\\vec{F}_{\\text{net}} \\propto \\vec{v}$"
          ],
          correctIndex: 0,
          explanation: "By Newton's First Law of Motion (Law of Inertia), an object in uniform motion continues at constant velocity unless acted upon by an unbalanced net external force. Therefore, $\\vec{F}_{\\text{net}} = 0$."
        },
        {
          id: "concept-q2",
          topic: "Waves - Sound & Media",
          examTag: "Concept Check",
          question: "When a sound wave travels across an interface from air into water, which of the following wave properties remains strictly unchanged?",
          options: [
            "Wavelength ($\\lambda$)",
            "Wave speed ($v$)",
            "Frequency ($\\nu$)",
            "Amplitude ($A$)"
          ],
          correctIndex: 2,
          explanation: "Frequency $\\nu$ depends solely on the vibrating source producing the wave. As the wave crosses media boundaries, its speed $v$ and wavelength $\\lambda$ change according to $v = \\nu\\lambda$, but the frequency remains unchanged."
        },
        {
          id: "concept-q3",
          topic: "Thermodynamics - Isothermal Expansion",
          examTag: "Concept Check",
          question: "During an isothermal expansion of an ideal gas at constant absolute temperature $T$, what is the change in its internal energy $\\Delta U$?",
          options: [
            "$\\Delta U = 0$",
            "$\\Delta U > 0$",
            "$\\Delta U < 0$",
            "$\\Delta U = Q + W$"
          ],
          correctIndex: 0,
          explanation: "For an ideal gas, internal energy depends only on temperature ($U = \\frac{f}{2}nRT$). In an isothermal process $\\Delta T = 0$, so the internal energy change is strictly zero: $\\Delta U = 0$."
        },
        {
          id: "concept-q4",
          topic: "Electrostatics - Faraday Shielding",
          examTag: "Concept Check",
          question: "A hollow metallic conductor with an arbitrary cavity is placed in a strong uniform external electrostatic field $\\vec{E}_0$. What is the electric field $\\vec{E}_{\\text{cavity}}$ inside the cavity?",
          options: [
            "$\\vec{E}_{\\text{cavity}} = 0$",
            "$\\vec{E}_{\\text{cavity}} = \\vec{E}_0$",
            "$\\vec{E}_{\\text{cavity}} = \\frac{\\vec{E}_0}{2}$",
            "$\\vec{E}_{\\text{cavity}} = -\\vec{E}_0$"
          ],
          correctIndex: 0,
          explanation: "By electrostatic shielding (Faraday cage effect), free electrons on the conductor surface rapidly rearrange until the electric field everywhere within the metal and inside the empty cavity is cancelled out completely, so $\\vec{E}_{\\text{cavity}} = 0$."
        },
        {
          id: "concept-q5",
          topic: "Ray Optics - Lens Maker's Formula",
          examTag: "Concept Check",
          question: "A glass convex lens of refractive index $\\mu_g = 1.5$ has focal length $f_{\\text{air}}$ in air. If it is submerged entirely in water ($\\mu_w = 1.33$), what is its new focal length $f_{\\text{water}}$?",
          options: [
            "$f_{\\text{water}} \\approx 4 f_{\\text{air}}$",
            "$f_{\\text{water}} \\approx f_{\\text{air}} / 4$",
            "$f_{\\text{water}} = f_{\\text{air}}$",
            "$f_{\\text{water}} < 0$ (becomes concave)"
          ],
          correctIndex: 0,
          explanation: "By the Lens Maker's formula, $\\frac{1}{f} = (\\frac{\\mu_L}{\\mu_M} - 1)(\\frac{1}{R_1} - \\frac{1}{R_2})$. In air: $(\\frac{1.5}{1} - 1) = 0.50$. In water: $(\\frac{1.5}{1.33} - 1) \\approx 0.128$. The ratio $\\frac{f_{\\text{water}}}{f_{\\text{air}}} = \\frac{0.50}{0.128} \\approx 3.9 \\approx 4$. Thus, the focal length approximately quadruples."
        }
      ]
    }
  },

  // -------------------------------------------------------------------------
  // 5. Unified Search Index
  // -------------------------------------------------------------------------
  searchIndex: [
    { title: "Projectile Motion", type: "Simulation", category: "Mechanics", desc: "Interactive trajectory angle, velocity, range, and height lab.", target: "sim-projectile" },
    { title: "Ray Optics & Lenses", type: "Simulation", category: "Optics", desc: "Interactive focal length and real/virtual image formation.", target: "sim-optics" },
    { title: "Wave Superposition & SHM", type: "Simulation", category: "Waves", desc: "Transverse wave interference, nodes, and frequency simulation.", target: "sim-waves" },
    { title: "Electric Circuits & Ohm's Law", type: "Simulation", category: "Electricity", desc: "Interactive DC circuit with battery EMF, resistance, and current.", target: "sim-circuits" },
    { title: "Photoelectric Effect (Einstein's Eq)", type: "Simulation", category: "Modern Physics", desc: "Work function, stopping potential V₀, threshold wavelength, and I-V characteristics.", target: "sim-photoelectric" },
    { title: "First Equation of Motion (v = u + at)", type: "Formula", category: "Kinematics", desc: "Linear acceleration, initial velocity, and time relationship.", target: "formula-v-u-at" },
    { title: "Universal Law of Gravitation (F = G m₁m₂/r²)", type: "Formula", category: "Gravitation", desc: "Newtonian inverse-square gravitational force equation.", target: "formula-grav" },
    { title: "Kinetic Energy (E = ½mv²)", type: "Formula", category: "Work & Energy", desc: "Mechanical kinetic energy formula and calculator.", target: "formula-ke" },
    { title: "Snell's Law (n₁ sin θ₁ = n₂ sin θ₂)", type: "Formula", category: "Optics", desc: "Index of refraction and angle of refraction calculation.", target: "formula-snell" },
    { title: "Mechanics (Class 11)", type: "Chapter", category: "Class 11", desc: "Kinematics, Newton's Laws, Work, Energy, Collisions & Rotational Dynamics.", target: "course-class11" },
    { title: "Thermodynamics (Class 11)", type: "Chapter", category: "Class 11", desc: "Heat engines, Carnot cycle, First & Second laws of thermodynamics.", target: "course-class11" },
    { title: "Oscillations & Waves (Class 11)", type: "Chapter", category: "Class 11", desc: "Simple harmonic motion, resonance, Doppler effect, and sound waves.", target: "course-class11" },
    { title: "Gravitation (Class 11)", type: "Chapter", category: "Class 11", desc: "Kepler's laws, escape velocity, and gravitational potential energy.", target: "course-class11" },
    { title: "Properties of Matter (Class 11)", type: "Chapter", category: "Class 11", desc: "Bernoulli's principle, elasticity, viscosity, and surface tension.", target: "course-class11" },
    { title: "Electrostatics (Class 12)", type: "Chapter", category: "Class 12", desc: "Coulomb's law, Gauss's law, electric dipole, capacitors & dielectrics.", target: "course-class12" },
    { title: "Current Electricity (Class 12)", type: "Chapter", category: "Class 12", desc: "Drift velocity, Kirchhoff's laws, Wheatstone bridge & potentiometer.", target: "course-class12" },
    { title: "Magnetism & Magnetic Effects (Class 12)", type: "Chapter", category: "Class 12", desc: "Biot-Savart law, Ampere's circuital law, Lorentz force & cyclotron.", target: "course-class12" },
    { title: "Electromagnetic Induction & AC (Class 12)", type: "Chapter", category: "Class 12", desc: "Faraday's laws, Lenz's law, AC generators, LCR circuits & transformers.", target: "course-class12" },
    { title: "Optics (Ray & Wave) (Class 12)", type: "Chapter", category: "Class 12", desc: "Lens maker's equation, prisms, Huygens' principle, YDSE & diffraction.", target: "course-class12" },
    { title: "Modern Physics (Class 12)", type: "Chapter", category: "Class 12", desc: "Photoelectric effect, Bohr atom, nuclear binding energy & semiconductors.", target: "course-class12" },
    { title: "JEE Physics Practice", type: "Practice", category: "JEE", desc: "Curated problem sets for JEE Main & Advanced with complete solutions.", target: "practice-jee" },
    { title: "NEET Physics Practice", type: "Practice", category: "NEET", desc: "NCERT-aligned physics MCQs with step-by-step diagnostic feedback.", target: "practice-neet" },
    { title: "Concept Check Quizzes", type: "Practice", category: "Concept", desc: "Fundamental intuition builders to strengthen core physical principles.", target: "practice-concept" }
  ]
};

// Export to window
window.PHYSIX_DATA = PHYSIX_DATA;
