/**
 * PHYSIX Photoelectric Effect Simulation Engine
 * Interactive Einstein's Photoelectric Equation: E = hν = φ + K_max = φ + eV₀
 * Real-time quantum photon emission, electron trajectory deflection under electric field,
 * variable target work function metals, stopping potential telemetry, and dual apparatus/graph views.
 * Enhanced with auto-bounding scale and user-adjustable zoom to guarantee zero boundary clipping.
 */

class PhotoelectricSimulation {
  constructor(container) {
    this.container = container;
    this.animationId = null;
    this.time = 0;

    // Available target cathode metals with standard experimental work functions (in eV)
    this.metals = {
      cesium: { name: "Cesium (Cs)", symbol: "Cs", phi: 2.14, color: "#D6B878" },
      potassium: { name: "Potassium (K)", symbol: "K", phi: 2.30, color: "#A78BFA" },
      sodium: { name: "Sodium (Na)", symbol: "Na", phi: 2.75, color: "#60A5FA" },
      zinc: { name: "Zinc (Zn)", symbol: "Zn", phi: 4.31, color: "#38BDF8" },
      platinum: { name: "Platinum (Pt)", symbol: "Pt", phi: 5.65, color: "#E2E8F0" }
    };

    // Simulation state
    this.selectedMetalKey = "cesium";
    this.wavelength = 420; // in nm
    this.intensity = 70; // 0 to 100 %
    this.voltage = 0.0; // -5.0 V to +5.0 V
    this.viewMode = "apparatus"; // "apparatus" or "graphs"
    this.graphTab = "both"; // "both", "einstein", or "iv" for responsive screens

    // Viewport scaling and boundary adjustability
    this.userZoom = 1.0;
    this.autoFit = true;

    // Particle pools for performance
    this.photons = [];
    this.electrons = [];
    this.maxElectrons = 60;
    this.photonSpawnTimer = 0;

    // Must calculate physics before rendering DOM elements that use calculated values
    this.recalculatePhysics();
    this.initDOM();
    this.initCanvas();
    this.animate();
  }

  get metal() {
    return this.metals[this.selectedMetalKey] || this.metals.cesium;
  }

  /**
   * Fundamental Quantum Physical Calculations
   */
  recalculatePhysics() {
    const hc = 1239.84; // eV * nm
    this.photonEnergy = hc / this.wavelength; // in eV
    this.frequency = (3e17 / this.wavelength); // in Hz (c = 3e8 m/s = 3e17 nm/s)
    this.workFunction = this.metal.phi; // in eV
    this.thresholdWavelength = hc / this.workFunction; // in nm
    this.thresholdFrequency = (this.workFunction * 1.60218e-19) / 6.62607e-34; // in Hz

    // Einstein's Photoelectric Equation: K_max = hν - φ
    if (this.photonEnergy > this.workFunction) {
      this.isEmissionActive = true;
      this.kMax = this.photonEnergy - this.workFunction; // in eV
      this.stoppingPotential = this.kMax; // in Volts (V₀ = K_max / e)
      const kJoules = this.kMax * 1.60218e-19;
      this.maxVelocity = Math.sqrt((2 * kJoules) / 9.10938e-31); // in m/s
    } else {
      this.isEmissionActive = false;
      this.kMax = 0;
      this.stoppingPotential = 0;
      this.maxVelocity = 0;
    }

    // Photocurrent Calculation (in microamps μA)
    const iSat = (this.intensity / 100) * 12.5; // max 12.5 μA

    if (!this.isEmissionActive) {
      this.current = 0;
    } else {
      const vCutoff = -this.stoppingPotential;
      if (this.voltage <= vCutoff) {
        this.current = 0;
      } else if (this.voltage < 0) {
        // Retarding potential region
        const ratio = (this.voltage - vCutoff) / Math.abs(vCutoff);
        this.current = iSat * Math.pow(Math.max(0, Math.min(1, ratio)), 1.6);
      } else {
        // Accelerating potential region
        this.current = iSat * (1 - 0.12 * Math.exp(-this.voltage / 0.7));
      }
    }
  }

