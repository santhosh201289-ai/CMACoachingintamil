import * as THREE from 'three';

/**
 * HeroScene — the hero centrepiece for the CMA Coaching landing page.
 *
 * A slowly revolving cloud of finance & exam symbols (₹, $, €, TAX, GST, %,
 * and CMA paper/exam numbers), each a crisp billboarded sprite orbiting on
 * tilted rings that blanket the whole screen, inside a soft field of drifting
 * particles. Visible at full size immediately on load; reacts to the mouse.
 *
 * Conforms to the strict component interface (see CLAUDE.md).
 */
export class HeroScene {
  constructor(engine) {
    this.engine = engine;
    this.group = new THREE.Group();

    // Burnt-orange palette that reads on the off-white background.
    this.accent = '#c0461c'; // burnt orange
    this.ink = '#2a2420'; // near-black
    this.green = '#d4892f'; // warm amber
    this.particleCount = engine.sizes.isMobile ? 120 : 280;

    // Finance & exam symbols; colours cycle through the palette below.
    this.symbols = [
      '₹', '$', 'TAX', '%', '£', '€', 'GST', '14', 'ROI', '¥',
      '15', 'SFM', '90', 'NPV', '+', 'EPS', 'AUDIT', '=', 'IRR', '∑',
      'FM', 'LAW', '÷', '×', 'DT', 'IDT', '₹', '$', '100', '45',
    ];
    this.symbolColors = [this.accent, this.ink, this.green];

    // Orbital rings spread across the full viewport — varied radius, height
    // band and tilt so the revolving symbols blanket the whole screen.
    this.ringConfig = [
      { radius: 3.0, y: 2.7, speed: 0.3, tilt: 0.5 },
      { radius: 4.6, y: 1.4, speed: -0.22, tilt: 0.25 },
      { radius: 6.2, y: 0.2, speed: 0.16, tilt: 0.05 },
      { radius: 7.2, y: -1.1, speed: -0.13, tilt: -0.25 },
      { radius: 5.2, y: -2.5, speed: 0.2, tilt: -0.5 },
      { radius: 3.8, y: -0.5, speed: -0.27, tilt: 0.7 },
    ];

    this.rings = [];
    this.sprites = [];
    this._textures = [];
    this._materials = [];

    this._mouse = { x: 0, y: 0 };
  }

  /** Render a single symbol to a transparent canvas texture. */
  _makeSymbolTexture(text, color) {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Fit the font so the glyph(s) span the canvas with a little padding.
    let fontSize = 200;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    do {
      ctx.font = `800 ${fontSize}px Sora, system-ui, sans-serif`;
      fontSize -= 6;
    } while (ctx.measureText(text).width > size * 0.86 && fontSize > 20);

    ctx.fillStyle = color;
    ctx.fillText(text, size / 2, size / 2 + size * 0.04);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = this.engine.renderer.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
    return texture;
  }

  async init() {
    // --- Revolving symbol rings ---
    // Distribute symbols round-robin across the rings.
    const ringCount = this.ringConfig.length;
    const byRing = this.ringConfig.map(() => []);
    this.symbols.forEach((text, i) =>
      byRing[i % ringCount].push({
        text,
        color: this.symbolColors[i % this.symbolColors.length],
      })
    );

    byRing.forEach((specs, ringIndex) => {
      const cfg = this.ringConfig[ringIndex];
      const ringGroup = new THREE.Group();
      ringGroup.position.y = cfg.y; // height band
      ringGroup.rotation.x = cfg.tilt; // tilt so symbols sweep vertically

      specs.forEach((spec, i) => {
        const texture = this._makeSymbolTexture(spec.text, spec.color);
        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 0.32,
          depthWrite: false,
        });
        const sprite = new THREE.Sprite(material);

        const angle = (i / specs.length) * Math.PI * 2;
        const scale = spec.text.length > 1 ? 0.34 : 0.24;
        sprite.scale.setScalar(scale);
        sprite.position.set(
          Math.cos(angle) * cfg.radius,
          0,
          Math.sin(angle) * cfg.radius
        );

        this._textures.push(texture);
        this._materials.push(material);
        this.sprites.push({ sprite, phase: angle });
        ringGroup.add(sprite);
      });

      this.rings.push({ group: ringGroup, speed: cfg.speed });
      this.group.add(ringGroup);
    });

    // --- Drifting particle field (reused geometry/material) ---
    const positions = new Float32Array(this.particleCount * 3);
    for (let i = 0; i < this.particleCount; i++) {
      const radius = 3 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    this.particleGeometry = new THREE.BufferGeometry();
    this.particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    this.particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(this.accent),
      size: 0.03,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    });
    this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.group.add(this.particles);

    // Visible at full size immediately on load.
    this.group.scale.setScalar(1);
  }

  update(time) {
    // Each ring revolves at its own speed/direction.
    this.rings.forEach((ring) => {
      ring.group.rotation.y = time * ring.speed;
    });

    // Sprites gently bob so the cloud feels alive.
    this.sprites.forEach(({ sprite, phase }) => {
      sprite.position.y = Math.sin(time * 0.8 + phase) * 0.12;
    });

    // Slow particle drift.
    this.particles.rotation.y = time * 0.03;

    // Subtle float + mouse parallax on the whole group.
    this.group.position.y = Math.sin(time * 0.6) * 0.12;
    this.group.rotation.y += (this._mouse.x * 0.4 - this.group.rotation.y) * 0.04;
    this.group.rotation.x += (-this._mouse.y * 0.3 - this.group.rotation.x) * 0.04;
  }

  onMouseMove(normalizedX, normalizedY) {
    this._mouse.x = normalizedX;
    this._mouse.y = normalizedY;
  }

  onResize(width, height, isMobile) {
    // Centre the cloud; scale down a touch on mobile.
    this.group.position.x = 0;
    this.group.scale.setScalar(isMobile ? 0.7 : 1);
  }

  dispose() {
    this._textures.forEach((t) => t.dispose());
    this._materials.forEach((m) => m.dispose());
    this.particleGeometry.dispose();
    this.particleMaterial.dispose();
  }
}
