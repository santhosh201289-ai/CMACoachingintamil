// ← CUSTOMIZE THIS FILE FOR EACH PROJECT
// CMA Coaching landing page — off-white scene with a burnt-orange centrepiece.
import * as THREE from 'three';
import { HeroScene } from '../components/HeroScene.js';

/**
 * Build the project-specific scene: lights, fog, and components.
 *
 * @param {import('./core/index.js').Engine} engine
 * @param {object} assets — loaded assets from the Loader manifest
 * @returns {Array} the registered components
 */
export async function setupWorld(engine, assets) {
  // Atmosphere — fog tinted to the off-white background so depth fades softly.
  engine.setFog(0xf7f1e8, 0.045);

  // Lighting tuned for a light backdrop.
  const ambient = new THREE.AmbientLight(0xffffff, 0.85);
  engine.scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(4, 6, 5);
  engine.scene.add(key);

  // Warm rim light to make the burnt-orange core glow.
  const rim = new THREE.DirectionalLight(0xffb27a, 0.6);
  rim.position.set(-5, -2, 3);
  engine.scene.add(rim);

  // Hero centrepiece.
  const hero = new HeroScene(engine);
  await hero.init(assets);
  engine.addComponent(hero);
  hero.onResize(engine.sizes.width, engine.sizes.height, engine.sizes.isMobile);

  return engine.components;
}