  /**
   * Spectral color to RGB hex and CSS string
   */
  getSpectralColor(wl) {
    let r = 0, g = 0, b = 0;
    if (wl < 380) {
      r = 160; g = 80; b = 255;
    } else if (wl >= 380 && wl < 440) {
      r = -(wl - 440) / (440 - 380);
      g = 0.0;
      b = 1.0;
      r = Math.round(r * 255);
      g = Math.round(g * 255);
      b = Math.round(b * 255);
    } else if (wl >= 440 && wl < 490) {
      r = 0.0;
      g = (wl - 440) / (490 - 440);
      b = 1.0;
      r = Math.round(r * 255);
      g = Math.round(g * 255);
      b = Math.round(b * 255);
    } else if (wl >= 490 && wl < 510) {
      r = 0.0;
      g = 1.0;
      b = -(wl - 510) / (510 - 490);
      r = Math.round(r * 255);
      g = Math.round(g * 255);
      b = Math.round(b * 255);
    } else if (wl >= 510 && wl < 580) {
      r = (wl - 510) / (580 - 510);
      g = 1.0;
      b = 0.0;
      r = Math.round(r * 255);
      g = Math.round(g * 255);
      b = Math.round(b * 255);
    } else if (wl >= 580 && wl < 645) {
      r = 1.0;
      g = -(wl - 645) / (645 - 580);
      b = 0.0;
      r = Math.round(r * 255);
      g = Math.round(g * 255);
      b = Math.round(b * 255);
    } else if (wl >= 645 && wl <= 750) {
      r = 1.0;
      g = 0.0;
      b = 0.0;
      r = Math.round(r * 255);
      g = 0;
      b = 0;
    } else {
      r = 140; g = 20; b = 20;
    }

    return {
      css: `rgb(${r}, ${g}, ${b})`,
      hex: `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`,
      name: wl < 380 ? "Ultraviolet (UV)" : wl > 750 ? "Infrared (IR)" : `${wl} nm`
    };
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="sim-engine-layout">
        <!-- Canvas Viewport -->
        <div class="sim-canvas-viewport">
          <canvas id="photoelectricCanvas"></canvas>

          <!-- Top Floating Scientific Telemetry Overlay -->
          <div class="sim-telemetry-overlay">
            <div class="telemetry-chip">
              <span>Photon (hν):</span>
              <strong id="telPhotonEnergy">${this.photonEnergy.toFixed(2)} eV</strong>
            </div>
            <div class="telemetry-chip">
              <span>Work Func (φ):</span>
              <strong id="telWorkFunc" style="color: var(--gold-champagne);">${this.metal.phi.toFixed(2)} eV</strong>
            </div>
            <div class="telemetry-chip">
              <span>K_max:</span>
              <strong id="telKMax">${this.kMax.toFixed(2)} eV</strong>
            </div>
            <div class="telemetry-chip">
              <span>Stop V₀:</span>
              <strong id="telStopping">${this.stoppingPotential.toFixed(2)} V</strong>
            </div>
            <div class="telemetry-chip">
              <span>Current (I):</span>
              <strong id="telCurrent" style="color: ${this.current > 0 ? "var(--emerald-primary)" : "var(--text-muted)"};">
                ${this.current.toFixed(2)} μA
              </strong>
            </div>
          </div>

          <!-- Bottom Status Banner -->
          <div class="sim-energy-bar-wrap" style="display: flex; justify-content: space-between; align-items: center;">
            <div id="emissionStatusBadge" class="badge ${this.isEmissionActive ? "badge-emerald" : "badge-neutral"}" style="font-size: 0.8125rem;">
              ${this.isEmissionActive ? "✓ Photoelectric Emission Active (hν > φ)" : "✗ Below Threshold (hν ≤ φ) — No Emission"}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); font-family: var(--font-mono);">
              Threshold λ₀ = <strong id="telThresholdWl" style="color: var(--gold-champagne);">${this.thresholdWavelength.toFixed(0)} nm</strong>
            </div>
          </div>
        </div>

        <!-- Right Controls Panel -->
        <div class="sim-controls-panel">
          <!-- View Boundary & Zoom Control -->
          <div class="sim-control-group">
            <div class="control-header">
              <label>Boundary Scaling</label>
              <span class="control-val" id="valZoomModePhoto">Auto-Fit (100%)</span>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary btn-sm" id="btnZoomOutPhoto" style="flex: 1;" title="Zoom Out">🔍−</button>
              <button class="btn btn-secondary btn-sm" id="btnZoomResetPhoto" style="flex: 1.4;" title="Reset to Auto-Fit">Auto-Fit</button>
              <button class="btn btn-secondary btn-sm" id="btnZoomInPhoto" style="flex: 1;" title="Zoom In">🔍+</button>
            </div>
          </div>

          <!-- View Toggle -->
          <div class="sim-control-group">
            <label>Visualization Mode</label>
            <div class="sim-pill-toggle">
              <button class="pill-toggle-btn active" id="btnViewApparatus">Vacuum Apparatus</button>
              <button class="pill-toggle-btn" id="btnViewGraphs">Scientific Graphs</button>
            </div>
          </div>

