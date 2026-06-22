import Stats from 'three/examples/jsm/libs/stats.module.js';

/**
 * Debug — dev-only performance monitor (FPS / ms / memory panel).
 *
 * Wraps three's Stats module. Intended to be created only in development and
 * updated once per frame from the engine loop.
 */
export class Debug {
  constructor(engine) {
    this.engine = engine;
    this.stats = new Stats();
    this.visible = false;
  }

  /** Call once per frame from the engine's animate loop. */
  update() {
    this.stats.update();
  }

  /** Mount the stats panel into the DOM. */
  show() {
    if (this.visible) return;
    document.body.appendChild(this.stats.dom);
    this.visible = true;
  }

  /** Remove the stats panel from the DOM. */
  hide() {
    if (!this.visible) return;
    if (this.stats.dom.parentNode) {
      this.stats.dom.parentNode.removeChild(this.stats.dom);
    }
    this.visible = false;
  }
}
