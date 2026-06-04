class UnwindApplet {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Initialize 72 points (nucleotides + backbone)
    this.AMOUNT = 72;
    this.points = Array(this.AMOUNT).fill(null).map(() => [0, 0, 0, 0, 0, 0, 0]);
    this.order = Array(this.AMOUNT).fill(-200);

    // State
    this.mouseDown = false;
    this.animationStarted = false;
    this.oldx = 0;
    this.oldy = 0;
    this.animationFrame = null;

    this.init();
    this.setupEventListeners();
    this.draw();
  }

  init() {
    // Initialize point coordinates and colors
    // Red strand (indices 0-23)
    for (let i = 0; i <= 23; i++) {
      this.points[i][3] = 200; // red
      this.points[i][4] = 0;
      this.points[i][5] = 0;
      this.points[i][6] = 22; // diameter
    }

    // Blue strand (indices 24-47)
    for (let i = 24; i <= 47; i++) {
      this.points[i][3] = 0;
      this.points[i][4] = 0;
      this.points[i][5] = 200; // blue
      this.points[i][6] = 18;
    }

    // Nucleotides (indices 48-71) - random colors
    for (let i = 48; i <= 71; i++) {
      const a = Math.floor(Math.random() * 4);
      const colors = [
        [100, 100, 0],    // yellow
        [0, 100, 0],      // green
        [0, 100, 100],    // cyan
        [100, 0, 100]     // magenta
      ];
      [this.points[i][3], this.points[i][4], this.points[i][5]] = colors[a];
      this.points[i][6] = 18;
    }
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    this.canvas.addEventListener('mouseleave', () => {
      this.mouseDown = false;
    });
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (!this.animationStarted) {
      this.ctx.fillStyle = 'black';
      this.ctx.font = '24px Geneva';
      this.ctx.fillText('Click to start the animation', 10, 100);
      return;
    }

    // Depth sort
    this.depthSort();

    // Draw points in depth order
    for (let i = 0; i < this.AMOUNT; i++) {
      const pointIdx = this.order[i];
      const p = this.points[pointIdx];

      let r = Math.floor(p[3] + p[2] / 2);
      let g = Math.floor(p[4] + p[2] / 2);
      let b = Math.floor(p[5] + p[2] / 2);

      r = Math.max(0, Math.min(255, r));
      g = Math.max(0, Math.min(255, g));
      b = Math.max(0, Math.min(255, b));

      const w = (p[2] + 1000) / 1000;
      const s = Math.round(p[6] * w);

      // Draw with depth fade
      for (let t = 8; t >= 1; t--) {
        const fadeR = Math.floor(255 - ((255 - r) * t / 8));
        const fadeG = Math.floor(255 - ((255 - g) * t / 8));
        const fadeB = Math.floor(255 - ((255 - b) * t / 8));

        this.ctx.fillStyle = `rgb(${fadeR},${fadeG},${fadeB})`;

        const x = w * p[0] + this.width / 2 - s / 2 + ((8 - t) * s / 32);
        const y = w * p[1] + this.height / 2 - s / 2 + ((8 - t) * s / 32);
        const size = t * s / 8;

        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  depthSort() {
    // Count points in front of each point
    for (let i = 0; i < this.AMOUNT; i++) {
      this.order[i] = -200;
    }

    for (let i = 0; i < this.AMOUNT; i++) {
      let x = 0;
      for (let a = 0; a < this.AMOUNT; a++) {
        if (this.points[i][2] > this.points[a][2]) {
          x++;
        }
      }

      while (this.order[x] !== -200) {
        x++;
      }
      this.order[x] = i;
    }
  }

  rotateXZ(dx) {
    for (let i = 0; i < this.AMOUNT; i++) {
      const b = this.points[i][0];
      let c = this.points[i][2];

      let an = Math.atan2(b, c) * 180 / Math.PI;
      if (b < 0 && c >= 0) an += 360;
      if (b < 0 && c < 0) an += 180;
      if (b >= 0 && c < 0) an += 180;

      const m = Math.sqrt(b * b + c * c);
      an += dx;

      this.points[i][0] = m * Math.sin(an * Math.PI / 180);
      this.points[i][2] = m * Math.cos(an * Math.PI / 180);
    }
  }

  rotateYZ(dy) {
    for (let i = 0; i < this.AMOUNT; i++) {
      const b = this.points[i][1];
      let c = this.points[i][2];

      let an = Math.atan2(b, c) * 180 / Math.PI;
      if (b < 0 && c >= 0) an += 360;
      if (b < 0 && c < 0) an += 180;
      if (b >= 0 && c < 0) an += 180;

      const m = Math.sqrt(b * b + c * c);
      an += dy;

      this.points[i][1] = m * Math.sin(an * Math.PI / 180);
      this.points[i][2] = m * Math.cos(an * Math.PI / 180);
    }
  }

  onMouseDown(e) {
    this.mouseDown = true;
    const rect = this.canvas.getBoundingClientRect();
    this.oldx = e.clientX - rect.left;
    this.oldy = e.clientY - rect.top;
  }

  onMouseMove(e) {
    if (!this.mouseDown || !this.animationStarted) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - this.oldx;
    const dy = y - this.oldy;

    this.rotateXZ(dx);
    this.rotateYZ(dy);

    this.oldx = x;
    this.oldy = y;

    this.draw();
  }

  onMouseUp(e) {
    this.mouseDown = false;

    if (this.animationStarted) return;

    this.animationStarted = true;
    this.animate();
  }

  animate() {
    this.animateUnwindAndSeparate().then(() => {
      return this.animateRewind();
    });
  }

  setupStructure(dx) {
    const dy = Math.round(20 * (90 - dx) / 45);
    let a = 0;
    let b = 135 - 4 * dx;
    let c = 45 - 4 * dx;

    // First strand (indices 0-23)
    for (let i = -4 * dy; i <= 3 * dy; i += dy || 1) {
      this.points[a][0] = i;
      this.points[a][1] = 40 * Math.cos(b * Math.PI / 180);
      this.points[a][2] = 40 * Math.sin(b * Math.PI / 180);
      a++;
      b += dx;

      this.points[a][0] = i;
      this.points[a][1] = 40 * Math.cos(c * Math.PI / 180);
      this.points[a][2] = 40 * Math.sin(c * Math.PI / 180);
      a++;
      c += dx;
    }

    // Second strand (indices 24-47)
    a = 0;
    b = 135 + dx / 2 - 4 * dx;
    c = 45 + dx / 2 - 4 * dx;
    for (let i = -3.5 * dy; i <= 3.5 * dy; i += dy || 1) {
      this.points[a + 24][0] = i;
      this.points[a + 24][1] = 40 * Math.cos(b * Math.PI / 180);
      this.points[a + 24][2] = 40 * Math.sin(b * Math.PI / 180);
      a++;
      b += dx;

      this.points[a + 24][0] = i;
      this.points[a + 24][1] = 40 * Math.cos(c * Math.PI / 180);
      this.points[a + 24][2] = 40 * Math.sin(c * Math.PI / 180);
      a++;
      c += dx;
    }

    // Nucleotides (indices 48-71)
    for (let i = 0; i <= 15; i += 2) {
      this.points[i + 48][0] = this.points[i][0] + (this.points[i + 1][0] - this.points[i][0]) / 3;
      this.points[i + 48][1] = this.points[i][1] + (this.points[i + 1][1] - this.points[i][1]) / 3;
      this.points[i + 48][2] = this.points[i][2] + (this.points[i + 1][2] - this.points[i][2]) / 3;

      this.points[i + 49][0] = this.points[i][0] + (this.points[i + 1][0] - this.points[i][0]) * 2 / 3;
      this.points[i + 49][1] = this.points[i][1] + (this.points[i + 1][1] - this.points[i][1]) * 2 / 3;
      this.points[i + 49][2] = this.points[i][2] + (this.points[i + 1][2] - this.points[i][2]) * 2 / 3;
    }
  }

  animateUnwindAndSeparate() {
    return new Promise((resolve) => {
      let dx = 46;

      const step = () => {
        if (dx < 0) {
          resolve();
          return;
        }

        this.setupStructure(dx);
        this.draw();
        dx -= 2;
        requestAnimationFrame(step);
      };

      step();
    });
  }

  animateRewind() {
    return new Promise((resolve) => {
      let dx = 0;

      const step = () => {
        if (dx > 46) {
          resolve();
          return;
        }

        this.setupStructure(dx);
        this.draw();
        dx += 2;
        requestAnimationFrame(step);
      };

      step();
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new UnwindApplet('unwind-canvas');
  });
} else {
  new UnwindApplet('unwind-canvas');
}
