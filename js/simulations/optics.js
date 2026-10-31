/**
 * PHYSIX Ray Optics Simulation Engine
 * Interactive Thin Lens Geometrical Ray Tracing (Convex & Concave Lenses).
 * Features:
 * - Robust Auto-Fit bounding engine that prevents diagram collapse at extreme focal points
 * - Interactive Cursor-Centered Zoom (mouse wheel & pinch-to-zoom at any point)
 * - Free Click & Drag Panning across the entire optical bench
 * - High-contrast notation badges for Optical Center (O), Focal Points (F1, 2F1, F2, 2F2),
 *   Object arrow (u, h), Image arrow (v, hI, m), and directional ray propagation arrows.
 */

class OpticsSimulation {
  constructor(container) {
    this.container = container;
    this.lensType = "convex"; // "convex" or "concave"
    this.focalLength = 41; // cm (|f|)
    this.objectDistance = -50; // cm (Cartesian sign convention: negative)
    this.objectHeight = 25; // cm

    // Interactive Viewport Navigation (Zoom & Pan)
    this.userZoom = 1.0;
    this.autoFit = true;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.touchStartDist = 0;
    this.touchStartZoom = 1.0;

    this.initDOM();
    this.initCanvas();
    this.draw();
  }

  calculateImage() {
    const isConvex = this.lensType === "convex";
    const f = isConvex ? Math.abs(this.focalLength) : -Math.abs(this.focalLength);
    const u = -Math.abs(this.objectDistance); // Cartesian sign: object is always on left
    const hO = this.objectHeight;

    // Thin lens formula: 1/v - 1/u = 1/f => 1/v = 1/f + 1/u = (u + f) / (u * f)
    // v = (u * f) / (u + f)
    const denom = u + f;
    let v, m, hI, isVirtual, isInfinity = false;

    if (Math.abs(denom) < 0.25) {
      isInfinity = true;
      v = (denom >= 0 ? 1 : -1) * 99999;
      m = (denom >= 0 ? 1 : -1) * 999;
      hI = m * hO;
      isVirtual = false;
    } else {
      v = (u * f) / denom;
      m = v / u;
      hI = m * hO;
      isVirtual = v < 0;
    }

    return { f, u, v, m, hO, hI, isVirtual, isInfinity };
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="sim-engine-layout">
        <!-- Canvas Viewport -->
        <div class="sim-canvas-viewport">
          <canvas id="opticsCanvas" style="cursor: grab;"></canvas>
          <div class="sim-telemetry-overlay">
            <div class="telemetry-chip"><span>Image Dist (v):</span> <strong id="opticsV">+75.0 cm</strong></div>
            <div class="telemetry-chip"><span>Magnification:</span> <strong id="opticsM">-1.50×</strong></div>
            <div class="telemetry-chip"><span>Image Nature:</span> <strong id="opticsNature">Real & Inverted</strong></div>
          </div>
          <div class="sim-canvas-hint">
            <span>🔍 Scroll to Zoom • ✋ Drag to Pan • Double-Click to Reset</span>
          </div>
        </div>

        <!-- Controls Sidebar -->
        <div class="sim-controls-panel">
          <!-- View Boundary & Zoom Control -->
          <div class="sim-control-group">
            <div class="control-header">
              <label>Boundary Scaling</label>
              <span class="control-val" id="valZoomModeOptics">Auto-Fit (100%)</span>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary btn-sm" id="btnZoomOutOptics" style="flex: 1;" title="Zoom Out">🔍−</button>
              <button class="btn btn-secondary btn-sm" id="btnZoomResetOptics" style="flex: 1.4;" title="Reset to Auto-Fit">Auto-Fit</button>
              <button class="btn btn-secondary btn-sm" id="btnZoomInOptics" style="flex: 1;" title="Zoom In">🔍+</button>
            </div>
          </div>

          <div class="sim-control-group">
            <label>Lens Type</label>
            <div class="sim-pill-toggle">
              <button class="pill-toggle-btn active" id="btnConvex">Convex (Converging)</button>
              <button class="pill-toggle-btn" id="btnConcave">Concave (Diverging)</button>
            </div>
          </div>

          <div class="sim-control-group">
            <div class="control-header">
              <label>Focal Length (|f|)</label>
              <span class="control-val" id="valFocal">${this.focalLength} cm</span>
            </div>
            <input type="range" id="sliderFocal" min="15" max="50" step="1" value="${this.focalLength}" class="sim-slider">
          </div>

          <div class="sim-control-group">
            <div class="control-header">
              <label>Object Distance (|u|)</label>
              <span class="control-val" id="valDist">${Math.abs(this.objectDistance)} cm</span>
            </div>
            <input type="range" id="sliderDist" min="15" max="90" step="1" value="${Math.abs(this.objectDistance)}" class="sim-slider">
          </div>

          <div class="sim-control-group">
            <div class="control-header">
              <label>Object Height (h)</label>
              <span class="control-val" id="valHeight">${this.objectHeight} cm</span>
            </div>
            <input type="range" id="sliderHeight" min="10" max="40" step="1" value="${this.objectHeight}" class="sim-slider">
          </div>

          <!-- Formula Info Box -->
          <div class="sim-analytical-summary">
            <div class="summary-item"><span>Lens Formula:</span> <strong>1/v - 1/u = 1/f</strong></div>
            <div class="summary-item"><span>Linear Magnification:</span> <strong>m = v/u = hᵢ/hₒ</strong></div>
          </div>

          <div class="sim-btn-group">
            <button class="btn btn-secondary" id="btnResetOptics" style="width: 100%;">
              Reset Optical Bench
            </button>
          </div>
        </div>
      </div>
    `;

    // Bind UI Controls
    const btnConvex = this.container.querySelector("#btnConvex");
    const btnConcave = this.container.querySelector("#btnConcave");
    const sliderFocal = this.container.querySelector("#sliderFocal");
    const sliderDist = this.container.querySelector("#sliderDist");
    const sliderHeight = this.container.querySelector("#sliderHeight");
    const btnReset = this.container.querySelector("#btnResetOptics");

    const btnZoomIn = this.container.querySelector("#btnZoomInOptics");
    const btnZoomOut = this.container.querySelector("#btnZoomOutOptics");
    const btnZoomReset = this.container.querySelector("#btnZoomResetOptics");
    const valZoomMode = this.container.querySelector("#valZoomModeOptics");

    btnConvex.addEventListener("click", () => {
      this.lensType = "convex";
      btnConvex.classList.add("active");
      btnConcave.classList.remove("active");
      this.draw();
    });

    btnConcave.addEventListener("click", () => {
      this.lensType = "concave";
      btnConcave.classList.add("active");
      btnConvex.classList.remove("active");
      this.draw();
    });

    sliderFocal.addEventListener("input", (e) => {
      this.focalLength = parseFloat(e.target.value);
      this.container.querySelector("#valFocal").textContent = `${this.focalLength} cm`;
      this.draw();
    });

    sliderDist.addEventListener("input", (e) => {
      this.objectDistance = -parseFloat(e.target.value);
      this.container.querySelector("#valDist").textContent = `${Math.abs(this.objectDistance)} cm`;
      this.draw();
    });

    sliderHeight.addEventListener("input", (e) => {
      this.objectHeight = parseFloat(e.target.value);
      this.container.querySelector("#valHeight").textContent = `${this.objectHeight} cm`;
      this.draw();
    });

    btnZoomIn.addEventListener("click", () => {
      this.autoFit = false;
      this.userZoom = Math.min(4.0, this.userZoom * 1.15);
      valZoomMode.textContent = `Manual (${Math.round(this.userZoom * 100)}%)`;
      this.draw();
    });

    btnZoomOut.addEventListener("click", () => {
      this.autoFit = false;
      this.userZoom = Math.max(0.2, this.userZoom * 0.85);
      valZoomMode.textContent = `Manual (${Math.round(this.userZoom * 100)}%)`;
      this.draw();
    });

    btnZoomReset.addEventListener("click", () => {
      this.resetView();
    });

    btnReset.addEventListener("click", () => {
      this.lensType = "convex";
      this.focalLength = 30;
      this.objectDistance = -50;
      this.objectHeight = 25;
      sliderFocal.value = 30;
      sliderDist.value = 50;
      sliderHeight.value = 25;
      this.container.querySelector("#valFocal").textContent = "30 cm";
      this.container.querySelector("#valDist").textContent = "50 cm";
      this.container.querySelector("#valHeight").textContent = "25 cm";
      btnConvex.classList.add("active");
      btnConcave.classList.remove("active");
      this.resetView();
    });
  }

  resetView() {
    this.autoFit = true;
    this.userZoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    const valZoomMode = this.container.querySelector("#valZoomModeOptics");
    if (valZoomMode) valZoomMode.textContent = "Auto-Fit (100%)";
    this.draw();
  }

  initCanvas() {
    this.canvas = this.container.querySelector("#opticsCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();

    // Window resize
    window.addEventListener("resize", () => {
      if (this.canvas) {
        this.resizeCanvas();
        this.draw();
      }
    });

    // 1. Mouse Wheel Zoom centered at cursor point
    this.canvas.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const factor = e.deltaY < 0 ? 1.12 : 0.89;
        const oldZoom = this.userZoom;
        const newZoom = Math.max(0.2, Math.min(5.0, oldZoom * factor));

        // Adjust pan offsets so world point under cursor remains pinned to (mx, my)
        this.panX = mx - (mx - this.panX) * (newZoom / oldZoom);
        this.panY = my - (my - this.panY) * (newZoom / oldZoom);
        this.userZoom = newZoom;
        this.autoFit = false;

        const valZoomMode = this.container.querySelector("#valZoomModeOptics");
        if (valZoomMode) valZoomMode.textContent = `Manual (${Math.round(this.userZoom * 100)}%)`;

        this.draw();
      },
      { passive: false }
    );

    // 2. Click and Drag Panning
    this.canvas.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.dragStartX = e.clientX - this.panX;
      this.dragStartY = e.clientY - this.panY;
      this.canvas.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      this.panX = e.clientX - this.dragStartX;
      this.panY = e.clientY - this.dragStartY;
      this.autoFit = false;
      const valZoomMode = this.container.querySelector("#valZoomModeOptics");
      if (valZoomMode) valZoomMode.textContent = `Manual (${Math.round(this.userZoom * 100)}%)`;
      this.draw();
    });

    window.addEventListener("mouseup", () => {
      if (this.isDragging) {
        this.isDragging = false;
        if (this.canvas) this.canvas.style.cursor = "grab";
      }
    });

    // 3. Double-click to reset to Auto-Fit
    this.canvas.addEventListener("dblclick", () => {
      this.resetView();
    });

    // 4. Touch support (1-finger pan, 2-finger pinch zoom)
    this.canvas.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 1) {
          this.isDragging = true;
          this.dragStartX = e.touches[0].clientX - this.panX;
          this.dragStartY = e.touches[0].clientY - this.panY;
        } else if (e.touches.length === 2) {
          this.isDragging = false;
          this.touchStartDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          this.touchStartZoom = this.userZoom;
        }
      },
      { passive: true }
    );

    this.canvas.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length === 1 && this.isDragging) {
          this.panX = e.touches[0].clientX - this.dragStartX;
          this.panY = e.touches[0].clientY - this.dragStartY;
          this.autoFit = false;
          this.draw();
        } else if (e.touches.length === 2 && this.touchStartDist > 0) {
          const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          const ratio = dist / this.touchStartDist;
          this.userZoom = Math.max(0.2, Math.min(5.0, this.touchStartZoom * ratio));
          this.autoFit = false;
          this.draw();
        }
      },
      { passive: true }
    );

    this.canvas.addEventListener(
      "touchend",
      () => {
        this.isDragging = false;
        this.touchStartDist = 0;
      },
      { passive: true }
    );
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

  draw() {
    const ctx = this.ctx;
    const w = this.canvasWidth;
    const h = this.canvasHeight;
    ctx.clearRect(0, 0, w, h);

    const info = this.calculateImage();
    const { f, u, v, m, hO, hI, isVirtual, isInfinity } = info;
    const absF = Math.abs(f);

    // 1. Update Telemetry Overlay
    const vEl = this.container.querySelector("#opticsV");
    const mEl = this.container.querySelector("#opticsM");
    const natureEl = this.container.querySelector("#opticsNature");

    if (isInfinity) {
      vEl.textContent = "±∞ (At Infinity)";
      mEl.textContent = "Infinitely Magnified";
      natureEl.textContent = "Parallel Rays";
    } else {
      vEl.textContent = `${v > 0 ? "+" : ""}${v.toFixed(1)} cm`;
      mEl.textContent = `${m.toFixed(2)}×`;
      natureEl.textContent = isVirtual ? "Virtual & Erect" : "Real & Inverted";
    }

    // 2. Viewport Clearances & Safe Boundaries
    const topClearance = 75;
    const bottomClearance = 60;
    const leftClearance = 45;
    const rightClearance = 45;

    const usableW = Math.max(200, w - leftClearance - rightClearance);
    const usableH = Math.max(160, h - topClearance - bottomClearance);

    // Auto-Fit World Envelope Calculation (in cm)
    // Always encompass optical center O (0), focal points (-2F to +2F), and object (u)
    let autoMinX = Math.min(u, -2 * absF);
    let autoMaxX = Math.max(2 * absF, 15);

    if (!isInfinity) {
      if (isVirtual) {
        // For virtual image on left: encompass v if within reasonable range (<= 200cm)
        // If v is extreme (-659cm), clamp envelope to -180cm so the active apparatus stays crisp and readable
        const cappedV = Math.max(-200, v);
        autoMinX = Math.min(autoMinX, cappedV);
      } else {
        // For real image on right: encompass v if within reasonable range (<= 220cm)
        const cappedV = Math.min(220, v);
        autoMaxX = Math.max(autoMaxX, cappedV);
      }
    }

    // Add safe horizontal padding (18%)
    const spanLeft = Math.min(-20, autoMinX * 1.18);
    const spanRight = Math.max(20, autoMaxX * 1.18);
    const totalSpanX = spanRight - spanLeft;

    // Vertical extents in world space (cm)
    // Anchor object height hO, and clamp virtual/real image height to a safe aesthetic limit (<= 95cm)
    let autoMinY = 0;
    let autoMaxY = hO;

    if (!isInfinity) {
      if (hI < 0) {
        autoMinY = Math.min(autoMinY, Math.max(-95, hI));
      } else {
        autoMaxY = Math.max(autoMaxY, Math.min(95, hI));
      }
    }

    const spanBottom = Math.min(-18, autoMinY * 1.22);
    const spanTop = Math.max(18, autoMaxY * 1.22);
    const totalSpanY = spanTop - spanBottom;

    // Optimal base auto-scale
    const baseScaleX = usableW / totalSpanX;
    const baseScaleY = usableH / totalSpanY;
    const baseScale = Math.min(baseScaleX, baseScaleY);
    const scale = baseScale * this.userZoom;

    // Optical Center Base Anchors:
    // cx: lens positioned comfortably to give room to the image side
    let baseCx = w * 0.48;
    if (isVirtual && v < -150) {
      baseCx = w * 0.62; // Shift lens right to allocate left space to rays/image
    } else if (!isVirtual && v > 150) {
      baseCx = w * 0.38; // Shift lens left to allocate right space to real image
    }

    // cy: optical axis kept comfortably centered in the canvas
    const baseCy = Math.round(topClearance + usableH * 0.52);

    // Coordinate Conversion Functions with Pan & Zoom support
    const toScreenX = (xCm) => baseCx + this.panX + xCm * scale;
    const toScreenY = (yCm) => baseCy + this.panY - yCm * scale;

    const cx = toScreenX(0);
    const cy = toScreenY(0);

    // 3. Draw Principal Optical Axis
    ctx.strokeStyle = "#29372E";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(10, cy);
    ctx.lineTo(w - 10, cy);
    ctx.stroke();

    // Axis Arrows at endpoints
    ctx.fillStyle = "#29372E";
    ctx.beginPath();
    ctx.moveTo(w - 10, cy);
    ctx.lineTo(w - 18, cy - 4);
    ctx.lineTo(w - 18, cy + 4);
    ctx.closePath();
    ctx.fill();

    // 4. Optical Center O and Focal Point Notations (100% visible)
    const markers = [
      { xCm: -2 * absF, label: "2F₁" },
      { xCm: -absF, label: "F₁" },
      { xCm: 0, label: "O" },
      { xCm: absF, label: "F₂" },
      { xCm: 2 * absF, label: "2F₂" }
    ];

    markers.forEach((m) => {
      const sx = toScreenX(m.xCm);
      if (sx >= -60 && sx <= w + 60) {
        // Vertical axis tick line
        ctx.strokeStyle = m.xCm === 0 ? "#35D39A" : "#45594C";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx, cy - 6);
        ctx.lineTo(sx, cy + 6);
        ctx.stroke();

        // Node dot
        ctx.beginPath();
        ctx.arc(sx, cy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = m.xCm === 0 ? "#35D39A" : "#A2B0A5";
        ctx.fill();

        // High-contrast background pill badge for crystal-clear readability
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "center";
        const tw = ctx.measureText(m.label).width;

        ctx.fillStyle = "rgba(16, 26, 21, 0.9)";
        ctx.strokeStyle = "rgba(41, 55, 46, 0.6)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(sx - tw / 2 - 5, cy + 10, tw + 10, 16, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = m.xCm === 0 ? "#35D39A" : "#C4D1C7";
        ctx.fillText(m.label, sx, cy + 22);
      }
    });

    // 5. Draw Lens Geometry
    ctx.save();
    ctx.strokeStyle = "#35D39A";
    ctx.fillStyle = "rgba(53, 211, 154, 0.12)";
    ctx.lineWidth = 2.5;

    // Keep lens height well-proportioned
    const lensH = Math.min(220, Math.max(90, usableH * 0.48 * (this.autoFit ? 1.0 : Math.sqrt(this.userZoom))));

    if (this.lensType === "convex") {
      ctx.beginPath();
      ctx.moveTo(cx, cy - lensH);
      ctx.quadraticCurveTo(cx + 20, cy, cx, cy + lensH);
      ctx.quadraticCurveTo(cx - 20, cy, cx, cy - lensH);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy - lensH);
      ctx.lineTo(cx + 15, cy - lensH);
      ctx.quadraticCurveTo(cx, cy, cx + 15, cy + lensH);
      ctx.lineTo(cx - 15, cy + lensH);
      ctx.quadraticCurveTo(cx, cy, cx - 15, cy - lensH);
      ctx.fill();
      ctx.stroke();
    }

    // Lens centerline & notation
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = "rgba(53, 211, 154, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy - lensH - 8);
    ctx.lineTo(cx, cy + lensH + 8);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 6. Draw Object Arrow & High-Contrast Notation Badge
    const objX = toScreenX(u);
    const objBaseY = toScreenY(0);
    const objTopY = toScreenY(hO);

    ctx.strokeStyle = "#D6B878";
    ctx.fillStyle = "#D6B878";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(objX, objBaseY);
    ctx.lineTo(objX, objTopY);
    ctx.stroke();

    // Upright Arrowhead
    ctx.beginPath();
    ctx.moveTo(objX, objTopY - 2);
    ctx.lineTo(objX - 6, objTopY + 10);
    ctx.lineTo(objX + 6, objTopY + 10);
    ctx.closePath();
    ctx.fill();

    // Object Notation Pill Badge (ensures 100% visibility over rays/axis)
    const objLabel = `Object (h=${hO}cm, u=${Math.abs(u)}cm)`;
    ctx.font = "bold 11px Inter, sans-serif";
    const objTextW = ctx.measureText(objLabel).width;

    ctx.fillStyle = "rgba(16, 26, 21, 0.92)";
    ctx.strokeStyle = "rgba(214, 184, 120, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(objX - objTextW / 2 - 7, objTopY - 26, objTextW + 14, 18, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#D6B878";
    ctx.textAlign = "center";
    ctx.fillText(objLabel, objX, objTopY - 13);

    // 7. Light Rays & Propagation Vectors
    const f1X = toScreenX(-absF);
    const f2X = toScreenX(absF);

    if (!isInfinity) {
      const imgX = toScreenX(v);
      const imgTopY = toScreenY(hI);
      const isImgInView = imgX >= 25 && imgX <= w - 25;

      // Ray 1: Parallel to Axis -> Enters Lens -> Refracted
      ctx.strokeStyle = "#35D39A";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      ctx.lineTo(cx, objTopY); // Parallel segment

      // Ray 1 Direction Arrow on inbound segment
      const midRay1X = (objX + cx) / 2;
      ctx.stroke();
      this.drawArrowhead(ctx, midRay1X, objTopY, 0, "#35D39A");

      if (this.lensType === "convex") {
        if (!isVirtual) {
          // Real Image: Refracted ray passes through F2 to real image tip
          ctx.beginPath();
          ctx.moveTo(cx, objTopY);
          ctx.lineTo(imgX, imgTopY);
          // Extension past image
          const extX = imgX + 30;
          const slope = (imgTopY - objTopY) / (imgX - cx);
          ctx.lineTo(extX, imgTopY + slope * 30);
          ctx.stroke();

          // Outbound propagation arrow
          const midOutX = (cx + imgX) / 2;
          const midOutY = (objTopY + imgTopY) / 2;
          this.drawArrowhead(ctx, midOutX, midOutY, Math.atan2(imgTopY - objTopY, imgX - cx), "#35D39A");
        } else {
          // Virtual Image: Refracts rightward through F2
          const slopeR1 = (cy - objTopY) / (f2X - cx);
          const r1RightX = w + 80;
          const r1RightY = cy + slopeR1 * (r1RightX - f2X);

          ctx.beginPath();
          ctx.moveTo(cx, objTopY);
          ctx.lineTo(r1RightX, r1RightY);
          ctx.stroke();

          // Direction arrow on refracted beam
          this.drawArrowhead(ctx, cx + 50, objTopY + slopeR1 * 50, Math.atan2(r1RightY - objTopY, r1RightX - cx), "#35D39A");

          // Virtual backward trace to virtual image
          ctx.beginPath();
          ctx.strokeStyle = "rgba(53, 211, 154, 0.45)";
          ctx.setLineDash([4, 4]);
          ctx.moveTo(cx, objTopY);
          ctx.lineTo(imgX, imgTopY);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      } else {
        // Concave diverging
        const slope = (objTopY - cy) / (cx - f1X);
        const r1RightX = w + 80;
        const r1RightY = objTopY + slope * (r1RightX - cx);

        ctx.beginPath();
        ctx.moveTo(cx, objTopY);
        ctx.lineTo(r1RightX, r1RightY);
        ctx.stroke();

        // Virtual dotted trace back to F1
        ctx.beginPath();
        ctx.strokeStyle = "rgba(53, 211, 154, 0.5)";
        ctx.setLineDash([4, 4]);
        ctx.moveTo(cx, objTopY);
        ctx.lineTo(f1X, cy);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Ray 2: Central Ray (Through Optical Center O, undeviated)
      ctx.strokeStyle = "#D6B878";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      ctx.lineTo(cx, cy);

      const centralAngle = Math.atan2(cy - objTopY, cx - objX);
      this.drawArrowhead(ctx, (objX + cx) / 2, (objTopY + cy) / 2, centralAngle, "#D6B878");

      if (this.lensType === "convex" && !isVirtual) {
        // Continues straight to real image tip
        ctx.lineTo(imgX, imgTopY);
        const extX = imgX + 30;
        const slope = (cy - objTopY) / (cx - objX);
        ctx.lineTo(extX, cy + slope * (extX - cx));
        ctx.stroke();

        this.drawArrowhead(ctx, (cx + imgX) / 2, (cy + imgTopY) / 2, centralAngle, "#D6B878");
      } else {
        // Virtual image: Continues rightward, dashed backward trace
        const r2RightX = w + 80;
        const slope = (cy - objTopY) / (cx - objX);
        ctx.lineTo(r2RightX, cy + slope * (r2RightX - cx));
        ctx.stroke();

        this.drawArrowhead(ctx, cx + 55, cy + slope * 55, centralAngle, "#D6B878");

        // Dotted trace backward to virtual image
        ctx.beginPath();
        ctx.strokeStyle = "rgba(214, 184, 120, 0.45)";
        ctx.setLineDash([4, 4]);
        ctx.moveTo(cx, cy);
        ctx.lineTo(imgX, imgTopY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 8. Draw Image Arrow & Notation
      if (isImgInView) {
        ctx.strokeStyle = isVirtual ? "#35D39A" : "#38BDF8";
        ctx.fillStyle = isVirtual ? "#35D39A" : "#38BDF8";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        if (isVirtual) ctx.setLineDash([4, 3]);
        ctx.moveTo(imgX, cy);
        ctx.lineTo(imgX, imgTopY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrowhead
        const arrowDir = imgTopY < cy ? -1 : 1; // -1 for UP, +1 for DOWN
        ctx.beginPath();
        ctx.moveTo(imgX, imgTopY);
        ctx.lineTo(imgX - 6, imgTopY - arrowDir * 10);
        ctx.lineTo(imgX + 6, imgTopY - arrowDir * 10);
        ctx.closePath();
        ctx.fill();

        // Image Notation Pill Badge
        const imgBadgeText = isVirtual
          ? `Virtual Image (h=+${hI.toFixed(1)}cm, v=${v.toFixed(1)}cm)`
          : `Real Image (h=${hI.toFixed(1)}cm, v=+${v.toFixed(1)}cm)`;

        ctx.font = "bold 11px Inter, sans-serif";
        const imgTextW = ctx.measureText(imgBadgeText).width;

        const badgeY = arrowDir === 1 ? imgTopY + 12 : imgTopY - 26;
        ctx.fillStyle = "rgba(16, 26, 21, 0.92)";
        ctx.strokeStyle = isVirtual ? "rgba(53, 211, 154, 0.5)" : "rgba(56, 189, 248, 0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(imgX - imgTextW / 2 - 7, badgeY, imgTextW + 14, 18, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isVirtual ? "#35D39A" : "#38BDF8";
        ctx.textAlign = "center";
        ctx.fillText(imgBadgeText, imgX, badgeY + 13);
      } else {
        // Offscreen Directional Callout Badge
        const isLeft = imgX < 25;
        const calloutX = isLeft ? 16 : w - 16;
        const calloutY = Math.max(topClearance + 15, Math.min(h - bottomClearance - 15, cy - 25));

        const calloutText = isLeft
          ? `⬅ Virtual Image: v = ${v.toFixed(1)}cm, h = +${hI.toFixed(1)}cm (m = ${m.toFixed(2)}×)`
          : `Real Image: v = +${v.toFixed(1)}cm, h = ${hI.toFixed(1)}cm ➔`;

        ctx.font = "bold 11px Inter, sans-serif";
        const ctw = ctx.measureText(calloutText).width;

        ctx.fillStyle = "rgba(16, 26, 21, 0.94)";
        ctx.strokeStyle = isLeft ? "#35D39A" : "#38BDF8";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const rectX = isLeft ? calloutX : calloutX - ctw - 16;
        ctx.roundRect(rectX, calloutY - 12, ctw + 16, 24, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isLeft ? "#35D39A" : "#38BDF8";
        ctx.textAlign = "left";
        ctx.fillText(calloutText, rectX + 8, calloutY + 4);
      }
    } else {
      // Parallel Rays to Infinity (u = -f)
      ctx.strokeStyle = "#35D39A";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      ctx.lineTo(cx, objTopY);
      ctx.lineTo(w + 50, cy + (cy - objTopY));
      ctx.stroke();

      ctx.strokeStyle = "#D6B878";
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      ctx.lineTo(cx, cy);
      ctx.lineTo(w + 50, cy + (cy - objTopY));
      ctx.stroke();

      ctx.font = "bold 12px Inter, sans-serif";
      ctx.fillStyle = "#35D39A";
      ctx.textAlign = "right";
      ctx.fillText("Parallel Rays ➔ Image at Infinity (∞)", w - 20, cy - 35);
    }
  }

  drawArrowhead(ctx, x, y, angle, color) {
    const headLen = 7;
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - headLen * Math.cos(angle - Math.PI / 6), y - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x - headLen * Math.cos(angle + Math.PI / 6), y - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  destroy() {
    this.isDragging = false;
  }
}

window.OpticsSimulation = OpticsSimulation;