          <!-- Target Metal Selection -->
          <div class="sim-control-group">
            <div class="control-header">
              <label>Target Cathode Metal</label>
              <span class="control-val" id="valMetalPhi" style="color: var(--gold-champagne);">φ = ${this.metal.phi.toFixed(2)} eV</span>
            </div>
            <select id="selectTargetMetal" class="sim-select">
              <option value="cesium" selected>Cesium (Cs) — φ = 2.14 eV</option>
              <option value="potassium">Potassium (K) — φ = 2.30 eV</option>
              <option value="sodium">Sodium (Na) — φ = 2.75 eV</option>
              <option value="zinc">Zinc (Zn) — φ = 4.31 eV</option>
              <option value="platinum">Platinum (Pt) — φ = 5.65 eV</option>
            </select>
          </div>

          <!-- Incident Light Wavelength -->
          <div class="sim-control-group">
            <div class="control-header">
              <label>Light Wavelength (λ)</label>
              <span class="control-val" id="valWavelength" style="display: flex; align-items: center; gap: 6px;">
                <span id="spectralColorDot" style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #60A5FA;"></span>
                <span>${this.wavelength} nm</span>
              </span>
            </div>
            <input type="range" id="sliderWavelength" min="160" max="780" step="5" value="${this.wavelength}" class="sim-slider">
            <div style="display: flex; justify-content: space-between; font-size: 0.6875rem; color: var(--text-muted); margin-top: 2px;">
              <span>UV (160nm)</span>
              <span>Violet (400)</span>
              <span>Green (520)</span>
              <span>Red (700nm)</span>
            </div>
          </div>

          <!-- Incident Light Intensity -->
          <div class="sim-control-group">
            <div class="control-header">
              <label>Beam Intensity (Photon Flux)</label>
              <span class="control-val" id="valIntensity">${this.intensity}%</span>
            </div>
            <input type="range" id="sliderIntensity" min="0" max="100" step="5" value="${this.intensity}" class="sim-slider">
          </div>

          <!-- Retarding / Accelerating Voltage -->
          <div class="sim-control-group">
            <div class="control-header">
              <label>Applied Voltage (Cathode to Anode)</label>
              <span class="control-val" id="valVoltage">${this.voltage >= 0 ? "+" : ""}${this.voltage.toFixed(2)} V</span>
            </div>
            <input type="range" id="sliderVoltage" min="-5.0" max="5.0" step="0.05" value="${this.voltage}" class="sim-slider">
            <div style="display: flex; justify-content: space-between; font-size: 0.6875rem; color: var(--text-muted); margin-top: 2px;">
              <span>Retarding (-5V)</span>
              <span>0V</span>
              <span>Accelerating (+5V)</span>
            </div>
          </div>

          <!-- Theoretical Equation Summary -->
          <div class="sim-analytical-summary">
            <div class="summary-item"><span>Einstein Eq:</span> <strong>K_max = hν - φ</strong></div>
            <div class="summary-item"><span>Stopping Potential:</span> <strong>eV₀ = K_max</strong></div>
            <div class="summary-item"><span>Max Electron Velocity:</span> <strong id="valVelocity">${(this.maxVelocity / 1e5).toFixed(2)} × 10⁵ m/s</strong></div>
          </div>

          <!-- Quick Scenario Presets -->
          <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 4px;">
            <label style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">Physics Presets:</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <button class="btn btn-secondary btn-sm" id="btnPresetThreshold">Threshold λ₀</button>
              <button class="btn btn-secondary btn-sm" id="btnPresetStopping">Stop Voltage (-V₀)</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Mode toggles
    const btnApparatus = this.container.querySelector("#btnViewApparatus");
    const btnGraphs = this.container.querySelector("#btnViewGraphs");

    btnApparatus.addEventListener("click", () => {
      this.viewMode = "apparatus";
      btnApparatus.classList.add("active");
      btnGraphs.classList.remove("active");
    });

    btnGraphs.addEventListener("click", () => {
      this.viewMode = "graphs";
      btnGraphs.classList.add("active");
      btnApparatus.classList.remove("active");
    });

    const btnZoomIn = this.container.querySelector("#btnZoomInPhoto");
    const btnZoomOut = this.container.querySelector("#btnZoomOutPhoto");
    const btnZoomReset = this.container.querySelector("#btnZoomResetPhoto");
    const valZoomMode = this.container.querySelector("#valZoomModePhoto");

    btnZoomIn.addEventListener("click", () => {
      this.autoFit = false;
      this.userZoom = Math.min(1.8, this.userZoom + 0.15);
      valZoomMode.textContent = `Manual (${Math.round(this.userZoom * 100)}%)`;
    });

    btnZoomOut.addEventListener("click", () => {
      this.autoFit = false;
      this.userZoom = Math.max(0.5, this.userZoom - 0.15);
      valZoomMode.textContent = `Manual (${Math.round(this.userZoom * 100)}%)`;
    });

