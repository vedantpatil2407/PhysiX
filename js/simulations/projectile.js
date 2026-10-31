/**
 * PHYSIX Projectile Motion Simulation Engine
 * High-precision 2D trajectory with gravity, launch angle, velocity,
 * real-time energy conservation telemetry, and multiple celestial gravity presets.
 * Enhanced with adaptive auto-bounding scaling, live predicted guide arc,
 * and generous bottom/top viewport clearance for guaranteed zero occlusion.
 */

class ProjectileSimulation {
  constructor(container) {
    this.container = container;
    this.animationId = null;
    this.isRunning = false;
    this.isPaused = false;

    // Physics parameters
    this.angle = 45; // degrees
    this.v0 = 35; // m/s
    this.gravity = 9.8; // m/s² (Earth)
    this.mass = 1.0; // kg
    this.airResistance = false;

    // Viewport scaling and boundary adjustability
    this.userZoom = 1.0;
    this.autoFit = true;

    // State variables
    this.t = 0;
    this.dt = 0.025;
    this.posX = 0;
    this.posY = 0;
    this.vx = 0;
    this.vy = 0;
    this.path = [];
    this.traces = [];

    // Precalculated analytical values
    this.recalculateAnalytical();

    this.initDOM();
    this.initCanvas();
    this.draw();
  }

