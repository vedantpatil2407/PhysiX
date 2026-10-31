/**
 * PHYSIX Simulation Modal Manager
 * Manages modal display, lifecycle, and dynamic mounting/unmounting of simulation engines.
 */

class SimulationModalManager {
  constructor() {
    this.modalOverlay = document.getElementById("simModalOverlay");
    this.modalTitle = document.getElementById("simModalTitle");
    this.modalBadge = document.getElementById("simModalBadge");
    this.simContainer = document.getElementById("simModalContainer");
    this.btnClose = document.getElementById("btnSimModalClose");

    this.activeSimulation = null;
    this.initListeners();
  }

  initListeners() {
    if (this.btnClose) {
      this.btnClose.addEventListener("click", () => this.close());
    }

    if (this.modalOverlay) {
      this.modalOverlay.addEventListener("click", (e) => {
        if (e.target === this.modalOverlay) this.close();
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });

    // Attach listeners to all "Explore Simulation" cards
    document.querySelectorAll("[data-sim-trigger]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const simId = e.currentTarget.getAttribute("data-sim-trigger");
        this.open(simId);
      });
    });
  }

  isOpen() {
    return this.modalOverlay && this.modalOverlay.classList.contains("active");
  }

  normalizeSimId(simId) {
    if (!simId) return "photoelectric-effect";
    const s = String(simId).toLowerCase().trim();
    if (s.includes("photoelectric") || s === "modern-physics" || s === "sim-photoelectric") return "photoelectric-effect";
    if (s.includes("optic") || s.includes("ray") || s.includes("lens") || s === "sim-optics") return "ray-optics";
    if (s.includes("wave") || s.includes("superposition") || s.includes("sound") || s === "sim-waves") return "wave-motion";
    if (s.includes("circuit") || s.includes("ohm") || s.includes("electric") || s === "sim-circuits") return "electric-circuits";
    if (s.includes("projectile") || s.includes("kinematic") || s === "sim-projectile") return "projectile-motion";
    return s;
  }

  open(simId) {
    if (!this.modalOverlay) return;

    // Teardown previous active simulation
    this.cleanupCurrent();

    const normalizedId = this.normalizeSimId(simId);

    // Find simulation metadata from data.js
    const meta = (window.PHYSIX_DATA?.simulations || []).find(
      (s) => s.id === normalizedId || s.id === simId
    ) || {
      titleKey: normalizedId === "photoelectric-effect" ? "sim_photoelectric_title" : "sim_projectile_title",
      badge: normalizedId === "photoelectric-effect" ? "Class 12" : "Class 11",
      id: normalizedId
    };

    const titleText = window.i18n ? window.i18n.t(meta.titleKey) : meta.id;
    if (this.modalTitle) this.modalTitle.textContent = titleText;
    if (this.modalBadge) this.modalBadge.textContent = meta.badge;

    this.modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

    // Instantiate appropriate simulation
    setTimeout(() => {
      try {
        switch (normalizedId) {
          case "photoelectric-effect":
            if (window.PhotoelectricSimulation) {
              this.activeSimulation = new window.PhotoelectricSimulation(this.simContainer);
            } else {
              console.error("PhotoelectricSimulation engine not found on window object");
            }
            break;
          case "ray-optics":
            if (window.OpticsSimulation) {
              this.activeSimulation = new window.OpticsSimulation(this.simContainer);
            }
            break;
          case "wave-motion":
            if (window.WaveSimulation) {
              this.activeSimulation = new window.WaveSimulation(this.simContainer);
            }
            break;
          case "electric-circuits":
            if (window.CircuitSimulation) {
              this.activeSimulation = new window.CircuitSimulation(this.simContainer);
            }
            break;
          case "projectile-motion":
            if (window.ProjectileSimulation) {
              this.activeSimulation = new window.ProjectileSimulation(this.simContainer);
            }
            break;
          default:
            if (window.PhotoelectricSimulation && normalizedId.includes("photo")) {
              this.activeSimulation = new window.PhotoelectricSimulation(this.simContainer);
            } else if (window.ProjectileSimulation) {
              this.activeSimulation = new window.ProjectileSimulation(this.simContainer);
            }
        }
      } catch (err) {
        console.error("Error mounting simulation:", err);
      }
    }, 50);
  }

  close() {
    if (!this.modalOverlay) return;
    this.modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
    this.cleanupCurrent();
  }

  cleanupCurrent() {
    if (this.activeSimulation && typeof this.activeSimulation.destroy === "function") {
      this.activeSimulation.destroy();
    }
    this.activeSimulation = null;
    if (this.simContainer) this.simContainer.innerHTML = "";
  }
}

window.SimulationModalManager = SimulationModalManager;
