import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { isMobile } from './Resizer.js';

/**
 * Engine — generic, reusable Three.js master controller.
 *
 * Owns the scene, camera, renderer, clock and render loop. Components are
 * registered via addComponent() and driven each frame through a strict
 * lifecycle (update / onMouseMove / onResize / dispose).
 *
 * Contains zero project-specific code — customize via world.js instead.
 */
export class Engine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Engine: canvas element with id "${canvasId}" not found`);
    }

    // --- State ---
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      isMobile: isMobile(),
    };

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.time = { elapsed: 0, delta: 0 };
    this.components = [];
    this.composer = null;
    this.isReady = false;

    // --- Clock ---
    this.clock = new THREE.Clock();

    // --- Scene ---
    this.scene = new THREE.Scene();

    // --- Camera ---
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      1000
    );
    this.camera.position.z = 5;
    this.scene.add(this.camera);

    // --- Renderer ---
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- Bound handlers (stored so they can be removed on dispose) ---
    this._boundResize = this._onResize.bind(this);
    this._boundMouseMove = this._onMouseMove.bind(this);
    this._boundDispose = this.dispose.bind(this);

    window.addEventListener('resize', this._boundResize);
    window.addEventListener('mousemove', this._boundMouseMove);
    window.addEventListener('beforeunload', this._boundDispose);
  }

  /**
   * Enable exponential fog. Disabled by default.
   * @param {number|string} color
   * @param {number} density
   */
  setFog(color, density) {
    this.scene.fog = new THREE.FogExp2(color, density);
  }

  /**
   * Set up post-processing. Creates an EffectComposer with a RenderPass
   * followed by any custom passes provided.
   * @param {Array} passes — custom passes to append after the RenderPass
   */
  setPostProcessing(passes = []) {
    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(this.sizes.width, this.sizes.height);
    this.composer.setPixelRatio(this.sizes.pixelRatio);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    for (const pass of passes) {
      this.composer.addPass(pass);
    }
    return this.composer;
  }

  /**
   * Register a component and add its group to the scene.
   * @param {object} component — must expose a `group` and the lifecycle methods
   */
  addComponent(component) {
    this.components.push(component);
    if (component.group) {
      this.scene.add(component.group);
    }
    return component;
  }

  /**
   * Unregister a component, remove its group and dispose it.
   */
  removeComponent(component) {
    const index = this.components.indexOf(component);
    if (index !== -1) {
      this.components.splice(index, 1);
    }
    if (component.group) {
      this.scene.remove(component.group);
    }
    if (typeof component.dispose === 'function') {
      component.dispose();
    }
  }

  start() {
    this.isReady = true;
    this.renderer.setAnimationLoop(this._animate.bind(this));
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  _animate() {
    // --- Time ---
    this.time.elapsed = this.clock.getElapsedTime();
    this.time.delta = this.clock.getDelta();

    // --- Smooth mouse toward target ---
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // --- Drive components ---
    for (const component of this.components) {
      if (typeof component.update === 'function') {
        component.update(this.time.elapsed, this.time.delta, 0);
      }
      if (typeof component.onMouseMove === 'function') {
        component.onMouseMove(this.mouse.x, this.mouse.y);
      }
    }

    // --- Render ---
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  _onResize() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    this.sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.sizes.isMobile = isMobile();

    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);

    if (this.composer) {
      this.composer.setSize(this.sizes.width, this.sizes.height);
      this.composer.setPixelRatio(this.sizes.pixelRatio);
    }

    for (const component of this.components) {
      if (typeof component.onResize === 'function') {
        component.onResize(this.sizes.width, this.sizes.height, this.sizes.isMobile);
      }
    }
  }

  _onMouseMove(event) {
    this.mouse.targetX = (event.clientX / this.sizes.width) * 2 - 1;
    this.mouse.targetY = -((event.clientY / this.sizes.height) * 2 - 1);
  }

  dispose() {
    this.stop();

    for (const component of this.components) {
      if (typeof component.dispose === 'function') {
        component.dispose();
      }
    }
    this.components = [];

    this.renderer.dispose();

    window.removeEventListener('resize', this._boundResize);
    window.removeEventListener('mousemove', this._boundMouseMove);
    window.removeEventListener('beforeunload', this._boundDispose);
  }
}