  recalculateAnalytical() {
    const rad = (this.angle * Math.PI) / 180;
    this.v0x = this.v0 * Math.cos(rad);
    this.v0y = this.v0 * Math.sin(rad);
    this.timeOfFlight = (2 * this.v0y) / this.gravity;
    this.maxHeight = (this.v0y * this.v0y) / (2 * this.gravity);
    this.maxRange = (this.v0 * this.v0 * Math.sin(2 * rad)) / this.gravity;
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="sim-engine-layout">
        <!-- Canvas Viewport -->
        <div class="sim-canvas-viewport">
          <canvas id="projectileCanvas"></canvas>
          <div class="sim-telemetry-overlay">
            <div class="telemetry-chip"><span>Time (t):</span> <strong id="projTime">0.00 s</strong></div>
            <div class="telemetry-chip"><span>Range (x):</span> <strong id="projRange">0.00 m</strong></div>
            <div class="telemetry-chip"><span>Height (y):</span> <strong id="projHeight">0.00 m</strong></div>
            <div class="telemetry-chip"><span>Velocity:</span> <strong id="projVel">${this.v0.toFixed(1)} m/s</strong></div>
          </div>
          <!-- Energy Balance Bar -->
          <div class="sim-energy-bar-wrap">
            <div class="energy-label-row">
              <span class="ke-label">KE: <strong id="projKE">${(0.5 * this.mass * this.v0 * this.v0).toFixed(0)} J</strong></span>
              <span class="pe-label">PE: <strong id="projPE">0 J</strong></span>
            </div>
            <div class="energy-meter">
              <div class="energy-ke-fill" id="projKEBar" style="width: 100%;"></div>
              <div class="energy-pe-fill" id="projPEBar" style="width: 0%;"></div>
            </div>
          </div>
        </div>

        <!-- Controls Sidebar -->
        <div class="sim-controls-panel">
          <!-- View Boundary & Zoom Control -->
          <div class="sim-control-group">
            <div class="control-header">
              <label>Boundary Scaling</label>
              <span class="control-val" id="valZoomMode">Auto-Fit (100%)</span>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary btn-sm" id="btnZoomOut" style="flex: 1;" title="Zoom Out">🔍−</button>
              <button class="btn btn-secondary btn-sm" id="btnZoomReset" style="flex: 1.4;" title="Reset to Auto-Fit">Auto-Fit</button>
              <button class="btn btn-secondary btn-sm" id="btnZoomIn" style="flex: 1;" title="Zoom In">🔍+</button>
            </div>
          </div>

          <div class="sim-control-group">
            <div class="control-header">
              <label>Launch Angle (θ)</label>
              <span class="control-val" id="valAngle">45°</span>
            </div>
            <input type="range" id="sliderAngle" min="15" max="85" step="1" value="45" class="sim-slider">
          </div>

          <div class="sim-control-group">
            <div class="control-header">
              <label>Initial Velocity (v₀)</label>
              <span class="control-val" id="valV0">35 m/s</span>
            </div>
            <input type="range" id="sliderV0" min="5" max="65" step="1" value="35" class="sim-slider">
          </div>

          <div class="sim-control-group">
            <div class="control-header">
              <label>Gravitational Field (g)</label>
              <span class="control-val" id="valGravity">9.8 m/s² (Earth)</span>
            </div>
            <select id="selectGravity" class="sim-select">
              <option value="9.8">Earth (9.8 m/s²)</option>
              <option value="1.62">Moon (1.62 m/s²)</option>
              <option value="3.71">Mars (3.71 m/s²)</option>
              <option value="24.79">Jupiter (24.79 m/s²)</option>
            </select>
          </div>

          <!-- Analytical Reference Box -->
          <div class="sim-analytical-summary">
            <div class="summary-item"><span>Theoretical Range:</span> <strong id="summaryRange">${this.maxRange.toFixed(1)} m</strong></div>
            <div class="summary-item"><span>Max Height (H):</span> <strong id="summaryHeight">${this.maxHeight.toFixed(1)} m</strong></div>
            <div class="summary-item"><span>Flight Duration:</span> <strong id="summaryTime">${this.timeOfFlight.toFixed(2)} s</strong></div>
          </div>

          <!-- Action Buttons -->
          <div class="sim-btn-group">
            <button class="btn btn-primary" id="btnLaunch">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Launch Projectile
            </button>
            <button class="btn btn-secondary" id="btnReset">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              Reset
            </button>
          </div>
        </div>
      </div>
    `;

    // Bind Controls
    const sliderAngle = this.container.querySelector("#sliderAngle");
    const sliderV0 = this.container.querySelector("#sliderV0");
    const selectGravity = this.container.querySelector("#selectGravity");
    const btnLaunch = this.container.querySelector("#btnLaunch");
    const btnReset = this.container.querySelector("#btnReset");

    const btnZoomIn = this.container.querySelector("#btnZoomIn");
    const btnZoomOut = this.container.querySelector("#btnZoomOut");
    const btnZoomReset = this.container.querySelector("#btnZoomReset");
    const valZoomMode = this.container.querySelector("#valZoomMode");

    sliderAngle.addEventListener("input", (e) => {
      this.angle = parseFloat(e.target.value);
      this.container.querySelector("#valAngle").textContent = `${this.angle}°`;
      this.onParameterChanged();
    });

    sliderV0.addEventListener("input", (e) => {
      this.v0 = parseFloat(e.target.value);
      this.container.querySelector("#valV0").textContent = `${this.v0} m/s`;
      this.onParameterChanged();
    });

    selectGravity.addEventListener("change", (e) => {
      this.gravity = parseFloat(e.target.value);
      const text = e.target.options[e.target.selectedIndex].text;
      this.container.querySelector("#valGravity").textContent = text;
      this.onParameterChanged();
    });

    btnZoomIn.addEventListener("click", () => {
      this.autoFit = false;
      this.userZoom = Math.min(2.5, this.userZoom + 0.15);
      valZoomMode.textContent = `Manual (${Math.round(this.userZoom * 100)}%)`;
      this.draw();
    });

    btnZoomOut.addEventListener("click", () => {
      this.autoFit = false;
      this.userZoom = Math.max(0.4, this.userZoom - 0.15);
      valZoomMode.textContent = `Manual (${Math.round(this.userZoom * 100)}%)`;
      this.draw();
    });

    btnZoomReset.addEventListener("click", () => {
      this.autoFit = true;
      this.userZoom = 1.0;
      valZoomMode.textContent = "Auto-Fit (100%)";
      this.draw();
    });

    btnLaunch.addEventListener("click", () => this.launch());
    btnReset.addEventListener("click", () => this.reset());
  }

  /**
   * Called whenever velocity, angle, or gravity changes.
   * Resets flight progress cleanly and triggers real-time dynamic scaling & redraw.
   */
  onParameterChanged() {
    if (this.isRunning) {
      this.isRunning = false;
      if (this.animationId) cancelAnimationFrame(this.animationId);
    }
    this.t = 0;
    this.posX = 0;
    this.posY = 0;
    this.path = [];
    this.recalculateAnalytical();
    this.updateSummaryDOM();
    this.updateTelemetryDOM(0, 0, 0, this.v0);
    this.draw();
  }

  initCanvas() {
    this.canvas = this.container.querySelector("#projectileCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();
    window.addEventListener("resize", () => {
      if (this.canvas) {
        this.resizeCanvas();
        this.draw();
      }
    });
  }

  resizeCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvasWidth = Math.round(rect.width) || 600;
    this.canvasHeight = Math.round(rect.height) || 440;
    if (this.canvasHeight < 400) this.canvasHeight = 440;
    this.canvas.width = this.canvasWidth * dpr;
    this.canvas.height = this.canvasHeight * dpr;

    if (this.ctx.resetTransform) {
      this.ctx.resetTransform();
    } else {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    this.ctx.scale(dpr, dpr);
  }

  updateSummaryDOM() {
    this.container.querySelector("#summaryRange").textContent = `${this.maxRange.toFixed(1)} m`;
    this.container.querySelector("#summaryHeight").textContent = `${this.maxHeight.toFixed(1)} m`;
    this.container.querySelector("#summaryTime").textContent = `${this.timeOfFlight.toFixed(2)} s`;
  }

  launch() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.t = 0;
    this.posX = 0;
    this.posY = 0;
    this.path = [];
    this.recalculateAnalytical();
    this.animate();
  }

  reset() {
    this.isRunning = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.t = 0;
    this.posX = 0;
    this.posY = 0;
    this.path = [];
    this.traces = [];
    this.updateTelemetryDOM(0, 0, 0, this.v0);
    this.draw();
  }

  animate() {
    if (!this.isRunning) return;

    this.t += this.dt;
    this.posX = this.v0x * this.t;
    this.posY = Math.max(0, this.v0y * this.t - 0.5 * this.gravity * this.t * this.t);
    this.vx = this.v0x;
    this.vy = this.v0y - this.gravity * this.t;
    const curSpeed = Math.hypot(this.vx, this.vy);

    // Landing detection
    if (this.t >= this.timeOfFlight || (this.t > 0.05 && this.posY <= 0.001)) {
      this.posX = this.maxRange;
      this.posY = 0;
      this.path.push({ x: this.posX, y: 0 });
      this.isRunning = false;
      this.traces.push([...this.path]);
      this.updateTelemetryDOM(this.timeOfFlight, this.posX, 0, this.v0);
      this.draw();
      return;
    }

    this.path.push({ x: this.posX, y: this.posY });
    this.updateTelemetryDOM(this.t, this.posX, this.posY, curSpeed);
    this.draw();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  updateTelemetryDOM(t, x, y, v) {
    this.container.querySelector("#projTime").textContent = `${t.toFixed(2)} s`;
    this.container.querySelector("#projRange").textContent = `${x.toFixed(1)} m`;
    this.container.querySelector("#projHeight").textContent = `${Math.max(0, y).toFixed(1)} m`;
    this.container.querySelector("#projVel").textContent = `${v.toFixed(1)} m/s`;

    // Energy calculation
    const ke = 0.5 * this.mass * v * v;
    const pe = Math.max(0, this.mass * this.gravity * y);
    const totalE = ke + pe || 1;

    this.container.querySelector("#projKE").textContent = `${ke.toFixed(0)} J`;
    this.container.querySelector("#projPE").textContent = `${pe.toFixed(0)} J`;

    const kePct = Math.min(100, Math.max(0, (ke / totalE) * 100));
    const pePct = 100 - kePct;
    this.container.querySelector("#projKEBar").style.width = `${kePct}%`;
    this.container.querySelector("#projPEBar").style.width = `${pePct}%`;
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvasWidth;
    const h = this.canvasHeight;
    ctx.clearRect(0, 0, w, h);

    // Clearances to ensure 100% visible bottom and zero clipping at top:
    // Top clearance: 75px (protects top floating telemetry chips)
    // Bottom clearance: 100px (guarantees ground, cannon, labels, and impact point are 100% above energy bar)
    // Left clearance: 60px (protects cannon base and y-axis labels)
    // Right clearance: 50px (protects landing marker and x-axis extent)
    const topClearance = 75;
    const bottomClearance = 100;
    const leftClearance = 60;
    const rightClearance = 50;

    const usableW = Math.max(160, w - leftClearance - rightClearance);
    const usableH = Math.max(120, h - topClearance - bottomClearance);

    // Dynamic auto-scale that adapts fluidly when velocity is decreased or increased:
    // For small velocities (e.g. 5 or 10 m/s), autoScale zooms IN so the trajectory fills the canvas.
    // For large velocities (e.g. 60 m/s on Earth/Moon), autoScale zooms OUT so nothing clips.
    const targetW = Math.max(this.maxRange * 1.15, 2.0);
    const targetH = Math.max(this.maxHeight * 1.3, 1.0);
    const scaleX = usableW / targetW;
    const scaleY = usableH / targetH;
    const autoScale = Math.min(scaleX, scaleY);
    const scale = this.autoFit ? autoScale : autoScale * this.userZoom;

    const originX = leftClearance;
    const originY = h - bottomClearance;

    // 1. Determine optimal adaptive grid step based on current scale extent
    const maxExtent = Math.max(this.maxRange, this.maxHeight);
    let gridStep = 10;
    if (maxExtent > 1000) gridStep = 500;
    else if (maxExtent > 400) gridStep = 200;
    else if (maxExtent > 200) gridStep = 100;
    else if (maxExtent > 80) gridStep = 50;
    else if (maxExtent > 40) gridStep = 20;
    else if (maxExtent > 20) gridStep = 10;
    else if (maxExtent > 8) gridStep = 5;
    else if (maxExtent > 3) gridStep = 2;
    else gridStep = 1;

    // Draw vertical distance grid lines & labels
    ctx.strokeStyle = "rgba(41, 55, 46, 0.45)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    for (let d = gridStep; d * scale < w - rightClearance; d += gridStep) {
      const gx = originX + d * scale;
      ctx.beginPath();
      ctx.moveTo(gx, topClearance - 15);
      ctx.lineTo(gx, originY);
      ctx.stroke();

      // Distance coordinate labels - placed safely above the energy bar
      ctx.fillStyle = "#8E9F94";
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${d}m`, gx, originY + 18);
    }

    // Draw horizontal height grid lines & labels
    for (let dy = gridStep; dy * scale < usableH + 20; dy += gridStep) {
      const gy = originY - dy * scale;
      if (gy < topClearance - 10) break;
      ctx.beginPath();
      ctx.moveTo(originX, gy);
      ctx.lineTo(w - rightClearance + 20, gy);
      ctx.stroke();

      ctx.fillStyle = "#8E9F94";
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`${dy}m`, originX - 10, gy + 4);
    }
    ctx.setLineDash([]);
    ctx.textAlign = "left";

    // 2. Draw Ground Strip & Solid Baseline (100% visible above energy bar)
    // Ground bedrock gradient band
    const groundGrad = ctx.createLinearGradient(0, originY, 0, originY + 24);
    groundGrad.addColorStop(0, "rgba(53, 211, 154, 0.15)");
    groundGrad.addColorStop(1, "rgba(22, 33, 27, 0.4)");
    ctx.fillStyle = groundGrad;
    ctx.fillRect(15, originY, w - 30, 24);

    // Solid ground line
    ctx.beginPath();
    ctx.moveTo(15, originY);
    ctx.lineTo(w - 15, originY);
    ctx.strokeStyle = "#35D39A";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Ground hash pattern for realistic tactile ground surface
    ctx.strokeStyle = "rgba(53, 211, 154, 0.35)";
    ctx.lineWidth = 1;
    for (let hx = 25; hx < w - 25; hx += 16) {
      ctx.beginPath();
      ctx.moveTo(hx, originY);
      ctx.lineTo(hx - 6, originY + 8);
      ctx.stroke();
    }

    // 3. Draw Cannon & Launch Base
    const rad = (this.angle * Math.PI) / 180;
    const cannonLen = 28;
    const barrelEndX = originX + cannonLen * Math.cos(rad);
    const barrelEndY = originY - cannonLen * Math.sin(rad);

    // Cannon mounting carriage / legs
    ctx.fillStyle = "#1E2B23";
    ctx.beginPath();
    ctx.moveTo(originX - 14, originY);
    ctx.lineTo(originX, originY - 6);
    ctx.lineTo(originX + 14, originY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#2E4236";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Cannon barrel
    ctx.strokeStyle = "#35D39A";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(barrelEndX, barrelEndY);
    ctx.stroke();

    // Cannon pivot hub
    ctx.beginPath();
    ctx.arc(originX, originY, 9, 0, Math.PI * 2);
    ctx.fillStyle = "#121C16";
    ctx.fill();
    ctx.strokeStyle = "#35D39A";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 4. Draw Predicted Trajectory Guide Arc (Real-Time Live Preview)
    // Shows the exact arc that changes size dynamically as velocity/angle changes
    ctx.beginPath();
    ctx.strokeStyle = "rgba(53, 211, 154, 0.45)";
    ctx.lineWidth = 1.8;
    ctx.setLineDash([5, 5]);

    const numPreviewSteps = 80;
    for (let i = 0; i <= numPreviewSteps; i++) {
      const simT = (this.timeOfFlight * i) / numPreviewSteps;
      const px = this.v0x * simT;
      const py = Math.max(0, this.v0y * simT - 0.5 * this.gravity * simT * simT);
      const cx = originX + px * scale;
      const cy = originY - py * scale;
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Predicted Landing Marker Flag
    const predLandingX = originX + this.maxRange * scale;
    ctx.beginPath();
    ctx.arc(predLandingX, originY, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#D6B878";
    ctx.fill();

    // Apex Marker (Max Height)
    const apexX = originX + (this.maxRange / 2) * scale;
    const apexY = originY - this.maxHeight * scale;
    ctx.beginPath();
    ctx.arc(apexX, apexY, 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(214, 184, 120, 0.8)";
    ctx.fill();

    // 5. Draw Previous Ghost Traces
    this.traces.forEach((tr) => {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(162, 176, 165, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 4]);
      tr.forEach((pt, i) => {
        const cx = originX + pt.x * scale;
        const cy = originY - pt.y * scale;
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      });
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // 6. Draw Active Flight Path
    if (this.path.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = "#35D39A";
      ctx.lineWidth = 3;
      this.path.forEach((pt, i) => {
        const cx = originX + pt.x * scale;
        const cy = originY - pt.y * scale;
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      });
      ctx.stroke();
    }

    // 7. Draw Projectile Ball
    let ballX = originX;
    let ballY = originY;

    if (this.isRunning || this.path.length > 0) {
      ballX = originX + this.posX * scale;
      ballY = originY - this.posY * scale;
    } else {
      // Resting ready in cannon barrel tip before launch
      ballX = barrelEndX;
      ballY = barrelEndY;
    }

    ctx.beginPath();
    ctx.arc(ballX, ballY, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#D6B878";
    ctx.shadowColor = "#D6B878";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}

window.ProjectileSimulation = ProjectileSimulation;