    btnZoomReset.addEventListener("click", () => {
      this.autoFit = true;
      this.userZoom = 1.0;
      valZoomMode.textContent = "Auto-Fit (100%)";
    });

    // Target Metal Select
    const selectMetal = this.container.querySelector("#selectTargetMetal");
    selectMetal.addEventListener("change", (e) => {
      this.selectedMetalKey = e.target.value;
      this.updatePhysicsAndUI();
    });

    // Wavelength Slider
    const sliderWl = this.container.querySelector("#sliderWavelength");
    sliderWl.addEventListener("input", (e) => {
      this.wavelength = parseFloat(e.target.value);
      this.updatePhysicsAndUI();
    });

    // Intensity Slider
    const sliderInt = this.container.querySelector("#sliderIntensity");
    sliderInt.addEventListener("input", (e) => {
      this.intensity = parseFloat(e.target.value);
      this.updatePhysicsAndUI();
    });

    // Voltage Slider
    const sliderVolt = this.container.querySelector("#sliderVoltage");
    sliderVolt.addEventListener("input", (e) => {
      this.voltage = parseFloat(e.target.value);
      this.updatePhysicsAndUI();
    });

    // Preset: Exact Threshold Condition
    const btnThreshold = this.container.querySelector("#btnPresetThreshold");
    btnThreshold.addEventListener("click", () => {
      this.wavelength = Math.round(this.thresholdWavelength);
      sliderWl.value = this.wavelength;
      this.voltage = 0.0;
      sliderVolt.value = 0.0;
      this.updatePhysicsAndUI();
    });

