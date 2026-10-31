/**
 * PHYSIX Wave Motion & Superposition Simulation
 * Interactive travelling and standing wave interference with nodes, antinodes,
 * frequency, amplitude, and wave speed controls.
 * Enhanced with auto-bounding scale and user-adjustable zoom to guarantee zero boundary clipping.
 */

class WaveSimulation {
  constructor(container) {
    this.container = container;
    this.animationId = null;
    this.isPlaying = true;
    this.time = 0;

    // Wave parameters
    this.mode = "standing"; // "standing" or "travelling"
    this.frequency = 1.5; // Hz
    this.amplitude = 35; // px
    this.wavelength = 200; // px
    this.waveSpeed = 150; // px/s

    // Viewport scaling and boundary adjustability
    this.userZoom = 1.0;
    this.autoFit = true;

    this.initDOM();
    this.initCanvas();
    this.animate();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="sim-engine-layout">
        <div class="sim-canvas-viewport">
          <canvas id="wavesCanvas"></canvas>
          <div class="sim-telemetry-overlay">
            <div class="telemetry-chip"><span>Wave Speed (v = fλ):</span> <strong id="waveSpeedVal">300 px/s</strong></div>
            <div class="telemetry-chip"><span>Period (T):</span> <strong id="wavePeriodVal">0.67 s</strong></div>
            <div class="telemetry-chip"><span>Mode:</span> <strong id="waveModeVal">Standing Wave</strong></div>
          </div>
        </div>

        <div class="sim-controls-panel">
          <!-- View Boundary & Zoom Control -->
          <div class="sim-control-group">
            <div class="control-header">
              <label>Boundary Scaling</label>
              <span class="control-val" id="valZoomModeWaves">Auto-Fit (100%)</span>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary btn-sm" id="btnZoomOutWaves" style="flex: 1;" title="Zoom Out">🔍−</button>
              <button class="btn btn-secondary btn-sm" id="btnZoomResetWaves" style="flex: 1.4;" title="Reset to Auto-Fit">Auto-Fit</button>
              <button class="btn btn-secondary btn-sm" id="btnZoomInWaves" style="flex: 1;" title="Zoom In">🔍+</button>
            </div>
          </div>

          <div class="sim-control-group">
            <label>Wave Phenomenon</label>
            <div class="sim-pill-toggle">
              <button class="pill-toggle-btn active" id="btnStanding">Standing Wave</button>
              <button class="pill-toggle-btn" id="btnTravelling">Travelling Wave</button>
            </div>
          </div>

          <div class="sim-control-group">
            <div class="control-header">
              <label>Frequency (f)</label>
              <span class="control-val" id="valFreq">1.5 Hz</span>
            </div>
            <input type="range" id="sliderFreq" min="0.5" max="3.5" step="0.1" value="1.5" class="sim-slider">
          </div>

          <div class="sim-control-group">
            <div class="control-header">
              <label>Amplitude (A)</label>
              <span class="control-val" id="valAmp">35 px</span>
            </div>
            <input type="range" id="sliderAmp" min="10" max="60" step="1" value="35" class="sim-slider">
          </div>

          <div class="sim-analytical-summary">
            <div class="summary-item"><span>Wave Equation:</span> <strong>y = 2A sin(kx) cos(ωt)</strong></div>
            <div class="summary-item"><span>Interference:</span> <strong>Nodes at x = n(λ/2)</strong></div>
          </div>

          <div class="sim-btn-group">
            <button class="btn btn-primary" id="btnPlayPauseWaves">Pause</button>
            <button class="btn btn-secondary" id="btnResetWaves">Reset</button>
          </div>
        </div>
      </div>
    `;

    const btnStanding = this.container.querySelector("#btnStanding");
    const btnTravelling = this.container.querySelector("#btnTravelling");
    const sliderFreq = this.container.querySelector("#sliderFreq");
    const sliderAmp = this.container.querySelector("#sliderAmp");
    const btnPlayPause = this.container.querySelector("#btnPlayPauseWaves");
    const btnReset = this.container.querySelector("#btnResetWaves");

    const btnZoomIn = this.container.querySelector("#btnZoomInWaves");
    const btnZoomOut = this.container.querySelector("#btnZoomOutWaves");
    const btnZoomReset = this.container.querySelector("#btnZoomResetWaves");
    const valZoomMode = this.container.querySelector("#valZoomModeWaves");

    btnStanding.addEventListener("click", () => {
      this.mode = "standing";
      btnStanding.classList.add("active");
      btnTravelling.classList.remove("active");
      this.container.querySelector("#waveModeVal").textContent = "Standing Wave";
    });

    btnTravelling.addEventListener("click", () => {
      this.mode = "travelling";
      btnTravelling.classList.add("active");
      btnStanding.classList.remove("active");
      this.container.querySelector("#waveModeVal").textContent = "Travelling Wave";
    });

    sliderFreq.addEventListener("input", (e) => {
      this.frequency = parseFloat(e.target.value);
      this.container.querySelector("#valFreq").textContent = `${this.frequency.toFixed(1)} Hz`;
      this.updateTelemetry();
    });

    sliderAmp.addEventListener("input", (e) => {
      this.amplitude = parseFloat(e.target.value);
      this.container.querySelector("#valAmp").textContent = `${this.amplitude} px`;
    });

    btnZoomIn.addEventListener("click", () => {
      this.autoFit = false;
      this.userZoom = Math.min(2.0, this.userZoom + 0.15);
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

    btnPlayPause.addEventListener("click", () => {
      this.isPlaying = !this.isPlaying;
      btnPlayPause.textContent = this.isPlaying ? "Pause" : "Play";
    });

    btnReset.addEventListener("click", () => {
      this.time = 0;
      this.frequency = 1.5;
      this.amplitude = 35;
      this.autoFit = true;
      this.userZoom = 1.0;
      valZoomMode.textContent = "Auto-Fit (100%)";
      sliderFreq.value = 1.5;
      sliderAmp.value = 35;
      this.container.querySelector("#valFreq").textContent = "1.5 Hz";
      this.container.querySelector("#valAmp").textContent = "35 px";
      this.updateTelemetry();
    });

    this.updateTelemetry();
  }

  updateTelemetry() {
    const v = this.frequency * this.wavelength;
    const T = 1 / this.frequency;
    this.container.querySelector("#waveSpeedVal").textContent = `${v.toFixed(0)} px/s`;
    this.container.querySelector("#wavePeriodVal").textContent = `${T.toFixed(2)} s`;
  }

  initCanvas() {
    this.canvas = this.container.querySelector("#wavesCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();
    window.addEventListener("resize", () => {
      if (this.canvas) this.resizeCanvas();
    });
  }

  resizeCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvasWidth = rect.width || 600;
    this.canvasHeight = 440;
    this.canvas.width = this.canvasWidth * dpr;
    this.canvas.height = this.canvasHeight * dpr;
    this.ctx.scale(dpr, dpr);
  }

  animate() {
    if (this.isPlaying) {
      this.time += 0.016;
    }
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvasWidth;
    const h = this.canvasHeight;
    ctx.clearRect(0, 0, w, h);

    // Center optical/equilibrium axis with top clearance for telemetry overlay
    const topClearance = 70;
    const bottomClearance = 45;
    const cy = topClearance + (h - topClearance - bottomClearance) / 2;

    // Bound-safe effective amplitude:
    // Standing wave max displacement is 2A. Guarantee 2A never reaches topClearance or bottomClearance.
    const maxHalfHeight = (h - topClearance - bottomClearance) / 2;
    const maxSafeAmplitude = (maxHalfHeight - 15) / (this.mode === "standing" ? 2 : 1);
    const effectiveAmp = Math.min(this.amplitude, maxSafeAmplitude) * (this.autoFit ? 1.0 : this.userZoom);

    // Dynamic wavelength scaling based on width
    const minWavelength = 160;
    const maxWavelength = 240;
    const effectiveWavelength = Math.max(minWavelength, Math.min(maxWavelength, (w - 70) / 3));
    const k = (2 * Math.PI) / effectiveWavelength;
    const omega = 2 * Math.PI * this.frequency;

    // Equilibrium line
    ctx.strokeStyle = "rgba(41, 55, 46, 0.6)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(25, cy);
    ctx.lineTo(w - 25, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Wave
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#35D39A";
    ctx.beginPath();

    const startX = 35;
    const endX = w - 35;
    const step = 2;

    for (let x = startX; x <= endX; x += step) {
      let y;
      if (this.mode === "standing") {
        y = cy - 2 * effectiveAmp * Math.sin(k * (x - startX)) * Math.cos(omega * this.time);
      } else {
        y = cy - effectiveAmp * Math.sin(k * (x - startX) - omega * this.time);
      }

      // Clamp strictly inside boundary
      y = Math.max(topClearance - 10, Math.min(h - bottomClearance + 10, y));

      if (x === startX) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // In standing mode, draw envelope & node markers
    if (this.mode === "standing") {
      ctx.strokeStyle = "rgba(214, 184, 120, 0.25)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);

      // Upper envelope
      ctx.beginPath();
      for (let x = startX; x <= endX; x += step) {
        const envY = cy - 2 * effectiveAmp * Math.abs(Math.sin(k * (x - startX)));
        if (x === startX) ctx.moveTo(x, envY);
        else ctx.lineTo(x, envY);
      }
      ctx.stroke();

      // Lower envelope
      ctx.beginPath();
      for (let x = startX; x <= endX; x += step) {
        const envY = cy + 2 * effectiveAmp * Math.abs(Math.sin(k * (x - startX)));
        if (x === startX) ctx.moveTo(x, envY);
        else ctx.lineTo(x, envY);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Nodes on axis
      const halfLambda = effectiveWavelength / 2;
      for (let nx = startX; nx <= endX; nx += halfLambda) {
        ctx.beginPath();
        ctx.arc(nx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#D6B878";
        ctx.fill();
        ctx.font = "10px Inter, sans-serif";
        ctx.fillStyle = "#A2B0A5";
        ctx.textAlign = "center";
        ctx.fillText("Node", nx, cy + 18);
      }
    }
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}

window.WaveSimulation = WaveSimulation;
