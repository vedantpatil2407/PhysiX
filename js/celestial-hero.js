/**
 * PHYSIX Celestial Orbit Visual Engine
 * Lightweight Canvas rendering a luminous planet, Keplerian orbital trajectories,
 * tangential velocity vectors, coordinate grids, and subtle cosmic particles.
 */

class CelestialHeroVisual {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.animationFrameId = null;
    this.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Simulation state
    this.time = 0;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.satelliteAngle = 0;

    // Keplerian orbit parameters (e = 0.38)
    this.orbit = {
      a: 160,       // Semi-major axis
      e: 0.38,      // Eccentricity
      tilt: -0.45,  // Orbital inclination angle in radians
      b: 0,         // Semi-minor axis (calculated)
      c: 0          // Focal distance
    };
    this.orbit.b = this.orbit.a * Math.sqrt(1 - this.orbit.e * this.orbit.e);
    this.orbit.c = this.orbit.a * this.orbit.e;

    // Secondary circular orbit
    this.secondaryOrbitRadius = 210;

    // Ambient floating particles
    this.particles = [];
    this.initParticles();

    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    window.addEventListener("resize", this.resize);
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("mouseleave", () => {
      this.mouse.targetX = 0;
      this.mouse.targetY = 0;
    });

    this.resize();
    if (!this.prefersReducedMotion) {
      this.render();
    } else {
      this.renderStatic();
    }
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < 45; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * 500,
        y: (Math.random() - 0.5) * 500,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.002 + 0.001,
        angle: Math.random() * Math.PI * 2
      });
    }
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);

    // Dynamic scale based on canvas size
    const scale = Math.min(this.width, this.height) / 480;
    this.orbit.a = 150 * scale;
    this.orbit.b = this.orbit.a * Math.sqrt(1 - this.orbit.e * this.orbit.e);
    this.orbit.c = this.orbit.a * this.orbit.e;
    this.secondaryOrbitRadius = 200 * scale;
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - this.width / 2;
    const y = e.clientY - rect.top - this.height / 2;
    this.mouse.targetX = (x / this.width) * 20;
    this.mouse.targetY = (y / this.height) * 20;
  }

  render() {
    this.time += 0.016;

    // Smooth mouse parallax
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    this.drawScene();
    this.animationFrameId = requestAnimationFrame(this.render);
  }

  renderStatic() {
    this.mouse.x = 0;
    this.mouse.y = 0;
    this.satelliteAngle = 1.2;
    this.drawScene();
  }

  drawScene() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const cx = this.width / 2 + this.mouse.x;
    const cy = this.height / 2 + this.mouse.y;

    // 1. Draw Starfield Particles
    ctx.save();
    ctx.translate(cx, cy);
    this.particles.forEach((p) => {
      p.angle += p.speed;
      const px = p.x + Math.cos(p.angle) * 8;
      const py = p.y + Math.sin(p.angle) * 8;
      ctx.beginPath();
      ctx.arc(px, py, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(162, 176, 165, ${p.alpha})`;
      ctx.fill();
    });
    ctx.restore();

    // 2. Draw Outer Coordinate Ring
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.arc(0, 0, this.secondaryOrbitRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(41, 55, 46, 0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 6]);
    ctx.stroke();

    // Marker ticks on outer ring
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      const r1 = this.secondaryOrbitRadius - 4;
      const r2 = this.secondaryOrbitRadius + 4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.strokeStyle = "rgba(53, 211, 154, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Draw Elliptical Keplerian Orbit
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.orbit.tilt);

    // Orbit Path
    ctx.beginPath();
    ctx.ellipse(0, 0, this.orbit.a, this.orbit.b, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(53, 211, 154, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();

    // Secondary subtle gold ellipse
    ctx.beginPath();
    ctx.ellipse(0, 0, this.orbit.a * 0.7, this.orbit.b * 0.7, Math.PI / 4, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(214, 184, 120, 0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 4. Calculate Satellite Position (Keplerian Motion approximation: r = a(1 - e^2)/(1 + e cos theta))
    if (!this.prefersReducedMotion) {
      // Faster near periapsis
      const rFactor = 1 - this.orbit.e * Math.cos(this.satelliteAngle);
      const angularSpeed = 0.015 / Math.max(0.4, rFactor * rFactor);
      this.satelliteAngle += angularSpeed;
    }

    const satX = this.orbit.a * Math.cos(this.satelliteAngle);
    const satY = this.orbit.b * Math.sin(this.satelliteAngle);

    // Radial vector from focus to satellite
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(satX, satY);
    ctx.strokeStyle = "rgba(214, 184, 120, 0.35)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    ctx.stroke();

    // Tangential Velocity Vector
    const tanVx = -this.orbit.a * Math.sin(this.satelliteAngle);
    const tanVy = this.orbit.b * Math.cos(this.satelliteAngle);
    const tanLen = Math.hypot(tanVx, tanVy) || 1;
    const vScale = 34;
    const vx = satX + (tanVx / tanLen) * vScale;
    const vy = satY + (tanVy / tanLen) * vScale;

    ctx.beginPath();
    ctx.moveTo(satX, satY);
    ctx.lineTo(vx, vy);
    ctx.strokeStyle = "#35D39A";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.stroke();

    // Arrowhead for vector v
    const angleV = Math.atan2(vy - satY, vx - satX);
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.lineTo(vx - 7 * Math.cos(angleV - Math.PI / 6), vy - 7 * Math.sin(angleV - Math.PI / 6));
    ctx.lineTo(vx - 7 * Math.cos(angleV + Math.PI / 6), vy - 7 * Math.sin(angleV + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = "#35D39A";
    ctx.fill();

    // Vector v label
    ctx.fillStyle = "#F3F2EC";
    ctx.font = "10px Inter, sans-serif";
    ctx.fillText("v⃗", vx + 4, vy - 2);

    // Satellite Body
    ctx.beginPath();
    ctx.arc(satX, satY, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = "#D6B878";
    ctx.shadowColor = "#D6B878";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Small Satellite Pulse Ring
    const pulseR = 5.5 + Math.sin(this.time * 4) * 3;
    ctx.beginPath();
    ctx.arc(satX, satY, pulseR, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(214, 184, 120, 0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();

    // 5. Draw Central Luminous Planet
    ctx.save();
    ctx.translate(cx, cy);

    // Deep outer atmospheric corona
    const coronaGrad = ctx.createRadialGradient(0, 0, 30, 0, 0, 95);
    coronaGrad.addColorStop(0, "rgba(53, 211, 154, 0.4)");
    coronaGrad.addColorStop(0.5, "rgba(29, 143, 104, 0.15)");
    coronaGrad.addColorStop(1, "rgba(9, 11, 10, 0)");
    ctx.beginPath();
    ctx.arc(0, 0, 95, 0, Math.PI * 2);
    ctx.fillStyle = coronaGrad;
    ctx.fill();

    // Planet Solid Sphere with Curvature Shading
    const planetRadius = 46;
    const sphereGrad = ctx.createRadialGradient(
      -planetRadius * 0.35,
      -planetRadius * 0.35,
      planetRadius * 0.1,
      0,
      0,
      planetRadius
    );
    sphereGrad.addColorStop(0, "#48f0b0");
    sphereGrad.addColorStop(0.25, "#35D39A");
    sphereGrad.addColorStop(0.65, "#163a2c");
    sphereGrad.addColorStop(1, "#0a130e");

    ctx.beginPath();
    ctx.arc(0, 0, planetRadius, 0, Math.PI * 2);
    ctx.fillStyle = sphereGrad;
    ctx.fill();

    // Planet Surface Latitude Lines (Scientific Wireframe)
    ctx.save();
    ctx.rotate(0.35); // Axial tilt
    ctx.strokeStyle = "rgba(53, 211, 154, 0.25)";
    ctx.lineWidth = 1;

    for (let lat = -24; lat <= 24; lat += 12) {
      const rx = Math.sqrt(Math.max(0, planetRadius * planetRadius - lat * lat));
      ctx.beginPath();
      ctx.ellipse(0, lat, rx, rx * 0.32, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // Inner Core Glow
    ctx.beginPath();
    ctx.arc(-14, -14, 6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(243, 242, 236, 0.6)";
    ctx.filter = "blur(2px)";
    ctx.fill();
    ctx.filter = "none";

    ctx.restore();
  }
}

// Attach to window
window.CelestialHeroVisual = CelestialHeroVisual;