    // Preset: Set Voltage Exactly to Stopping Potential
    const btnStopping = this.container.querySelector("#btnPresetStopping");
    btnStopping.addEventListener("click", () => {
      if (this.isEmissionActive) {
        this.voltage = -parseFloat(this.stoppingPotential.toFixed(2));
        sliderVolt.value = this.voltage;
        this.updatePhysicsAndUI();
      }
    });
  }

  updatePhysicsAndUI() {
    this.recalculatePhysics();

    const spec = this.getSpectralColor(this.wavelength);

    // Update labels
    const valMetalPhi = this.container.querySelector("#valMetalPhi");
    if (valMetalPhi) valMetalPhi.textContent = `φ = ${this.metal.phi.toFixed(2)} eV`;

    const valWl = this.container.querySelector("#valWavelength");
    if (valWl) {
      valWl.innerHTML = `
        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${spec.css};"></span>
        <span>${this.wavelength} nm (${spec.name})</span>
      `;
    }

    const valInt = this.container.querySelector("#valIntensity");
    if (valInt) valInt.textContent = `${this.intensity}%`;

    const valVolt = this.container.querySelector("#valVoltage");
    if (valVolt) valVolt.textContent = `${this.voltage >= 0 ? "+" : ""}${this.voltage.toFixed(2)} V`;

    const valVel = this.container.querySelector("#valVelocity");
    if (valVel) valVel.textContent = `${(this.maxVelocity / 1e5).toFixed(2)} × 10⁵ m/s`;

    // Update Top Telemetry
    const telPhoton = this.container.querySelector("#telPhotonEnergy");
    if (telPhoton) telPhoton.textContent = `${this.photonEnergy.toFixed(2)} eV`;

    const telWork = this.container.querySelector("#telWorkFunc");
    if (telWork) telWork.textContent = `${this.metal.phi.toFixed(2)} eV`;

    const telKMax = this.container.querySelector("#telKMax");
    if (telKMax) telKMax.textContent = `${this.kMax.toFixed(2)} eV`;

    const telStopping = this.container.querySelector("#telStopping");
    if (telStopping) telStopping.textContent = `${this.stoppingPotential.toFixed(2)} V`;

    const telCurrent = this.container.querySelector("#telCurrent");
    if (telCurrent) {
      telCurrent.textContent = `${this.current.toFixed(2)} μA`;
      telCurrent.style.color = this.current > 0 ? "var(--emerald-primary)" : "var(--text-muted)";
    }

    const telThresh = this.container.querySelector("#telThresholdWl");
    if (telThresh) telThresh.textContent = `${this.thresholdWavelength.toFixed(0)} nm`;

    const statusBadge = this.container.querySelector("#emissionStatusBadge");
    if (statusBadge) {
      if (this.isEmissionActive) {
        statusBadge.className = "badge badge-emerald";
        statusBadge.textContent = "✓ Photoelectric Emission Active (hν > φ)";
      } else {
        statusBadge.className = "badge badge-neutral";
        statusBadge.textContent = "✗ Below Threshold (hν ≤ φ) — No Emission";
      }
    }
  }

  initCanvas() {
    this.canvas = this.container.querySelector("#photoelectricCanvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    const resize = () => {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = rect.width || 600;
      this.height = Math.max(440, rect.height || 440);
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      this.ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", resize);
    resize();
  }

  animate() {
    this.time += 0.02;

    if (this.viewMode === "apparatus") {
      this.updateParticles();
      this.renderApparatus();
    } else {
      this.renderScientificGraphs();
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  getTubeDimensions() {
    const w = this.width;
    const h = this.height;

    const topClearance = 70;
    const bottomClearance = 50;

    const tubeCenterX = w * 0.5;
    const tubeCenterY = topClearance + (h - topClearance - bottomClearance) * 0.42;

    const zoom = this.autoFit ? 1.0 : this.userZoom;
    const baseW = Math.min(360, Math.max(220, (w - 70) * 0.65));
    const baseH = Math.min(160, Math.max(110, (h - 120) * 0.36));

    const tubeWidth = baseW * zoom;
    const tubeHeight = baseH * zoom;
    const cathodeX = tubeCenterX - tubeWidth * 0.41;
    const anodeX = tubeCenterX + tubeWidth * 0.41;

    return { tubeCenterX, tubeCenterY, tubeWidth, tubeHeight, cathodeX, anodeX };
  }

  updateParticles() {
    const { tubeCenterY, tubeHeight, cathodeX, anodeX } = this.getTubeDimensions();

    // 1. Spawn Photons from Light Source
    if (this.intensity > 0) {
      this.photonSpawnTimer += (this.intensity / 100) * 0.45;
      if (this.photonSpawnTimer >= 1) {
        this.photonSpawnTimer = 0;

        const lampX = cathodeX + 70;
        const lampY = tubeCenterY - tubeHeight * 0.5 - 35;

        const targetX = cathodeX + 5;
        const targetY = tubeCenterY + (Math.random() - 0.5) * (tubeHeight * 0.5);
        const dx = targetX - lampX;
        const dy = targetY - lampY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        this.photons.push({
          x: lampX,
          y: lampY,
          vx: (dx / dist) * 7.5,
          vy: (dy / dist) * 7.5,
          targetY: targetY,
          color: this.getSpectralColor(this.wavelength).css
        });
      }
    }

    // Move Photons
    for (let i = this.photons.length - 1; i >= 0; i--) {
      const p = this.photons[i];
      p.x += p.vx;
      p.y += p.vy;

      // Collision with cathode
      if (p.x <= cathodeX + 8) {
        this.photons.splice(i, 1);

        // Spawn photoelectron
        if (this.isEmissionActive && this.electrons.length < this.maxElectrons) {
          const baseSpeed = Math.sqrt(this.kMax) * 2.8;
          const angle = (Math.random() - 0.5) * 1.0;
          const initialVx = Math.cos(angle) * (baseSpeed * (0.65 + Math.random() * 0.35));
          const initialVy = Math.sin(angle) * baseSpeed * 0.8;

          this.electrons.push({
            x: cathodeX + 12,
            y: p.targetY,
            vx: Math.max(0.8, initialVx),
            vy: initialVy,
            alive: true
          });
        }
      } else if (p.y > this.height || p.x < 0) {
        this.photons.splice(i, 1);
      }
    }

    // 2. Move Electrons Under Applied Electric Field
    const ax = this.voltage * 0.45;

    for (let i = this.electrons.length - 1; i >= 0; i--) {
      const e = this.electrons[i];
      e.vx += ax * 0.05;
      e.x += e.vx;
      e.y += e.vy;

      // Boundaries inside tube
      if (e.x >= anodeX - 5) {
        this.electrons.splice(i, 1);
      } else if (e.x < cathodeX) {
        this.electrons.splice(i, 1);
      } else if (e.y < tubeCenterY - tubeHeight * 0.48 || e.y > tubeCenterY + tubeHeight * 0.48) {
        this.electrons.splice(i, 1);
      }
    }
  }

  /**
   * Render Physical Evacuated Tube Apparatus View
   */
  renderApparatus() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#0A0E0C";
    ctx.fillRect(0, 0, w, h);

    const { tubeCenterX, tubeCenterY, tubeWidth, tubeHeight, cathodeX, anodeX } = this.getTubeDimensions();

    // 1. Draw Evacuated Glass Tube
    ctx.save();
    ctx.strokeStyle = "rgba(53, 211, 154, 0.25)";
    ctx.lineWidth = 3;
    ctx.fillStyle = "rgba(16, 26, 21, 0.75)";
    ctx.beginPath();
    ctx.roundRect(tubeCenterX - tubeWidth / 2, tubeCenterY - tubeHeight / 2, tubeWidth, tubeHeight, 28);
    ctx.fill();
    ctx.stroke();

    // Quartz Window on top-left of tube
    const windowX = cathodeX + 70;
    ctx.strokeStyle = "rgba(214, 184, 120, 0.6)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(windowX, tubeCenterY - tubeHeight / 2, 24, Math.PI, 0);
    ctx.stroke();
    ctx.restore();

    // 2. Light Source (Monochromatic Lamp)
    const lampX = windowX;
    const lampY = tubeCenterY - tubeHeight * 0.5 - 35;
    const spec = this.getSpectralColor(this.wavelength);

    ctx.save();
    // Lamp Housing
    ctx.fillStyle = "#1E2922";
    ctx.strokeStyle = "var(--border-subtle)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(lampX, lampY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Bulb Core
    ctx.fillStyle = spec.css;
    ctx.shadowColor = spec.css;
    ctx.shadowBlur = this.intensity > 0 ? 14 : 0;
    ctx.beginPath();
    ctx.arc(lampX, lampY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Light Beam Cone
    if (this.intensity > 0) {
      const grad = ctx.createLinearGradient(lampX, lampY, cathodeX + 8, tubeCenterY);
      grad.addColorStop(0, spec.css.replace("rgb", "rgba").replace(")", `, ${0.4 * (this.intensity / 100)})`));
      grad.addColorStop(1, spec.css.replace("rgb", "rgba").replace(")", `, ${0.05 * (this.intensity / 100)})`));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(lampX - 8, lampY + 10);
      ctx.lineTo(lampX + 16, lampY + 6);
      ctx.lineTo(cathodeX + 8, tubeCenterY + tubeHeight * 0.35);
      ctx.lineTo(cathodeX + 8, tubeCenterY - tubeHeight * 0.35);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 3. Draw Cathode Plate (Target Emitter)
    ctx.save();
    ctx.fillStyle = this.metal.color;
    ctx.strokeStyle = "#F3F2EC";
    ctx.lineWidth = 1;
    const plateH = tubeHeight * 0.65;
    ctx.fillRect(cathodeX - 8, tubeCenterY - plateH / 2, 10, plateH);
    ctx.strokeRect(cathodeX - 8, tubeCenterY - plateH / 2, 10, plateH);

    // Cathode Label
    ctx.font = "bold 10px Inter, sans-serif";
    ctx.fillStyle = "#F3F2EC";
    ctx.textAlign = "center";
    ctx.fillText("Cathode (-)", cathodeX - 2, tubeCenterY - plateH / 2 - 8);
    ctx.font = "10px JetBrains Mono, monospace";
    ctx.fillStyle = this.metal.color;
    ctx.fillText(this.metal.symbol, cathodeX - 3, tubeCenterY + 4);
    ctx.restore();

    // 4. Draw Anode Plate (Collector)
    ctx.save();
    ctx.fillStyle = "#A2B0A5";
    ctx.strokeStyle = "#F3F2EC";
    ctx.lineWidth = 1;
    ctx.fillRect(anodeX - 2, tubeCenterY - plateH / 2, 10, plateH);
    ctx.strokeRect(anodeX - 2, tubeCenterY - plateH / 2, 10, plateH);

    // Anode Label
    ctx.font = "bold 10px Inter, sans-serif";
    ctx.fillStyle = "#F3F2EC";
    ctx.textAlign = "center";
    ctx.fillText("Anode (+)", anodeX + 3, tubeCenterY - plateH / 2 - 8);
    ctx.restore();

    // 5. Draw Electric Field Indication (Lines with arrows)
    if (Math.abs(this.voltage) >= 0.1) {
      ctx.save();
      const isRetarding = this.voltage < 0;
      ctx.strokeStyle = isRetarding ? "rgba(229, 83, 83, 0.25)" : "rgba(53, 211, 154, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      for (let yOffset of [-tubeHeight * 0.2, 0, tubeHeight * 0.2]) {
        const lineY = tubeCenterY + yOffset;
        ctx.beginPath();
        ctx.moveTo(cathodeX + 8, lineY);
        ctx.lineTo(anodeX - 4, lineY);
        ctx.stroke();

        const arrowX = tubeCenterX;
        const arrowDir = isRetarding ? -1 : 1;
        ctx.beginPath();
        ctx.moveTo(arrowX - arrowDir * 5, lineY - 3.5);
        ctx.lineTo(arrowX + arrowDir * 5, lineY);
        ctx.lineTo(arrowX - arrowDir * 5, lineY + 3.5);
        ctx.fillStyle = isRetarding ? "rgba(229, 83, 83, 0.5)" : "rgba(53, 211, 154, 0.5)";
        ctx.fill();
      }
      ctx.restore();
    }

    // 6. External DC Circuit Wires, Microammeter & Battery
    ctx.save();
    ctx.strokeStyle = "#29372E";
    ctx.lineWidth = 2.5;

    const wireY = Math.min(h - 55, tubeCenterY + tubeHeight * 0.5 + 40);
    ctx.beginPath();
    ctx.moveTo(cathodeX - 3, tubeCenterY + plateH / 2);
    ctx.lineTo(cathodeX - 3, wireY);
    ctx.lineTo(tubeCenterX - 75, wireY);

    ctx.moveTo(anodeX + 3, tubeCenterY + plateH / 2);
    ctx.lineTo(anodeX + 3, wireY);
    ctx.lineTo(tubeCenterX + 75, wireY);
    ctx.stroke();

    // Microammeter
    const meterX = tubeCenterX - 45;
    ctx.fillStyle = "#16211B";
    ctx.strokeStyle = this.current > 0 ? "var(--emerald-primary)" : "var(--border-subtle)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(meterX, wireY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = "bold 10px JetBrains Mono, monospace";
    ctx.fillStyle = this.current > 0 ? "var(--emerald-primary)" : "#A2B0A5";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${this.current.toFixed(1)}μA`, meterX, wireY);

    // Variable DC Battery
    const battX = tubeCenterX + 45;
    ctx.fillStyle = "#16211B";
    ctx.strokeStyle = Math.abs(this.voltage) > 0 ? "var(--gold-champagne)" : "var(--border-subtle)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(battX - 26, wireY - 14, 52, 28, 5);
    ctx.fill();
    ctx.stroke();

    ctx.font = "bold 10px JetBrains Mono, monospace";
    ctx.fillStyle = "var(--gold-champagne)";
    ctx.fillText(`${this.voltage >= 0 ? "+" : ""}${this.voltage.toFixed(1)}V`, battX, wireY);
    ctx.restore();

    // 7. Render Photons
    ctx.save();
    for (let p of this.photons) {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 1.5, p.y - p.vy * 1.5);
      ctx.stroke();
    }
    ctx.restore();

    // 8. Render Ejected Photoelectrons
    ctx.save();
    for (let e of this.electrons) {
      ctx.fillStyle = "#38BDF8";
      ctx.shadowColor = "#38BDF8";
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(e.x, e.y, 2.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#090B0A";
      ctx.fillRect(e.x - 1.2, e.y - 0.5, 2.4, 1);
    }
    ctx.restore();
  }

  /**
   * Render Scientific Graphs View (Responsive & Adaptive)
   */
  renderScientificGraphs() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#0A0E0C";
    ctx.fillRect(0, 0, w, h);

    const isNarrow = w < 620;
    const margin = 20;

    if (!isNarrow) {
      // Side-by-side Dual Graphs
      const graphWidth = (w - margin * 3) / 2;
      const graphHeight = h - margin * 2 - 10;
      this.drawEinsteinGraph(margin, margin, graphWidth, graphHeight);
      this.drawIVGraph(margin * 2 + graphWidth, margin, graphWidth, graphHeight);
    } else {
      // Stacked Dual Graphs for smaller screens
      const graphWidth = w - margin * 2;
      const graphHeight = (h - margin * 3) / 2;
      this.drawEinsteinGraph(margin, margin, graphWidth, graphHeight);
      this.drawIVGraph(margin, margin * 2 + graphHeight, graphWidth, graphHeight);
    }
  }

  drawEinsteinGraph(gx, gy, gw, gh) {
    const ctx = this.ctx;

    ctx.save();
    ctx.fillStyle = "rgba(16, 26, 21, 0.85)";
    ctx.strokeStyle = "var(--border-subtle)";
    ctx.lineWidth = 1.5;
    ctx.roundRect(gx, gy, gw, gh, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = "bold 11px Inter, sans-serif";
    ctx.fillStyle = "var(--gold-champagne)";
    ctx.textAlign = "left";
    ctx.fillText("K_max vs Frequency (ν)", gx + 12, gy + 18);

    const originX = gx + 35;
    const originY = gy + gh - 35;
    const axisW = gw - 50;
    const axisH = gh - 55;

    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX, originY - axisH);
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + axisW, originY);
    ctx.stroke();

    ctx.font = "9px Inter, sans-serif";
    ctx.fillStyle = "#A2B0A5";
    ctx.fillText("K (eV)", originX - 8, originY - axisH - 4);
    ctx.fillText("ν", originX + axisW - 10, originY + 16);

    const freqMax = 18e14;
    const kMaxAxis = 6.0;

    const mapX = (f) => Math.min(originX + axisW, Math.max(originX, originX + (f / freqMax) * axisW));
    const mapY = (k) => Math.max(originY - axisH, Math.min(originY, originY - (k / kMaxAxis) * axisH));

    const threshX = mapX(this.thresholdFrequency);
    const endX = mapX(freqMax);
    const endY = mapY((6.62607e-34 * freqMax) / 1.60218e-19 - this.workFunction);

    ctx.strokeStyle = "var(--gold-champagne)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(threshX, originY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.fillStyle = "var(--gold-champagne)";
    ctx.beginPath();
    ctx.arc(threshX, originY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "9px JetBrains Mono, monospace";
    ctx.fillText("ν₀", threshX - 3, originY + 12);

    const currX = mapX(this.frequency);
    const currY = mapY(this.kMax);

    ctx.fillStyle = "var(--emerald-primary)";
    ctx.beginPath();
    ctx.arc(currX, currY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "9px JetBrains Mono, monospace";
    ctx.fillText(`${this.kMax.toFixed(2)}eV`, currX + 6, currY - 4);
    ctx.restore();
  }

  drawIVGraph(gx, gy, gw, gh) {
    const ctx = this.ctx;

    ctx.save();
    ctx.fillStyle = "rgba(16, 26, 21, 0.85)";
    ctx.strokeStyle = "var(--border-subtle)";
    ctx.lineWidth = 1.5;
    ctx.roundRect(gx, gy, gw, gh, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = "bold 11px Inter, sans-serif";
    ctx.fillStyle = "var(--emerald-primary)";
    ctx.textAlign = "left";
    ctx.fillText("Photocurrent (I) vs Voltage (V)", gx + 12, gy + 18);

    const centerAxisX = gx + gw * 0.45;
    const baseAxisY = gy + gh - 35;
    const axisH = gh - 55;
    const vSpanW = gw - 50;

    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerAxisX, baseAxisY);
    ctx.lineTo(centerAxisX, baseAxisY - axisH);
    ctx.moveTo(gx + 25, baseAxisY);
    ctx.lineTo(gx + gw - 20, baseAxisY);
    ctx.stroke();

    ctx.font = "9px Inter, sans-serif";
    ctx.fillStyle = "#A2B0A5";
    ctx.fillText("I (μA)", centerAxisX - 10, baseAxisY - axisH - 4);
    ctx.fillText("V", gx + gw - 15, baseAxisY + 16);
    ctx.fillText("0", centerAxisX - 2, baseAxisY + 12);

    const mapVoltX = (v) => Math.min(gx + gw - 20, Math.max(gx + 25, centerAxisX + (v / 5.0) * (vSpanW * 0.46)));
    const iMaxAxis = 15.0;
    const mapCurrY = (curr) => Math.max(baseAxisY - axisH, Math.min(baseAxisY, baseAxisY - (curr / iMaxAxis) * axisH));

    if (this.isEmissionActive) {
      const vCutoff = -this.stoppingPotential;
      const iSat = (this.intensity / 100) * 12.5;

      ctx.strokeStyle = "var(--emerald-primary)";
      ctx.lineWidth = 2;
      ctx.beginPath();

      ctx.moveTo(mapVoltX(-5), mapCurrY(0));
      ctx.lineTo(mapVoltX(Math.max(-5, vCutoff)), mapCurrY(0));

      for (let vStep = Math.max(-5, vCutoff); vStep <= 5.0; vStep += 0.15) {
        let currentAtV;
        if (vStep < 0) {
          const ratio = (vStep - vCutoff) / Math.abs(vCutoff);
          currentAtV = iSat * Math.pow(Math.max(0, Math.min(1, ratio)), 1.6);
        } else {
          currentAtV = iSat * (1 - 0.12 * Math.exp(-vStep / 0.7));
        }
        ctx.lineTo(mapVoltX(vStep), mapCurrY(currentAtV));
      }
      ctx.stroke();

      const stopX = mapVoltX(vCutoff);
      ctx.fillStyle = "#E55353";
      ctx.beginPath();
      ctx.arc(stopX, baseAxisY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "9px JetBrains Mono, monospace";
      ctx.fillText(`-V₀ (${vCutoff.toFixed(1)}V)`, stopX - 20, baseAxisY + 14);

      const currPtX = mapVoltX(this.voltage);
      const currPtY = mapCurrY(this.current);

      ctx.fillStyle = "var(--emerald-primary)";
      ctx.beginPath();
      ctx.arc(currPtX, currPtY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "9px JetBrains Mono, monospace";
      ctx.fillText(`${this.current.toFixed(1)}μA`, currPtX + 5, currPtY - 4);
    } else {
      ctx.font = "10px Inter, sans-serif";
      ctx.fillStyle = "#E55353";
      ctx.textAlign = "center";
      ctx.fillText("No current: hν ≤ φ", centerAxisX, baseAxisY - axisH * 0.5);
    }
    ctx.restore();
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.photons = [];
    this.electrons = [];
  }
}

window.PhotoelectricSimulation = PhotoelectricSimulation;
