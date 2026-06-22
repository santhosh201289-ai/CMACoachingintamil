import * as THREE from 'three';

/**
 * HeroScene — the hero centrepiece for the CMA Coaching landing page.
 *
 * A slowly rotating, faceted "knowledge core" (icosahedron) wrapped in a
 * burnt-orange wireframe, floating inside a soft field of drifting particles.
 * Reads cleanly on the off-white background and reacts gently to the mouse.
 *
 * Conforms to the strict component interface (see CLAUDE.md).
 */
export class HeroScene {
  constructor(engine) {
    this.engine = engine;
    this.group = new THREE.Group();

    this.accent = new THREE.Color('#c0461c');
    this.particleCount = engine.sizes.isMobile ? 140 : 320;

    this._mouse = { x: 0, y: 0 };
  }

  async init() {
    // --- Central solid core ---
    this.coreGeometry = new THREE.IcosahedronGeometry(1.15, 1);
    this.coreMaterial = new THREE.MeshStandardMaterial({
      color: this.accent,
      roughness: 0.35,
      metalness: 0.55,
      flatShading: true,
    });
    this.core = new THREE.Mesh(this.coreGeometry, this.coreMaterial);
    this.group.add(this.core);

    // --- Wireframe shell ---
    this.shellGeometry = new THREE.IcosahedronGeometry(1.55, 1);
    this.shellMaterial = new THREE.MeshBasicMaterial({
      color: this.accent,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    this.shell = new THREE.Mesh(this.shellGeometry, this.shellMaterial);
    this.group.add(this.shell);

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
      color: this.accent,
      size: 0.045,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.group.add(this.particles);
  }

  update(time) {
    // Gentle continuous rotation + counter-rotating shell.
    this.core.rotation.x = time * 0.18;
    this.core.rotation.y = time * 0.24;
    this.shell.rotation.x = -time * 0.1;
    this.shell.rotation.y = -time * 0.14;

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
    // Push the centrepiece slightly off-screen-right on desktop so it sits
    // beside the hero copy; centre it on mobile.
    this.group.position.x = isMobile ? 0 : 1.6;
    this.group.scale.setScalar(isMobile ? 0.75 : 1);
  }

  dispose() {
    this.coreGeometry.dispose();
    this.coreMaterial.dispose();
    this.shellGeometry.dispose();
    this.shellMaterial.dispose();
    this.particleGeometry.dispose();
    this.particleMaterial.dispose();
  }
}
