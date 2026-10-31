/**
 * PHYSIX Live Content Search System
 * Real-time indexing and filtering across chapters, concepts, formulas, and simulations.
 * Supports keyboard navigation, category filtering, match highlighting, and instant deep-linking.
 */

class ContentSearch {
  constructor() {
    this.searchInput = document.getElementById("heroSearchInput");
    this.dropdown = document.getElementById("searchResultsDropdown");
    this.clearBtn = document.getElementById("searchClearBtn");
    this.resultsList = document.getElementById("searchResultsList");
    this.filterChips = document.querySelectorAll(".filter-chip");

    this.activeFilter = "All";
    this.currentIndex = -1;
    this.currentMatches = [];

    this.initListeners();
  }

  initListeners() {
    if (!this.searchInput) return;

    this.searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      if (this.clearBtn) {
        if (query.length > 0) this.clearBtn.classList.add("visible");
        else this.clearBtn.classList.remove("visible");
      }
      this.performSearch(query);
    });

    this.searchInput.addEventListener("focus", () => {
      const query = this.searchInput.value.trim();
      if (query.length > 0) this.performSearch(query);
    });

    if (this.clearBtn) {
      this.clearBtn.addEventListener("click", () => {
        this.searchInput.value = "";
        this.clearBtn.classList.remove("visible");
        this.closeDropdown();
        this.searchInput.focus();
      });
    }

    // Filter Chips
    this.filterChips.forEach((chip) => {
      chip.addEventListener("click", (e) => {
        this.filterChips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        this.activeFilter = chip.getAttribute("data-filter") || "All";
        this.performSearch(this.searchInput.value.trim());
      });
    });

    // Keyboard navigation
    this.searchInput.addEventListener("keydown", (e) => {
      if (!this.dropdown.classList.contains("active")) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.navigateResults(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.navigateResults(-1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (this.currentIndex >= 0 && this.currentMatches[this.currentIndex]) {
          this.selectResult(this.currentMatches[this.currentIndex]);
        }
      } else if (e.key === "Escape") {
        this.closeDropdown();
      }
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrapper")) {
        this.closeDropdown();
      }
    });

    // Popular Quick Topic Tags
    document.querySelectorAll(".quick-topic-tag").forEach((tag) => {
      tag.addEventListener("click", () => {
        const query = tag.getAttribute("data-search");
        if (query) {
          this.searchInput.value = query;
          if (this.clearBtn) this.clearBtn.classList.add("visible");
          this.performSearch(query);
          this.searchInput.focus();
        }
      });
    });
  }

  performSearch(query) {
    if (!query) {
      this.closeDropdown();
      return;
    }

    const lower = query.toLowerCase();
    const index = window.PHYSIX_DATA.searchIndex || [];

    let matches = index.filter((item) => {
      const matchFilter = this.activeFilter === "All" || item.type.toLowerCase() === this.activeFilter.toLowerCase();
      const matchQuery =
        item.title.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower) ||
        item.desc.toLowerCase().includes(lower);
      return matchFilter && matchQuery;
    });

    this.currentMatches = matches;
    this.currentIndex = -1;
    this.renderResults(matches, query);
    this.openDropdown();
  }

  openDropdown() {
    if (this.dropdown) this.dropdown.classList.add("active");
  }

  closeDropdown() {
    if (this.dropdown) this.dropdown.classList.remove("active");
    this.currentIndex = -1;
  }

  highlightMatch(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  }

  renderResults(matches, query) {
    if (!this.resultsList) return;

    if (matches.length === 0) {
      this.resultsList.innerHTML = `
        <div class="search-empty-state">
          <svg class="search-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <p style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">No concepts or formulas found</p>
          <p style="font-size: 0.8125rem;">Try searching for <em>"Projectile"</em>, <em>"Thermodynamics"</em>, or <em>"Snell"</em>.</p>
        </div>
      `;
      return;
    }

    this.resultsList.innerHTML = matches
      .map(
        (m, idx) => `
      <div class="search-result-item" data-res-idx="${idx}">
        <div class="search-item-info">
          <div class="search-item-title">${this.highlightMatch(m.title, query)}</div>
          <div class="search-item-desc">${this.highlightMatch(m.desc, query)}</div>
        </div>
        <span class="badge ${m.type === "Simulation" ? "badge-emerald" : m.type === "Formula" ? "badge-gold" : "badge-neutral"}">
          ${m.type}
        </span>
      </div>
    `
      )
      .join("");

    this.resultsList.querySelectorAll(".search-result-item").forEach((el) => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.getAttribute("data-res-idx"), 10);
        if (this.currentMatches[idx]) {
          this.selectResult(this.currentMatches[idx]);
        }
      });
    });
  }

  navigateResults(direction) {
    const items = this.resultsList.querySelectorAll(".search-result-item");
    if (items.length === 0) return;

    items.forEach((it) => it.classList.remove("highlighted"));

    this.currentIndex += direction;
    if (this.currentIndex >= items.length) this.currentIndex = 0;
    if (this.currentIndex < 0) this.currentIndex = items.length - 1;

    items[this.currentIndex].classList.add("highlighted");
    items[this.currentIndex].scrollIntoView({ block: "nearest" });
  }

  selectResult(item) {
    this.closeDropdown();

    // Deep link action based on target
    if (item.target.startsWith("sim-")) {
      const simId = item.target === "sim-projectile" ? "projectile-motion" :
                    item.target === "sim-optics" ? "ray-optics" :
                    item.target === "sim-waves" ? "wave-motion" :
                    item.target === "sim-circuits" ? "electric-circuits" :
                    item.target === "sim-photoelectric" ? "photoelectric-effect" : "projectile-motion";
      if (window.simModalManager) {
        window.simModalManager.open(simId);
      }
    } else if (item.target.startsWith("formula-")) {
      if (window.formulaExplorer) {
        window.formulaExplorer.openModal();
      }
    } else if (item.target.startsWith("course-")) {
      const classId = item.target === "course-class11" ? "class11" : "class12";
      if (window.openChapterModal) {
        window.openChapterModal(classId);
      }
    } else if (item.target.startsWith("practice-")) {
      const setKey = item.target === "practice-jee" ? "jee" :
                     item.target === "practice-neet" ? "neet" : "concept";
      if (window.quizEngine) {
        window.quizEngine.startQuiz(setKey);
      }
    }
  }
}

window.ContentSearch = ContentSearch;
