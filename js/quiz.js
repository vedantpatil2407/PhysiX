/**
 * PHYSIX Practice Zone Interactive Quiz Engine
 * Syllabus-verified questions for JEE, NEET, and Concept Checks.
 * High-precision mathematical notation rendering (KaTeX + Unicode fallback),
 * instant option feedback, score tracking, and comprehensive step-by-step solutions.
 */

class QuizEngine {
  constructor() {
    this.quizModalOverlay = document.getElementById("quizModalOverlay");
    this.quizModalTitle = document.getElementById("quizModalTitle");
    this.quizContainer = document.getElementById("quizContainer");
    this.btnCloseQuiz = document.getElementById("btnQuizModalClose");

    this.currentSetKey = null;
    this.currentQuestionIdx = 0;
    this.score = 0;
    this.answered = false;

    this.initListeners();
  }

  initListeners() {
    if (this.btnCloseQuiz) {
      this.btnCloseQuiz.addEventListener("click", () => this.close());
    }

    if (this.quizModalOverlay) {
      this.quizModalOverlay.addEventListener("click", (e) => {
        if (e.target === this.quizModalOverlay) this.close();
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });

    // Practice Card buttons
    document.querySelectorAll("[data-practice-set]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const setKey = e.currentTarget.getAttribute("data-practice-set");
        this.startQuiz(setKey);
      });
    });
  }

  isOpen() {
    return this.quizModalOverlay && this.quizModalOverlay.classList.contains("active");
  }

  startQuiz(setKey) {
    const practiceSets = window.PHYSIX_DATA.practiceSets;
    if (!practiceSets[setKey]) return;

    this.currentSetKey = setKey;
    this.currentQuestionIdx = 0;
    this.score = 0;
    this.answered = false;

    if (this.quizModalTitle) {
      this.quizModalTitle.textContent = practiceSets[setKey].title;
    }

    this.quizModalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

    this.renderCurrentQuestion();
  }

  close() {
    if (!this.quizModalOverlay) return;
    this.quizModalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  /**
   * Replaces balanced LaTeX \frac{num}{den} structures with (num / den).
   */
  replaceBalancedFractions(text) {
    if (!text || text.indexOf("\\frac{") === -1) return text;
    let index = 0;
    while (true) {
      index = text.indexOf("\\frac{", index);
      if (index === -1) break;

      // Find matching brace for numerator
      let numStart = index + 6;
      let depth = 1;
      let i = numStart;
      while (i < text.length && depth > 0) {
        if (text[i] === "{") depth++;
        else if (text[i] === "}") depth--;
        i++;
      }
      if (depth !== 0) { index += 6; continue; }
      let num = text.substring(numStart, i - 1);

      // Look for denominator starting with {
      let denStart = i;
      while (denStart < text.length && text[denStart] === " ") denStart++;
      if (text[denStart] !== "{") {
        index = i;
        continue;
      }
      depth = 1;
      let j = denStart + 1;
      while (j < text.length && depth > 0) {
        if (text[j] === "{") depth++;
        else if (text[j] === "}") depth--;
        j++;
      }
      if (depth !== 0) { index = j; continue; }
      let den = text.substring(denStart + 1, j - 1);

      // Replace with (num / den)
      text = text.substring(0, index) + "(" + num + " / " + den + ")" + text.substring(j);
    }
    return text;
  }

  /**
   * Cleans stray symbols and tokens occurring outside or inside math blocks.
   */
  cleanStraySymbols(text) {
    if (!text) return "";
    return text
      .replace(/\^\\circ/g, "°")
      .replace(/\\circ/g, "°")
      .replace(/\^2/g, "²")
      .replace(/\^3/g, "³")
      .replace(/\^\{-9\}/g, "⁻⁹")
      .replace(/\^\{-4\}/g, "⁻⁴")
      .replace(/\^\{-3\}/g, "⁻³")
      .replace(/\^\{-2\}/g, "⁻²")
      .replace(/\^\{-1\}/g, "⁻¹")
      .replace(/\\text\{\s*m\/s\^2\s*\}|\\text\{m\/s\}\^2/g, "m/s²")
      .replace(/\\text\{\s*m\/s\s*\}/g, "m/s")
      .replace(/\\text\{\s*kg\s*\}/g, "kg")
      .replace(/\\text\{\s*nm\s*\}/g, "nm")
      .replace(/\\text\{\s*mm\s*\}/g, "mm")
      .replace(/\\text\{\s*cm\s*\}/g, "cm")
      .replace(/\\text\{\s*m\s*\}/g, "m")
      .replace(/\\text\{\s*K\s*\}/g, "K")
      .replace(/\\text\{\s*J\s*\}/g, "J")
      .replace(/\\text\{\s*V\s*\}/g, "V")
      .replace(/\\text\{\s*A\s*\}/g, "A")
      .replace(/\\text\{\s*\\Omega\s*\}|\\Omega/g, "Ω")
      .replace(/\\text\{\s*\\mu F\s*\}/g, "μF")
      .replace(/_\{?\\text\{([^}]+)\}\}?/g, "_$1")
      .replace(/\\text\{([^}]+)\}/g, "$1")
      .replace(/\\theta_c/g, "θ_c")
      .replace(/\\theta/g, "θ")
      .replace(/\\phi/g, "φ")
      .replace(/\\mu_g/g, "μ_g")
      .replace(/\\mu_w/g, "μ_w")
      .replace(/\\mu_L/g, "μ_L")
      .replace(/\\mu_M/g, "μ_M")
      .replace(/\\mu/g, "μ")
      .replace(/\\rho/g, "ρ")
      .replace(/\\eta/g, "η")
      .replace(/\\nu_0/g, "ν₀")
      .replace(/\\nu/g, "ν")
      .replace(/\\lambda_0/g, "λ₀")
      .replace(/\\lambda/g, "λ")
      .replace(/\\omega/g, "ω")
      .replace(/\\Delta/g, "Δ")
      .replace(/\\varepsilon_0|\\epsilon_0/g, "ε₀")
      .replace(/\\le/g, "≤")
      .replace(/\\ge/g, "≥")
      .replace(/\\approx/g, "≈")
      .replace(/\\implies/g, "⇒")
      .replace(/\\pm/g, "±")
      .replace(/\\times/g, "×")
      .replace(/\\%/g, "%")
      .replace(/\\,|\\;|\\quad/g, " ");
  }

  /**
   * High-fidelity Unicode fallback converting LaTeX syntax directly into authentic physics typography.
   */
  formatMathFallback(text) {
    if (!text) return "";
    let str = this.replaceBalancedFractions(text);

    return str
      .replace(/\$\$([^$]+)\$\$/g, "$1")
      .replace(/\$([^$]+)\$/g, "$1")
      .replace(/\\vec\{([^}]+)\}/g, "$1⃗")
      .replace(/\\theta_c/g, "θ_c")
      .replace(/\\theta/g, "θ")
      .replace(/\\phi/g, "φ")
      .replace(/\\mu_g/g, "μ_g")
      .replace(/\\mu_w/g, "μ_w")
      .replace(/\\mu_v/g, "μ_v")
      .replace(/\\mu_r/g, "μ_r")
      .replace(/\\mu_k/g, "μ_k")
      .replace(/\\mu_L/g, "μ_L")
      .replace(/\\mu_M/g, "μ_M")
      .replace(/\\mu/g, "μ")
      .replace(/\\rho/g, "ρ")
      .replace(/\\eta/g, "η")
      .replace(/\\nu_0/g, "ν₀")
      .replace(/\\nu_1/g, "ν₁")
      .replace(/\\nu_2/g, "ν₂")
      .replace(/\\nu/g, "ν")
      .replace(/\\lambda_0/g, "λ₀")
      .replace(/\\lambda/g, "λ")
      .replace(/\\omega/g, "ω")
      .replace(/\\delta/g, "δ")
      .replace(/\\Delta/g, "Δ")
      .replace(/\\alpha/g, "α")
      .replace(/\\beta/g, "β")
      .replace(/\\gamma/g, "γ")
      .replace(/\\tau/g, "τ")
      .replace(/\\pi/g, "π")
      .replace(/\\hbar/g, "ℏ")
      .replace(/\\varepsilon_0|\\epsilon_0/g, "ε₀")
      .replace(/\\sqrt\{([^}]+)\}/g, "√$1")
      .replace(/\\sqrt\s*(\d+)/g, "√$1")
      .replace(/\^\\circ/g, "°")
      .replace(/\\circ/g, "°")
      .replace(/\^2/g, "²")
      .replace(/\^3/g, "³")
      .replace(/\^\{-9\}/g, "⁻⁹")
      .replace(/\^\{-4\}/g, "⁻⁴")
      .replace(/\^\{-3\}/g, "⁻³")
      .replace(/\^\{-2\}/g, "⁻²")
      .replace(/\^\{-1\}/g, "⁻¹")
      .replace(/_0/g, "₀")
      .replace(/_1/g, "₁")
      .replace(/_2/g, "₂")
      .replace(/_3/g, "₃")
      .replace(/_4/g, "₄")
      .replace(/_\{?\\text\{([^}]+)\}\}?/g, "_$1")
      .replace(/_\{([a-zA-Z0-9]+)\}/g, "_$1")
      .replace(/\\text\{\s*m\/s\^2\s*\}|\\text\{m\/s\}\^2/g, " m/s²")
      .replace(/\\text\{\s*m\/s\s*\}/g, " m/s")
      .replace(/\\text\{\s*m\s*\}/g, " m")
      .replace(/\\text\{\s*cm\s*\}/g, " cm")
      .replace(/\\text\{\s*mm\s*\}/g, " mm")
      .replace(/\\text\{\s*nm\s*\}/g, " nm")
      .replace(/\\text\{\s*kg\s*\}/g, " kg")
      .replace(/\\text\{\s*K\s*\}/g, " K")
      .replace(/\\text\{\s*J\s*\}/g, " J")
      .replace(/\\text\{\s*Hz\s*\}/g, " Hz")
      .replace(/\\text\{\s*V\s*\}/g, " V")
      .replace(/\\text\{\s*A\s*\}/g, " A")
      .replace(/\\text\{\s*H\s*\}/g, " H")
      .replace(/\\text\{\s*\\AA\s*\}/g, " Å")
      .replace(/\\text\{\s*\\Omega\s*\}|\\Omega/g, " Ω")
      .replace(/\\text\{\s*\\mu F\s*\}/g, " μF")
      .replace(/\\text\{([^}]+)\}/g, "$1")
      .replace(/\\le/g, "≤")
      .replace(/\\ge/g, "≥")
      .replace(/\\neq/g, "≠")
      .replace(/\\equiv/g, "≡")
      .replace(/\\approx/g, "≈")
      .replace(/\\propto/g, "∝")
      .replace(/\\times/g, "×")
      .replace(/\\div/g, "÷")
      .replace(/\\cdot/g, "·")
      .replace(/\\implies/g, "⇒")
      .replace(/\\pm/g, "±")
      .replace(/\\mp/g, "∓")
      .replace(/\\infty/g, "∞")
      .replace(/\\cos/g, "cos")
      .replace(/\\sin/g, "sin")
      .replace(/\\tan/g, "tan")
      .replace(/\\arcsin/g, "arcsin")
      .replace(/\\left\(/g, "(")
      .replace(/\\right\)/g, ")")
      .replace(/\\left\[/g, "[")
      .replace(/\\right\]/g, "]")
      .replace(/\\%/g, "%")
      .replace(/\\,|\\;|\\quad/g, " ")
      .replace(/\\\\/g, "\\");
  }

  /**
   * Formats mathematical expressions in text.
   * Uses KaTeX if loaded; falls back gracefully to clean, standardized Unicode notation.
   */
  formatMathText(text) {
    if (!text) return "";

    // 1. Try KaTeX renderToString for mathematical notation
    if (window.katex && typeof window.katex.renderToString === "function") {
      try {
        // Display math: $$...$$
        let parsed = text.replace(/\$\$([^$]+)\$\$/g, (match, expr) => {
          try {
            return window.katex.renderToString(expr.trim(), { displayMode: true, throwOnError: true });
          } catch (e) {
            return this.formatMathFallback(expr);
          }
        });

        // Inline math: $...$
        parsed = parsed.replace(/\$([^$]+)\$/g, (match, expr) => {
          try {
            return window.katex.renderToString(expr.trim(), { displayMode: false, throwOnError: true });
          } catch (e) {
            return this.formatMathFallback(expr);
          }
        });

        return this.cleanStraySymbols(parsed);
      } catch (err) {
        console.warn("KaTeX renderToString error, using Unicode fallback:", err);
      }
    }

    // 2. High-Fidelity Unicode Scientific Notation Fallback (guarantees proper symbols)
    return this.formatMathFallback(text);
  }

  renderKaTeXInElement(el) {
    if (!el || !window.renderMathInElement) return;
    try {
      window.renderMathInElement(el, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ],
        throwOnError: false
      });
    } catch (e) {
      console.warn("KaTeX element render notice:", e);
    }
  }

  renderCurrentQuestion() {
    const set = window.PHYSIX_DATA.practiceSets[this.currentSetKey];
    const questions = set.questions;
    const q = questions[this.currentQuestionIdx];

    this.answered = false;

    const formattedQuestion = this.formatMathText(q.question);
    const formattedExplanation = this.formatMathText(q.explanation);

    this.quizContainer.innerHTML = `
      <div class="quiz-progress-bar-wrap" style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 6px;">
          <span>Question ${this.currentQuestionIdx + 1} of ${questions.length}</span>
          <span>Score: <strong style="color: var(--emerald-primary);">${this.score} pts</strong></span>
        </div>
        <div style="height: 5px; background: rgba(255,255,255,0.06); border-radius: 9999px; overflow: hidden;">
          <div style="height: 100%; width: ${((this.currentQuestionIdx + 1) / questions.length) * 100}%; background: var(--emerald-primary); transition: width 0.3s ease;"></div>
        </div>
      </div>

      <div class="quiz-question-card" style="margin-bottom: 24px;">
        <div style="display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap;">
          <span class="badge badge-emerald">${q.examTag}</span>
          <span class="badge badge-neutral">${q.topic}</span>
        </div>
        <div class="quiz-question-text" id="quizQuestionText" style="font-size: 1.125rem; font-weight: 600; line-height: 1.6; color: var(--text-primary); margin-bottom: 20px;">
          ${formattedQuestion}
        </div>

        <div class="quiz-options-list" style="display: flex; flex-direction: column; gap: 10px;">
          ${q.options
            .map(
              (opt, idx) => `
            <button class="quiz-option-btn" data-opt-idx="${idx}" style="
              display: flex;
              align-items: center;
              gap: 14px;
              padding: 14px 18px;
              background: var(--bg-secondary);
              border: 1px solid var(--border-subtle);
              border-radius: var(--radius-md);
              color: var(--text-primary);
              text-align: left;
              font-size: 0.9375rem;
              transition: all var(--transition-fast);
              cursor: pointer;
            ">
              <span style="
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: rgba(255,255,255,0.05);
                border: 1px solid var(--border-subtle);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 0.8125rem;
                flex-shrink: 0;
                color: var(--text-secondary);
              ">${String.fromCharCode(65 + idx)}</span>
              <span class="opt-text" style="line-height: 1.4;">${this.formatMathText(opt)}</span>
            </button>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- Detailed Solution Box (Initially Hidden) -->
      <div id="quizExplanationBox" style="display: none; background: rgba(53, 211, 154, 0.08); border: 1px solid rgba(53, 211, 154, 0.3); border-radius: var(--radius-md); padding: 18px; margin-bottom: 20px;">
        <h4 style="font-size: 0.875rem; font-weight: 700; color: var(--emerald-primary); text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Step-by-Step Physics Solution
        </h4>
        <div id="quizExplanationText" style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${formattedExplanation}</div>
      </div>

      <!-- Action Button -->
      <div style="display: flex; justify-content: flex-end;">
        <button class="btn btn-primary" id="btnNextQuiz" style="display: none;">
          ${this.currentQuestionIdx + 1 < questions.length ? "Next Question" : "Complete Quiz"}
          <svg style="width: 16px; height: 16px; margin-left: 6px;"><use href="#icon-arrow-right"></use></svg>
        </button>
      </div>
    `;

    // Secondary auto-render pass for any nested KaTeX structures
    this.renderKaTeXInElement(this.quizContainer);

    // Option Clicks
    const optBtns = this.quizContainer.querySelectorAll(".quiz-option-btn");
    optBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (this.answered) return;
        const selectedIdx = parseInt(btn.getAttribute("data-opt-idx"), 10);
        this.handleAnswer(selectedIdx, q.correctIndex, optBtns);
      });
    });

    const btnNext = this.quizContainer.querySelector("#btnNextQuiz");
    btnNext.addEventListener("click", () => {
      if (this.currentQuestionIdx + 1 < questions.length) {
        this.currentQuestionIdx++;
        this.renderCurrentQuestion();
      } else {
        this.renderCompletionScreen();
      }
    });
  }

  handleAnswer(selectedIdx, correctIdx, optBtns) {
    this.answered = true;
    const isCorrect = selectedIdx === correctIdx;

    if (isCorrect) {
      this.score += 10;
    }

    optBtns.forEach((btn, idx) => {
      btn.style.cursor = "default";
      const badge = btn.querySelector("span:first-child");
      if (idx === correctIdx) {
        btn.style.borderColor = "var(--emerald-primary)";
        btn.style.background = "rgba(53, 211, 154, 0.15)";
        if (badge) {
          badge.style.background = "var(--emerald-primary)";
          badge.style.color = "#101A15";
          badge.style.borderColor = "var(--emerald-primary)";
        }
      } else if (idx === selectedIdx && !isCorrect) {
        btn.style.borderColor = "var(--color-error)";
        btn.style.background = "rgba(229, 83, 83, 0.15)";
        if (badge) {
          badge.style.background = "var(--color-error)";
          badge.style.color = "#FFFFFF";
          badge.style.borderColor = "var(--color-error)";
        }
      }
    });

    const explanationBox = this.quizContainer.querySelector("#quizExplanationBox");
    const btnNext = this.quizContainer.querySelector("#btnNextQuiz");

    if (explanationBox) {
      explanationBox.style.display = "block";
      this.renderKaTeXInElement(explanationBox);
    }

    if (btnNext) {
      btnNext.style.display = "inline-flex";
    }
  }

  renderCompletionScreen() {
    const set = window.PHYSIX_DATA.practiceSets[this.currentSetKey];
    const totalPossible = set.questions.length * 10;
    const pct = Math.round((this.score / totalPossible) * 100);

    this.quizContainer.innerHTML = `
      <div style="text-align: center; padding: 36px 16px;">
        <div style="width: 68px; height: 68px; border-radius: 50%; background: rgba(53, 211, 154, 0.15); border: 2px solid var(--emerald-primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: var(--emerald-primary);">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Practice Set Completed!</h3>
        <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 1rem;">
          You scored <strong style="color: var(--emerald-primary);">${this.score} / ${totalPossible}</strong> points (${pct}%).
        </p>

        <div style="display: flex; gap: 12px; justify-content: center;">
          <button class="btn btn-primary" id="btnRestartQuiz">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Retake Quiz
          </button>
          <button class="btn btn-secondary" id="btnCloseQuizSummary">Done</button>
        </div>
      </div>
    `;

    this.quizContainer.querySelector("#btnRestartQuiz").addEventListener("click", () => {
      this.startQuiz(this.currentSetKey);
    });

    this.quizContainer.querySelector("#btnCloseQuizSummary").addEventListener("click", () => {
      this.close();
    });
  }
}

window.QuizEngine = QuizEngine;
