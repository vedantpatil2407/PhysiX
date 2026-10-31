/**
 * PHYSIX Internationalization (i18n) Engine
 * Centralized bilingual translations dictionary (English & Hindi)
 * Updates interface labels instantly while preserving mathematical notation and formulas.
 */

const PHYSIX_TRANSLATIONS = {
  en: {
    // Navigation
    nav_home: "Home",
    nav_library: "Physics Library",
    nav_simulations: "Simulations",
    nav_formula_hub: "Formula Hub",
    nav_practice: "Practice Zone",

    // Hero Section
    hero_tag: "Interactive Physics Platform",
    hero_title_1: "PHYSICS,",
    hero_title_2: "VISUALIZED.",
    hero_desc: "Go beyond memorization. Explore the laws of the universe through interactive experiments, visual explanations, and smarter practice.",
    hero_cta_explore: "Explore Physics",
    hero_cta_sims: "Enter Simulation Lab",
    hero_search_placeholder: "Search concepts, formulas, or chapters...",
    hero_popular: "Popular:",
    hud_orbital_speed: "Orbital Velocity",
    hud_kepler: "Kepler's Law Active",
    hud_eccentricity: "Eccentricity e = 0.38",

    // Course Section (Class 11 & 12)
    courses_tag: "Curriculum Pathways",
    courses_title: "Your Physics Journey",
    courses_subtitle: "Structured syllabus pathways crafted for Class 11, Class 12, JEE, and NEET excellence.",
    class11_badge: "Foundation & Mechanics",
    class11_title: "Class 11 Physics",
    class11_desc: "Master classical mechanics, thermodynamic systems, oscillations, and mechanical properties of bulk matter.",
    class12_badge: "Electromagnetism & Quantum",
    class12_title: "Class 12 Physics",
    class12_desc: "Explore electrostatic fields, electrodynamics, wave and ray optics, and modern quantum physics.",
    topics_available: "topics available",
    btn_explore_chapters: "Explore Chapters",

    // Simulation Section
    sims_tag: "Interactive Experimentation",
    sims_title: "See Physics in Action",
    sims_subtitle: "Manipulate physical variables in real time and watch the mathematical laws of nature unfold before your eyes.",
    sim_projectile_title: "Projectile Motion",
    sim_projectile_desc: "Launch objects with adjustable velocity, angle, and gravity. Observe parabolic trajectories, range, and apex telemetry.",
    sim_optics_title: "Ray Optics",
    sim_optics_desc: "Trace light rays across convex and concave lenses. Observe focal points, image formation, and real vs. virtual states.",
    sim_waves_title: "Wave Motion",
    sim_waves_desc: "Simulate transverse wave propagation, harmonic frequencies, standing waves, and constructive/destructive interference.",
    sim_circuits_title: "Electric Circuits",
    sim_circuits_desc: "Assemble DC circuits with variable voltage and resistance. Visualize live electron drift and Kirchhoff's loop.",
    sim_photoelectric_title: "Photoelectric Effect",
    sim_photoelectric_desc: "Simulate photon absorption, electron emission, target work functions, stopping potential, and I-V characteristic curves.",
    btn_explore_sim: "Explore Simulation",

    // Formula Section
    formula_tag: "Mathematical Core",
    formula_title: "Formula of the Day",
    formula_subtitle: "Unpack core physical formulas, understand each SI variable, and compute live scenarios.",
    formula_example_label: "Physical Context & Example:",
    calc_heading: "Live Formula Parameter Calculator",
    btn_open_explorer: "Open Formula Explorer",
    btn_calculate: "Compute",
    calc_result: "Calculated Result",

    // Practice Section
    practice_tag: "Diagnostic Mastery",
    practice_title: "Practice Zone",
    practice_subtitle: "High-yield, syllabus-verified problem sets designed to reinforce conceptual clarity and test speed.",
    practice_jee_title: "JEE Physics Practice",
    practice_jee_desc: "Advanced multi-concept problems testing calculus-based mechanics, field theory, and analytical problem-solving.",
    practice_neet_title: "NEET Physics Practice",
    practice_neet_desc: "High-yield NCERT-aligned conceptual and numerical MCQs focused on accuracy, speed, and core fundamentals.",
    practice_concept_title: "Concept Check Quizzes",
    practice_concept_desc: "Fast diagnostic questions that eliminate common physical misconceptions and test intuitive understanding.",
    btn_start_practice: "Start Practice",

    // Footer
    footer_about_title: "Platform",
    footer_about_desc: "PHYSIX is a next-generation visual physics platform bridging classroom curriculum and computational experiment.",
    footer_resources_title: "Resources",
    footer_legal_title: "Information",
    footer_link_syllabus: "Class 11 & 12 Syllabus",
    footer_link_simlab: "Simulation Lab",
    footer_link_formulas: "Formula Repository",
    footer_link_jee: "JEE Prep Modules",
    footer_link_neet: "NEET Prep Modules",
    footer_link_about: "About the Project",
    footer_link_contact: "Contact & Feedback",
    footer_link_privacy: "Privacy Policy",
    footer_copyright: "© 2026 PHYSIX Platform. Designed for Class 11, Class 12, JEE, and NEET students.",
    tag_planned: "Coming Soon"
  },

  hi: {
    // Navigation
    nav_home: "होम",
    nav_library: "भौतिकी लाइब्रेरी",
    nav_simulations: "सिमुलेशन लैब",
    nav_formula_hub: "सूत्र केंद्र",
    nav_practice: "अभ्यास क्षेत्र",

    // Hero Section
    hero_tag: "इंटरैक्टिव भौतिकी मंच",
    hero_title_1: "भौतिकी,",
    hero_title_2: "दृश्य रूप में।",
    hero_desc: "रटने से आगे बढ़ें। इंटरैक्टिव प्रयोगों, दृश्य व्याख्याओं और स्मार्ट अभ्यास के माध्यम से ब्रह्मांड के नियमों को समझें।",
    hero_cta_explore: "भौतिकी का अन्वेषण करें",
    hero_cta_sims: "सिमुलेशन लैब में प्रवेश करें",
    hero_search_placeholder: "अवधारणाएं, सूत्र या अध्याय खोजें...",
    hero_popular: "लोकप्रिय:",
    hud_orbital_speed: "कक्षीय वेग",
    hud_kepler: "केपलर का नियम सक्रिय",
    hud_eccentricity: "उत्केंद्रता e = 0.38",

    // Course Section (Class 11 & 12)
    courses_tag: "पाठ्यक्रम मार्ग",
    courses_title: "आपकी भौतिकी यात्रा",
    courses_subtitle: "कक्षा 11, 12, जेईई और नीट की उत्कृष्ट तैयारी के लिए तैयार किए गए समग्र वैचारिक रोडमैप।",
    class11_badge: "नींव और यांत्रिकी",
    class11_title: "कक्षा 11 भौतिकी",
    class11_desc: "न्यूटनियन यांत्रिकी, ऊष्मागतिकी प्रणालियों, दोलनों और स्थूल पदार्थ के यांत्रिक गुणों में महारत हासिल करें।",
    class12_badge: "विद्युत चुंबकत्व और आधुनिक",
    class12_title: "कक्षा 12 भौतिकी",
    class12_desc: "स्थिरवैद्युतिकी, विद्युत गतिकी, तरंग और किरण प्रकाशिकी तथा आधुनिक क्वांटम भौतिकी का अन्वेषण करें।",
    topics_available: "विषय उपलब्ध",
    btn_explore_chapters: "अध्याय देखें",

    // Simulation Section
    sims_tag: "इंटरैक्टिव प्रयोग",
    sims_title: "भौतिकी को क्रियान्वित देखें",
    sims_subtitle: "भौतिक चरों को वास्तविक समय में नियंत्रित करें और प्रकृति के गणितीय नियमों को साकार होते देखें।",
    sim_projectile_title: "प्रक्षेप्य गति",
    sim_projectile_desc: "समायोज्य वेग, कोण और गुरुत्वाकर्षण के साथ वस्तुओं को लॉन्च करें। परवलयाकार पथ और ऊर्जा गतिशीलता का निरीक्षण करें।",
    sim_optics_title: "किरण प्रकाशिकी",
    sim_optics_desc: "उत्तल और अवतल लेंसों में प्रकाश किरणों को ट्रैक करें। फोकस बिंदु, प्रतिबिंब निर्माण और आवर्धन को समझें।",
    sim_waves_title: "तरंग गति",
    sim_waves_desc: "अनुप्रस्थ तरंग संचरण, हार्मोनिक आवृत्तियों, अप्रगामी तरंगों और संपोषी/विनाशी व्यतिकरण का सिमुलेशन करें।",
    sim_circuits_title: "विद्युत परिपथ",
    sim_circuits_desc: "परिवर्तनीय वोल्टेज और प्रतिरोध के साथ डीसी सर्किट बनाएं। वास्तविक समय में इलेक्ट्रॉन प्रवाह और किरचॉफ लूप देखें।",
    sim_photoelectric_title: "प्रकाश-वैद्युत प्रभाव",
    sim_photoelectric_desc: "फोटॉन अवशोषण, इलेक्ट्रॉन उत्सर्जन, कार्यफलन, निरोधी विभव और धारा-विभव वक्रों का जीवंत सिमुलेशन करें।",
    btn_explore_sim: "सिमुलेशन चलाएं",

    // Formula Section
    formula_tag: "गणितीय आधार",
    formula_title: "आज का सूत्र",
    formula_subtitle: "मूल भौतिक सूत्रों को समझें, प्रत्येक एसआई मात्रक का विश्लेषण करें और वास्तविक परिदृश्य की गणना करें।",
    formula_example_label: "भौतिक संदर्भ और उदाहरण:",
    calc_heading: "लाइव सूत्र पैरामीटर कैलकुलेटर",
    btn_open_explorer: "सूत्र एक्सप्लोरर खोलें",
    btn_calculate: "गणना करें",
    calc_result: "परिकलित परिणाम",

    // Practice Section
    practice_tag: "अभ्यास और महारत",
    practice_title: "अभ्यास क्षेत्र",
    practice_subtitle: "वैचारिक स्पष्टता और गति को सुदृढ़ करने के लिए पाठ्यक्रम-सत्यापित प्रश्न सेट।",
    practice_jee_title: "जेईई भौतिकी अभ्यास",
    practice_jee_desc: "यांत्रिकी, क्षेत्र सिद्धांत और विश्लेषणात्मक समस्या-समाधान पर आधारित उन्नत बहु-अवधारणात्मक प्रश्न।",
    practice_neet_title: "नीट भौतिकी अभ्यास",
    practice_neet_desc: "सटीकता, गति और मूल सिद्धांतों पर केंद्रित एनसीईआरटी-संरेखित वैचारिक और संख्यात्मक बहुविकल्पीय प्रश्न।",
    practice_concept_title: "अवधारणा जांच प्रश्नोत्तरी",
    practice_concept_desc: "सामान्य भौतिक भ्रांतियों को दूर करने और सहज वैचारिक समझ का परीक्षण करने वाले त्वरित प्रश्न।",
    btn_start_practice: "अभ्यास शुरू करें",

    // Footer
    footer_about_title: "मंच",
    footer_about_desc: "PHYSIX अगली पीढ़ी का दृश्य भौतिकी मंच है जो कक्षा पाठ्यक्रम और कम्प्यूटेशनल प्रयोग को जोड़ता है।",
    footer_resources_title: "संसाधन",
    footer_legal_title: "जानकारी",
    footer_link_syllabus: "कक्षा 11 व 12 पाठ्यक्रम",
    footer_link_simlab: "सिमुलेशन लैब",
    footer_link_formulas: "सूत्र भंडार",
    footer_link_jee: "जेईई तैयारी मॉड्यूल",
    footer_link_neet: "नीट तैयारी मॉड्यूल",
    footer_link_about: "परियोजना के बारे में",
    footer_link_contact: "संपर्क और प्रतिक्रिया",
    footer_link_privacy: "गोपनीयता नीति",
    footer_copyright: "© 2026 PHYSIX मंच। कक्षा 11, 12, जेईई और नीट छात्रों के लिए समर्पित।",
    tag_planned: "शीघ्र उपलब्ध"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem("physix_lang") || "en";
  }

  init() {
    this.applyLanguage(this.currentLang);
    this.setupListeners();
  }

  setupListeners() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const lang = e.currentTarget.getAttribute("data-lang");
        if (lang && lang !== this.currentLang) {
          this.setLanguage(lang);
        }
      });
    });
  }

  setLanguage(lang) {
    if (!PHYSIX_TRANSLATIONS[lang]) return;
    this.currentLang = lang;
    localStorage.setItem("physix_lang", lang);
    this.applyLanguage(lang);

    // Dispatch event so active components can adapt
    window.dispatchEvent(new CustomEvent("physix:langchange", { detail: { lang } }));
  }

  applyLanguage(lang) {
    const dict = PHYSIX_TRANSLATIONS[lang] || PHYSIX_TRANSLATIONS.en;

    // Update active class on buttons
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const btnLang = btn.getAttribute("data-lang");
      if (btnLang === lang) {
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      }
    });

    // Translate all elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Translate placeholder attributes with data-i18n-placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) {
        el.setAttribute("placeholder", dict[key]);
      }
    });

    // Set document lang attribute
    document.documentElement.lang = lang;
  }

  t(key) {
    const dict = PHYSIX_TRANSLATIONS[this.currentLang] || PHYSIX_TRANSLATIONS.en;
    return dict[key] || key;
  }
}

// Global instance
window.i18n = new I18nManager();
