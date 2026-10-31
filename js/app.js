/**
 * PHYSIX Main Application Controller
 * Bootstraps the platform, manages navigation, chapter explorer modal,
 * informational dialogs, and coordinates submodules.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Localization Engine
  if (window.i18n) {
    window.i18n.init();
  }

  // 2. Initialize Hero Celestial Visual Canvas
  if (window.CelestialHeroVisual) {
    window.celestialHero = new window.CelestialHeroVisual("celestialCanvas");
  }

  // 3. Initialize Simulation Modal Manager
  if (window.SimulationModalManager) {
    window.simModalManager = new window.SimulationModalManager();
  }

  // 4. Initialize Formula Explorer
  if (window.FormulaExplorer) {
    window.formulaExplorer = new window.FormulaExplorer();
  }

  // 5. Initialize Practice Quiz Engine
  if (window.QuizEngine) {
    window.quizEngine = new window.QuizEngine();
  }

  // 6. Initialize Live Content Search
  if (window.ContentSearch) {
    window.contentSearch = new window.ContentSearch();
  }

  // 7. Setup Mobile Navigation Drawer
  setupMobileDrawer();

  // 8. Setup Chapter Inspector Modal (Class 11 & Class 12)
  setupChapterInspectorModal();

  // 9. Setup Informational Modals (About, Contact, Resources)
  setupInfoModals();

  // 10. Setup Hero CTAs
  setupHeroCTAs();
});

/**
 * Mobile Navigation Drawer
 */
function setupMobileDrawer() {
  const toggleBtn = document.getElementById("mobileToggleBtn");
  const drawer = document.getElementById("mobileDrawer");
  const overlay = document.getElementById("mobileDrawerOverlay");
  const closeBtn = document.getElementById("mobileDrawerClose");

  const openDrawer = () => {
    if (drawer) drawer.classList.add("active");
    if (overlay) overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    if (drawer) drawer.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (toggleBtn) toggleBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);

  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      closeDrawer();
    });
  });
}

/**
 * Chapter Inspector Modal for Class 11 and Class 12
 */
