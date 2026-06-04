class UnwindApplet {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Initialize 48 points (16 strand1 + 16 strand2 + 16 nucleotides)
    this.AMOUNT = 48;
    this.points = Array(this.AMOUNT).fill(null).map(() => [0, 0, 0, 0, 0, 0, 0]);
    this.originalPoints = Array(this.AMOUNT).fill(null).map(() => [0, 0, 0, 0, 0, 0, 0]);
    this.order = Array(this.AMOUNT).fill(-200);

    // Rotation tracking (in degrees)
    this.rotationXZ = 0;
    this.rotationYZ = 0;

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
    // Initialize colors once - will be used throughout animation
    // Red strand (indices 0-23)
    for (let i = 0; i <= 23; i++) {
      this.originalPoints[i][3] = 200;
      this.originalPoints[i][4] = 0;
      this.originalPoints[i][5] = 0;
      this.originalPoints[i][6] = 22;
    }

    // Blue strand (indices 24-47)
    for (let i = 24; i <= 47; i++) {
      this.originalPoints[i][3] = 0;
      this.originalPoints[i][4] = 0;
      this.originalPoints[i][5] = 200;
      this.originalPoints[i][6] = 18;
    }

    // Nucleotides (indices 48-71) - assign random colors once
    const colors = [
      [100, 100, 0],    // yellow
      [0, 100, 0],      // green
      [0, 100, 100],    // cyan
      [100, 0, 100]     // magenta
    ];
    for (let i = 48; i <= 71; i++) {
      const colorIdx = Math.floor(Math.random() * 4);
      this.originalPoints[i][3] = colors[colorIdx][0];
      this.originalPoints[i][4] = colors[colorIdx][1];
      this.originalPoints[i][5] = colors[colorIdx][2];
      this.originalPoints[i][6] = 18;
    }
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mouseup', (e) => this.onMouseUp(e));
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
    this.rotationXZ += dx;
    this.applyRotation();
  }

  rotateYZ(dy) {
    this.rotationYZ += dy;
    this.applyRotation();
  }

  onMouseDown(e) {
    this.mouseDown = true;
    this.oldx = e.clientX;
    this.oldy = e.clientY;
  }

  onMouseMove(e) {
    if (!this.mouseDown || !this.animationStarted) return;

    const dx = e.clientX - this.oldx;
    const dy = e.clientY - this.oldy;

    this.rotateXZ(-dx);
    this.rotateYZ(-dy);

    this.oldx = e.clientX;
    this.oldy = e.clientY;

    this.draw();
  }

  onMouseUp(e) {
    this.mouseDown = false;

    if (this.animationStarted) return;

    this.animationStarted = true;
    this.animate();
  }

  animate() {
    this.animateUnwind().then(() => {
      return this.animateSeparateHorizontal();
    }).then(() => {
      return this.animateSeparateVertical();
    }).then(() => {
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
      this.originalPoints[a][0] = i;
      this.originalPoints[a][1] = 40 * Math.cos(b * Math.PI / 180);
      this.originalPoints[a][2] = 40 * Math.sin(b * Math.PI / 180);
      a++;
      b += dx;

      this.originalPoints[a][0] = i;
      this.originalPoints[a][1] = 40 * Math.cos(c * Math.PI / 180);
      this.originalPoints[a][2] = 40 * Math.sin(c * Math.PI / 180);
      a++;
      c += dx;
    }

    // Second strand (indices 24-47)
    a = 0;
    b = 135 + dx / 2 - 4 * dx;
    c = 45 + dx / 2 - 4 * dx;
    for (let i = -3.5 * dy; i <= 3.5 * dy; i += dy || 1) {
      this.originalPoints[a + 24][0] = i;
      this.originalPoints[a + 24][1] = 40 * Math.cos(b * Math.PI / 180);
      this.originalPoints[a + 24][2] = 40 * Math.sin(b * Math.PI / 180);
      a++;
      b += dx;

      this.originalPoints[a + 24][0] = i;
      this.originalPoints[a + 24][1] = 40 * Math.cos(c * Math.PI / 180);
      this.originalPoints[a + 24][2] = 40 * Math.sin(c * Math.PI / 180);
      a++;
      c += dx;
    }

    // Nucleotides (indices 48-71) - only update coordinates, colors stay the same
    for (let i = 0; i <= 15; i += 2) {
      this.originalPoints[i + 48][0] = this.originalPoints[i][0] + (this.originalPoints[i + 1][0] - this.originalPoints[i][0]) / 3;
      this.originalPoints[i + 48][1] = this.originalPoints[i][1] + (this.originalPoints[i + 1][1] - this.originalPoints[i][1]) / 3;
      this.originalPoints[i + 48][2] = this.originalPoints[i][2] + (this.originalPoints[i + 1][2] - this.originalPoints[i][2]) / 3;

      this.originalPoints[i + 49][0] = this.originalPoints[i][0] + (this.originalPoints[i + 1][0] - this.originalPoints[i][0]) * 2 / 3;
      this.originalPoints[i + 49][1] = this.originalPoints[i][1] + (this.originalPoints[i + 1][1] - this.originalPoints[i][1]) * 2 / 3;
      this.originalPoints[i + 49][2] = this.originalPoints[i][2] + (this.originalPoints[i + 1][2] - this.originalPoints[i][2]) * 2 / 3;
    }

    this.applyRotation();
  }

  applyRotation() {
    for (let i = 0; i < this.AMOUNT; i++) {
      const orig = this.originalPoints[i];
      let x = orig[0];
      let y = orig[1];
      let z = orig[2];

      // Apply XZ rotation (yaw)
      const angle1 = this.rotationXZ * Math.PI / 180;
      const x1 = x * Math.cos(angle1) - z * Math.sin(angle1);
      const z1 = x * Math.sin(angle1) + z * Math.cos(angle1);

      // Apply YZ rotation (pitch) on rotated coordinates
      const angle2 = this.rotationYZ * Math.PI / 180;
      const y2 = y * Math.cos(angle2) - z1 * Math.sin(angle2);
      const z2 = y * Math.sin(angle2) + z1 * Math.cos(angle2);

      this.points[i][0] = x1;
      this.points[i][1] = y2;
      this.points[i][2] = z2;
      this.points[i][3] = orig[3];
      this.points[i][4] = orig[4];
      this.points[i][5] = orig[5];
      this.points[i][6] = orig[6];
    }
  }

  animateUnwind() {
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
        setTimeout(step, 100);
      };

      step();
    });
  }

  animateSeparateHorizontal() {
    return new Promise((resolve) => {
      let frame = 0;
      const totalFrames = 20;

      const step = () => {
        if (frame > totalFrames) {
          resolve();
          return;
        }

        for (let i = 0; i <= 15; i++) {
          if (i <= 5 || i === 7 || i === 9) {
            this.originalPoints[i][0] -= 3;
            this.originalPoints[i + 24][0] -= 3;
            this.originalPoints[i + 48][0] -= 3;
          } else {
            this.originalPoints[i][0] += 3;
            this.originalPoints[i + 24][0] += 3;
            this.originalPoints[i + 48][0] += 3;
          }
        }

        this.applyRotation();
        this.draw();
        frame++;
        setTimeout(step, 100);
      };

      step();
    });
  }

  animateSeparateVertical() {
    return new Promise((resolve) => {
      let frame = 0;
      const totalFrames = 35;

      const step = () => {
        if (frame > totalFrames) {
          resolve();
          return;
        }

        for (let i = 16; i <= 23; i++) {
          this.originalPoints[i][1] -= 3;
          this.originalPoints[i + 24][1] -= 3;
          this.originalPoints[i + 48][1] -= 3;
        }

        this.applyRotation();
        this.draw();
        frame++;
        setTimeout(step, 100);
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
        setTimeout(step, 100);
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
