import { Engine, Loader } from './core/index.js';
import { setupWorld } from './world.js';
import { setupAnimations } from './animations.js';

async function init() {
  const engine = new Engine('webgl');
  const loader = new Loader();

  const loaderEl = document.getElementById('loader');
  const fillEl = document.querySelector('.loader-bar-fill');

  // No assets yet — empty manifest. Progress still reports 0 → 1.
  const manifest = {};
  const assets = await loader.loadManifest(manifest, (progress) => {
    if (fillEl) fillEl.style.width = `${Math.round(progress * 100)}%`;
  });

  // Build the scene and wire up scroll animations.
  const components = await setupWorld(engine, assets);
  setupAnimations(engine, components);

  // Enforce a minimum loader display so it doesn't flash.
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (loaderEl) loaderEl.classList.add('loaded');

  engine.start();

  // Optional performance overlay: append ?debug to the URL.
  if (new URLSearchParams(window.location.search).has('debug')) {
    const { Debug } = await import('./core/Debug.js');
    const debug = new Debug(engine);
    debug.show();
    engine.components.push({ update: () => debug.update() });
  }
}

init();
