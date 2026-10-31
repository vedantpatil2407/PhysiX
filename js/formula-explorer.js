/**
 * PHYSIX Formula of the Day & Formula Explorer Engine
 * KaTeX rendering of mathematical expressions, variable breakdowns,
 * live interactive parameter calculation, and full repository modal.
 */

class FormulaExplorer {
  constructor() {
    this.featuredData = window.PHYSIX_DATA.featuredFormulas[0]; // v = u + at
    this.formulaModalOverlay = document.getElementById("formulaModalOverlay");
    this.btnOpenExplorer = document.getElementById("btnOpenFormulaExplorer");
    this.btnCloseModal = document.getElementById("btnFormulaModalClose");

    this.initFeaturedFormula();
    this.initFormulaModal();
  }

  renderKaTeX(latex, container) {
    if (!container) return;
    if (window.katex) {
      try {
        window.katex.render(latex, container, {
          throwOnError: false,
          displayMode: true
        });
      } catch (err) {
        container.textContent = latex;
      }
    } else {
      container.textContent = latex;
    }
  }

  initFeaturedFormula() {
    const mathEl = document.getElementById("featuredFormulaMath");
    const varsContainer = document.getElementById("featuredFormulaVars");
    const exampleEl = document.getElementById("featuredFormulaExample");

    if (mathEl) {
      this.renderKaTeX(this.featuredData.latex, mathEl);
    }

    if (exampleEl) {
      exampleEl.textContent = this.featuredData.example;
    }

    if (varsContainer) {
      varsContainer.innerHTML = this.featuredData.variables
        .map(
          (v) => `
        <div class="variable-item">
          <div class="variable-symbol">${v.symbol}</div>
          <div class="variable-meaning">${v.meaning}</div>
          <div class="variable-unit">${v.unit}</div>
        </div>
      `
        )
        .join("");
    }

    this.initCalculator();
  }

  initCalculator() {
    const inputU = document.getElementById("calcInputU");
    const inputA = document.getElementById("calcInputA");
    const inputT = document.getElementById("calcInputT");
    const resultVal = document.getElementById("calcResultVal");

    const compute = () => {
      const u = parseFloat(inputU.value) || 0;
      const a = parseFloat(inputA.value) || 0;
      const t = parseFloat(inputT.value) || 0;
      const v = u + a * t;
      if (resultVal) {
        resultVal.textContent = `${v.toFixed(2)} m/s`;
      }
    };

    [inputU, inputA, inputT].forEach((inp) => {
      if (inp) {
        inp.addEventListener("input", compute);
      }
    });

    compute();
  }

  initFormulaModal() {
    if (this.btnOpenExplorer) {
      this.btnOpenExplorer.addEventListener("click", () => this.openModal());
    }

    if (this.btnCloseModal) {
      this.btnCloseModal.addEventListener("click", () => this.closeModal());
    }

    if (this.formulaModalOverlay) {
      this.formulaModalOverlay.addEventListener("click", (e) => {
        if (e.target === this.formulaModalOverlay) this.closeModal();
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.formulaModalOverlay?.classList.contains("active")) {
        this.closeModal();
      }
    });
  }

  openModal() {
    if (!this.formulaModalOverlay) return;
    this.populateModalContent();
    this.formulaModalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    if (!this.formulaModalOverlay) return;
    this.formulaModalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  populateModalContent() {
    const container = document.getElementById("formulaListContainer");
    if (!container) return;

    const formulas = window.PHYSIX_DATA.featuredFormulas;
    container.innerHTML = formulas
      .map(
        (f, idx) => `
      <div class="formula-catalog-card card" style="margin-bottom: 20px;">
        <div class="formula-card-top" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-size: 1.125rem; color: var(--text-primary);">${f.name}</h4>
          <span class="badge badge-emerald">${f.category}</span>
        </div>
        <div class="modal-latex-display" id="modalKaTeX_${idx}" style="text-align: center; margin: 16px 0; font-size: 1.3rem;"></div>
        <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 16px;">${f.example}</p>
        <div class="variables-grid" style="margin-bottom: 0;">
          ${f.variables
            .map(
              (v) => `
            <div class="variable-item">
              <div class="variable-symbol">${v.symbol}</div>
              <div class="variable-meaning">${v.meaning}</div>
              <div class="variable-unit">${v.unit}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
      )
      .join("");

    // Render KaTeX for each card
    formulas.forEach((f, idx) => {
      const el = document.getElementById(`modalKaTeX_${idx}`);
      this.renderKaTeX(f.latex, el);
    });
  }
}

window.FormulaExplorer = FormulaExplorer;
