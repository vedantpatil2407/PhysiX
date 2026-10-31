/**
 * PHYSIX DC Electric Circuits Simulation
 * Interactive circuit with Ohm's Law, power dissipation, animated electron drift,
 * adjustable EMF, and variable load resistance.
 * Enhanced with auto-bounding scale and user-adjustable zoom to guarantee zero boundary clipping.
 */

class CircuitSimulation {
  constructor(container) {
    this.container = container;
    this.voltage = 12; // Volts
    this.resistance = 6; // Ohms
    this.animationId = null;
    this.electronProgress = [];

    // Viewport scaling and boundary adjustability
    this.userZoom = 1.0;
    this.autoFit = true;

    // Initialize 24 electrons distributed around loop
    for (let i = 0; i < 24; i++) {
      this.electronProgress.push(i / 24);
    }

    this.initDOM();
    this.initCanvas();
    this.animate();
  }

  calculateCircuit() {
    const I = this.voltage / this.resistance;
    const P = this.voltage * I;
    return { I, P };
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="sim-engine-layout">
        <div class="sim-canvas-viewport">
          <canvas id="circuitsCanvas"></canvas>
          <div class="sim-telemetry-overlay">
            <div class="telemetry-chip"><span>Current (I):</span> <strong id="circCurrent">2.00 A</strong></div>
            <div class="telemetry-chip"><span>Power (P):</span> <strong id="circPower">24.0 W</strong></div>
            <div class="telemetry-chip"><span>Ohm's Law:</span> <strong>I = V / R</strong></div>
          </div>
        </div>

        <div class="sim-controls-panel">
          <!-- View Boundary & Zoom Control -->
          <div class="sim-control-group">
            <div class="control-header">
              <label>Boundary Scaling</label>
              <span class="control-val" id="valZoomModeCircuits">Auto-Fit (100%)</span>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary btn-sm" id="btnZoomOutCircuits" style="flex: 1;" title="Zoom Out">🔍−</button>
              <button class="btn btn-secondary btn-sm" id="btnZoomResetCircuits" style="flex: 1.4;" title="Reset to Auto-Fit">Auto-Fit</button>
              <button class="btn btn-secondary btn-sm" id="btnZoomInCircuits" style="flex: 1;" title="Zoom In">🔍+</button>
            </div>
          </div>

          <div class="sim-control-group">
            <div class="control-header">
              <label>DC Battery Voltage (V)</label>
              <span class="control-val" id="valVolt">12 V</span>
            </div>
            <input type="range" id="sliderVolt" min="2" max="24" step="1" value="12" class="sim-slider">
          </div>

          <div class="sim-control-group">
            <div class="control-header">
              <label>Load Resistance (R)</label>
              <span class="control-val" id="valRes">6 Ω</span>
            </div>
            <input type="range" id="sliderRes" min="2" max="40" step="1" value="6" class="sim-slider">
          </div>

          <div class="sim-analytical-summary">
            <div class="summary-item"><span>Current Flow:</span> <strong id="circSpeed">Fast Drift</strong></div>
            <div class="summary-item"><span>Bulb Brightness:</span> <strong id="bulbBrightness">Normal (24 W)</strong></div>
          </div>

          <div class="sim-btn-group">
            <button class="btn btn-secondary" id="btnResetCircuits" style="width: 100%;">Reset Circuit</button>
          </div>
        </div>
      </div>
    `;

    const sliderVolt = this.container.querySelector("#sliderVolt");
    const sliderRes = this.container.querySelector("#sliderRes");
    const btnReset = this.container.querySelector("#btnResetCircuits");

    const btnZoomIn = this.container.querySelector("#btnZoomInCircuits");
    const btnZoomOut = this.container.querySelector("#btnZoomOutCircuits");
    const btnZoomReset = this.container.querySelector("#btnZoomResetCircuits");
    const valZoomMode = this.container.querySelector("#valZoomModeCircuits");

    sliderVolt.addEventListener("input", (e) => {
      this.voltage = parseFloat(e.target.value);
      this.container.querySelector("#valVolt").textContent = `${this.voltage} V`;
      this.updateTelemetry();
    });

    sliderRes.addEventListener("input", (e) => {
      this.resistance = parseFloat(e.target.value);
      this.container.querySelector("#valRes").textContent = `${this.resistance} Ω`;
      this.updateTelemetry();
    });

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

    btnReset.addEventListener("click", () => {
      this.voltage = 12;
      this.resistance = 6;
      this.autoFit = true;
      this.userZoom = 1.0;
      valZoomMode.textContent = "Auto-Fit (100%)";
      sliderVolt.value = 12;
      sliderRes.value = 6;
      this.container.querySelector("#valVolt").textContent = "12 V";
      this.container.querySelector("#valRes").textContent = "6 Ω";
      this.updateTelemetry();
    });

    this.updateTelemetry();
  }

  updateTelemetry() {
    const { I, P } = this.calculateCircuit();
    this.container.querySelector("#circCurrent").textContent = `${I.toFixed(2)} A`;
    this.container.querySelector("#circPower").textContent = `${P.toFixed(1)} W`;

    const speedDesc = I > 3 ? "Very Rapid Drift" : I > 1.5 ? "Moderate Drift" : "Slow Drift";
    this.container.querySelector("#circSpeed").textContent = speedDesc;

    const brightDesc = P > 45 ? "Blinding (High Load)" : P > 15 ? "Normal Glow" : "Dim Filament";
    this.container.querySelector("#bulbBrightness").textContent = brightDesc;
  }

  initCanvas() {
    this.canvas = this.container.querySelector("#circuitsCanvas");
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
    const { I } = this.calculateCircuit();
    // Drift speed proportional to current I
    const speed = (I / 4) * 0.0035 + 0.0005;

    for (let i = 0; i < this.electronProgress.length; i++) {
      this.electronProgress[i] = (this.electronProgress[i] + speed) % 1;
    }

    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  getLoopPoint(progress, x, y, w, h) {
    const perimeter = 2 * (w + h);
    const dist = progress * perimeter;

    if (dist <= w) {
      // Top branch: left to right
      return { x: x + dist, y: y };
    } else if (dist <= w + h) {
      // Right branch: top to bottom
      return { x: x + w, y: y + (dist - w) };
    } else if (dist <= 2 * w + h) {
      // Bottom branch: right to left
      return { x: x + w - (dist - (w + h)), y: y + h };
    } else {
      // Left branch: bottom to top
      return { x: x, y: y + h - (dist - (2 * w + h)) };
    }
  }

  draw() {
    const ctx = this.ctx;
    const cw = this.canvasWidth;
    const ch = this.canvasHeight;
    ctx.clearRect(0, 0, cw, ch);

    const { I, P } = this.calculateCircuit();

    // Bound-safe dynamic centering:
    // Left clearance: 85px (for battery plates, polarity, and "12V Battery" text)
    // Right clearance: 95px (for bulb, glow halo, and "24W Load" text)
    // Top clearance: 70px (for top telemetry overlay chips & resistor label)
    // Bottom clearance: 35px
    const leftClearance = 85;
    const rightClearance = 95;
    const topClearance = 70;
    const bottomClearance = 35;

    const availW = Math.max(180, cw - leftClearance - rightClearance);
    const availH = Math.max(140, ch - topClearance - bottomClearance);

    const baseLoopW = Math.min(460, availW);
    const baseLoopH = Math.min(220, availH);

    const zoom = this.autoFit ? 1.0 : this.userZoom;
    const loopW = baseLoopW * zoom;
    const loopH = baseLoopH * zoom;

    const loopX = leftClearance + (availW - loopW) / 2;
    const loopY = topClearance + (availH - loopH) / 2;

    // 1. Draw Conducting Copper/Emerald Wires
    ctx.strokeStyle = "#29372E";
    ctx.lineWidth = 4;
    ctx.strokeRect(loopX, loopY, loopW, loopH);

    // 2. Battery (Left Branch)
    const batY = loopY + loopH / 2;
    ctx.clearRect(loopX - 6, batY - 30, 12, 60);

    // Battery plates
    ctx.strokeStyle = "#D6B878";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(loopX - 18, batY - 14);
    ctx.lineTo(loopX + 18, batY - 14);
    ctx.stroke();

    ctx.strokeStyle = "#A2B0A5";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(loopX - 10, batY + 14);
    ctx.lineTo(loopX + 10, batY + 14);
    ctx.stroke();

    ctx.fillStyle = "#D6B878";
    ctx.font = "bold 13px Inter, sans-serif";
    ctx.fillText("+", loopX - 28, batY - 10);
    ctx.fillStyle = "#A2B0A5";
    ctx.fillText("−", loopX - 26, batY + 18);

    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "right";
    ctx.fillText(`${this.voltage}V Battery`, loopX - 32, batY + 4);

    // 3. Resistor & Lamp (Top Branch)
    const resX = loopX + loopW / 2;
    ctx.clearRect(resX - 45, loopY - 14, 90, 28);

    // Resistor Zigzag
    ctx.strokeStyle = "#35D39A";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(resX - 40, loopY);
    ctx.lineTo(resX - 30, loopY - 12);
    ctx.lineTo(resX - 10, loopY + 12);
    ctx.lineTo(resX + 10, loopY - 12);
    ctx.lineTo(resX + 30, loopY + 12);
    ctx.lineTo(resX + 40, loopY);
    ctx.stroke();

    ctx.fillStyle = "#35D39A";
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`R = ${this.resistance} Ω`, resX, loopY - 18);

    // 4. Light Bulb in Right Branch with Glowing Halo
    const bulbY = loopY + loopH / 2;
    const bulbX = loopX + loopW;
    ctx.clearRect(bulbX - 8, bulbY - 25, 16, 50);

    // Glow halo based on power P (clamped so glow never shoots out of canvas)
    const maxGlow = Math.min(50, rightClearance - 35);
    const glowRadius = Math.min(maxGlow, 14 + P * 0.45);
    const grad = ctx.createRadialGradient(bulbX, bulbY, 5, bulbX, bulbY, glowRadius);
    grad.addColorStop(0, "rgba(214, 184, 120, 0.8)");
    grad.addColorStop(0.5, "rgba(214, 184, 120, 0.25)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.beginPath();
    ctx.arc(bulbX, bulbY, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Bulb glass circle
    ctx.beginPath();
    ctx.arc(bulbX, bulbY, 15, 0, Math.PI * 2);
    ctx.fillStyle = "#16211B";
    ctx.strokeStyle = "#D6B878";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    // Bulb filament cross
    ctx.strokeStyle = "#D6B878";
    ctx.beginPath();
    ctx.moveTo(bulbX - 5, bulbY - 5);
    ctx.lineTo(bulbX + 5, bulbY + 5);
    ctx.moveTo(bulbX + 5, bulbY - 5);
    ctx.lineTo(bulbX - 5, bulbY + 5);
    ctx.stroke();

    ctx.fillStyle = "#F3F2EC";
    ctx.font = "11px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${P.toFixed(0)}W Load`, bulbX + 22, bulbY + 4);

    // 5. Animated Drifting Electrons
    ctx.fillStyle = "#35D39A";
    this.electronProgress.forEach((p) => {
      const pt = this.getLoopPoint(p, loopX, loopY, loopW, loopH);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}

window.CircuitSimulation = CircuitSimulation;