function setupChapterInspectorModal() {
  const modalOverlay = document.getElementById("chapterModalOverlay");
  const modalTitle = document.getElementById("chapterModalTitle");
  const modalBadge = document.getElementById("chapterModalBadge");
  const modalBody = document.getElementById("chapterModalContent");
  const btnClose = document.getElementById("btnChapterModalClose");

  window.openChapterModal = (classKey) => {
    if (!modalOverlay) return;

    const courseData = window.PHYSIX_DATA.courses[classKey];
    if (!courseData) return;

    const classTitle = classKey === "class11" ? "Class 11 Physics Syllabus" : "Class 12 Physics Syllabus";
    if (modalTitle) modalTitle.textContent = classTitle;
    if (modalBadge) modalBadge.textContent = `${courseData.topicsCount} Topics Active`;

    if (modalBody) {
      modalBody.innerHTML = `
        <div class="chapters-syllabus-list" style="display: flex; flex-direction: column; gap: 16px;">
          ${courseData.chapters
            .map(
              (ch) => `
            <div class="chapter-syllabus-card" style="
              background: var(--bg-secondary);
              border: 1px solid var(--border-subtle);
              border-radius: var(--radius-lg);
              padding: 18px 20px;
            ">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                <h4 style="font-size: 1.125rem; font-weight: 700; color: var(--text-primary);">${ch.name}</h4>
                <div style="display: flex; gap: 8px;">
                  <span class="badge badge-emerald">${ch.topicsCount} Topics</span>
                  <span class="badge badge-gold">${ch.weightage}</span>
                </div>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;">
                ${ch.subtopics
                  .map(
                    (sub) => `
                  <span style="
                    font-size: 0.8125rem;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--border-subtle);
                    color: var(--text-secondary);
                    padding: 4px 10px;
                    border-radius: var(--radius-sm);
                  ">${sub}</span>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    }

    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeChapterModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  if (btnClose) btnClose.addEventListener("click", closeChapterModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeChapterModal();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay?.classList.contains("active")) {
      closeChapterModal();
    }
  });

  // Attach buttons in course cards
  document.querySelectorAll("[data-course-class]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const cls = e.currentTarget.getAttribute("data-course-class");
      window.openChapterModal(cls);
    });
  });
}

/**
 * Informational Dialogs (About, Contact, Learning Resources)
 */
function setupInfoModals() {
  const modalOverlay = document.getElementById("infoModalOverlay");
  const modalTitle = document.getElementById("infoModalTitle");
  const modalBody = document.getElementById("infoModalContent");
  const btnClose = document.getElementById("btnInfoModalClose");

  const openInfoModal = (type) => {
    if (!modalOverlay) return;

    if (type === "about") {
      modalTitle.textContent = "About PHYSIX";
      modalBody.innerHTML = `
        <div style="line-height: 1.7; color: var(--text-secondary);">
          <div style="margin-bottom: 20px;">
            <span class="badge badge-gold" style="margin-bottom: 10px;">College Prototype & Startup Roadmap</span>
            <h4 style="font-size: 1.25rem; color: var(--text-primary); margin-top: 8px;">Next-Gen Visual Physics Platform</h4>
          </div>
          <p style="margin-bottom: 14px;">
            <strong>PHYSIX</strong> is developed as an advanced digital educational product merging <em>computational physics visualization</em> with high-school and competitive examination syllabi (Class 11, Class 12, JEE Main/Advanced, and NEET).
          </p>
          <p style="margin-bottom: 14px;">
            Traditional education relies heavily on static textbook formulas and rote memorization. PHYSIX empowers students to manipulate physical laws directly—adjusting angles, fields, refractive indices, and currents in real time.
          </p>
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; margin: 20px 0;">
            <h5 style="color: var(--emerald-primary); margin-bottom: 8px; font-weight: 700;">Architecture & Expansion</h5>
            <ul style="list-style: disc; margin-left: 20px; font-size: 0.875rem;">
              <li>Frontend: Modular HTML5, CSS3, Vanilla ES6, KaTeX mathematical engine</li>
              <li>Backend Compatibility: Ready for Python Flask / FastAPI microservices</li>
              <li>Future Roadmap: User accounts, test analytics, 3D WebGL kinematics, and automated doubt solving</li>
            </ul>
          </div>
        </div>
      `;
    } else if (type === "contact") {
      modalTitle.textContent = "Contact & College Showcase";
      modalBody.innerHTML = `
        <div style="line-height: 1.7; color: var(--text-secondary);">
          <p style="margin-bottom: 16px;">
            PHYSIX is presented as a premier computer science & digital product design project. Feedback, evaluations, and academic inquiries are warmly welcome.
          </p>
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
            <p><strong>Project Lead & Engineering:</strong> PhysiX Development Team</p>
            <p><strong>Department:</strong> Computer Science & Engineering / Physics</p>
            <p><strong>Focus:</strong> Interactive Educational Technology & Computational UI</p>
          </div>
          <p style="font-size: 0.875rem; color: var(--text-muted);">
            For demonstration feedback or institutional pilot inquiries, contact via the project workspace repository.
          </p>
        </div>
      `;
    } else if (type === "resources") {
      modalTitle.textContent = "Learning Resources & NCERT Mapping";
      modalBody.innerHTML = `
        <div style="line-height: 1.7; color: var(--text-secondary);">
          <p style="margin-bottom: 16px;">
            All topics, simulations, and problem sets within PHYSIX strictly adhere to the approved NCERT, NTA JEE, and NMC NEET physics syllabi.
          </p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="padding: 12px 16px; background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <strong style="color: var(--text-primary);">NCERT Physics Class XI & XII (Revised Edition)</strong>
              <p style="font-size: 0.8125rem; margin-top: 4px;">Core conceptual baseline for foundational derivations and mechanics.</p>
            </div>
            <div style="padding: 12px 16px; background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <strong style="color: var(--text-primary);">NTA JEE Advanced Syllabus</strong>
              <p style="font-size: 0.8125rem; margin-top: 4px;">Analytical multi-concept synthesis and vector calculus kinematics.</p>
            </div>
            <div style="padding: 12px 16px; background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <strong style="color: var(--text-primary);">NMC NEET Physics Framework</strong>
              <p style="font-size: 0.8125rem; margin-top: 4px;">High-yield diagnostic problem sets and medical application optics.</p>
            </div>
          </div>
        </div>
      `;
    }

    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeInfoModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  if (btnClose) btnClose.addEventListener("click", closeInfoModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeInfoModal();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay?.classList.contains("active")) {
      closeInfoModal();
    }
  });

  // Footer links
  document.querySelectorAll("[data-info-trigger]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const type = e.currentTarget.getAttribute("data-info-trigger");
      openInfoModal(type);
    });
  });
}

/**
 * Setup Hero CTAs
 */
function setupHeroCTAs() {
  const btnExplore = document.getElementById("heroBtnExplore");
  const btnSimLab = document.getElementById("heroBtnSimLab");

  if (btnExplore) {
    btnExplore.addEventListener("click", () => {
      const target = document.getElementById("coursesSection");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (btnSimLab) {
    btnSimLab.addEventListener("click", () => {
      const target = document.getElementById("simulationsSection");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  }
}
