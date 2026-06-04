class DNAApplet {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.AMOUNT = 48;
    this.points = Array(this.AMOUNT).fill(null).map(() => [0, 0, 0, 0, 0, 0, 0]);
    this.order = Array(this.AMOUNT).fill(-200);

    this.mouseDown = false;
    this.oldx = 0;
    this.oldy = 0;

    this.init();
    this.setupEventListeners();
    this.draw();
  }

  init() {
    let a = 0;
    let b = 180;
    let c = 90;

    // Create first strand of backbone
    for (let i = -80; i <= 60; i += 20) {
      this.points[a][0] = i;
      this.points[a][1] = 40 * Math.cos(b * Math.PI / 180);
      this.points[a][2] = 40 * Math.sin(b * Math.PI / 180);
      a++;
      b += 45;

      this.points[a][0] = i;
      this.points[a][1] = 40 * Math.cos(c * Math.PI / 180);
      this.points[a][2] = 40 * Math.sin(c * Math.PI / 180);
      a++;
      c += 45;
    }

    // Create second strand
    a = 0;
    b = 202.5;
    c = 112.5;

    for (let i = -70; i <= 70; i += 20) {
      this.points[a + 16][0] = i;
      this.points[a + 16][1] = 40 * Math.cos(b * Math.PI / 180);
      this.points[a + 16][2] = 40 * Math.sin(b * Math.PI / 180);
      a++;
      b += 45;

      this.points[a + 16][0] = i;
      this.points[a + 16][1] = 40 * Math.cos(c * Math.PI / 180);
      this.points[a + 16][2] = 40 * Math.sin(c * Math.PI / 180);
      a++;
      c += 45;
    }

    // Create nucleotides connecting strands
    for (let i = 0; i <= 15; i += 2) {
      this.points[i + 32][0] = this.points[i][0] + (this.points[i + 1][0] - this.points[i][0]) / 3;
      this.points[i + 32][1] = this.points[i][1] + (this.points[i + 1][1] - this.points[i][1]) / 3;
      this.points[i + 32][2] = this.points[i][2] + (this.points[i + 1][2] - this.points[i][2]) / 3;

      this.points[i + 33][0] = this.points[i][0] + (this.points[i + 1][0] - this.points[i][0]) * 2 / 3;
      this.points[i + 33][1] = this.points[i][1] + (this.points[i + 1][1] - this.points[i][1]) * 2 / 3;
      this.points[i + 33][2] = this.points[i][2] + (this.points[i + 1][2] - this.points[i][2]) * 2 / 3;
    }

    // Color first strand red
    for (let i = 0; i <= 15; i++) {
      this.points[i][3] = 200;
      this.points[i][4] = 0;
      this.points[i][5] = 0;
      this.points[i][6] = 22;
    }

    // Color second strand blue
    for (let i = 16; i <= 31; i++) {
      this.points[i][3] = 0;
      this.points[i][4] = 0;
      this.points[i][5] = 200;
      this.points[i][6] = 18;
    }

    // Color nucleotides random
    for (let i = 32; i <= 47; i++) {
      const color_idx = Math.floor(Math.random() * 4);
      const colors = [
        [100, 100, 0],    // yellow
        [0, 100, 0],      // green
        [0, 100, 100],    // cyan
        [100, 0, 100]     // magenta
      ];
      [this.points[i][3], this.points[i][4], this.points[i][5]] = colors[color_idx];
      this.points[i][6] = 18;
    }
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', () => {
      this.mouseDown = false;
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.mouseDown = false;
    });
  }

  draw() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.depthSort();

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

      const da = 255 - r;
      const dp = 255 - g;
      const dd = 255 - b;

      for (let t = 8; t >= 1; t--) {
        const fadeR = Math.floor(255 - (da * t / 8));
        const fadeG = Math.floor(255 - (dp * t / 8));
        const fadeB = Math.floor(255 - (dd * t / 8));

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
    if (!this.mouseDown) return;

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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DNAApplet('dna-canvas');
  });
} else {
  new DNAApplet('dna-canvas');
}
