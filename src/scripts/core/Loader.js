import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';

/**
 * Loader — centralized asset loading with aggregate progress reporting.
 *
 * Drives all loads through a single THREE.LoadingManager so progress can be
 * surfaced as a single 0..1 value across textures and models.
 */
export class Loader {
  constructor() {
    this.manager = new THREE.LoadingManager();

    const dracoLoader = new DRACOLoader(this.manager);
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);

    this.gltfLoader = new GLTFLoader(this.manager);
    this.gltfLoader.setDRACOLoader(dracoLoader);

    this.textureLoader = new THREE.TextureLoader(this.manager);

    this.dracoLoader = dracoLoader;
  }

  /**
   * Load every asset described by a manifest.
   *
   * @param {object} manifest — e.g.
   *   {
   *     textures: { matcap: '/assets/textures/matcap.png' },
   *     models:   { hero: '/assets/models/hero.glb' },
   *   }
   * @param {(progress: number) => void} [onProgress] — called with 0..1
   * @returns {Promise<object>} same structure, values replaced with loaded
   *   THREE objects (textures and GLTF objects respectively)
   */
  async loadManifest(manifest = {}, onProgress) {
    if (typeof onProgress === 'function') {
      this.manager.onProgress = (_url, loaded, total) => {
        onProgress(total > 0 ? loaded / total : 0);
      };
    }

    const result = {};
    const tasks = [];

    const textures = manifest.textures || {};
    if (Object.keys(textures).length) {
      result.textures = {};
      for (const [key, url] of Object.entries(textures)) {
        tasks.push(
          this.textureLoader.loadAsync(url).then((texture) => {
            result.textures[key] = texture;
          })
        );
      }
    }

    const models = manifest.models || {};
    if (Object.keys(models).length) {
      result.models = {};
      for (const [key, url] of Object.entries(models)) {
        tasks.push(
          this.gltfLoader.loadAsync(url).then((gltf) => {
            result.models[key] = gltf;
          })
        );
      }
    }

    await Promise.all(tasks);

    if (typeof onProgress === 'function') {
      onProgress(1);
    }

    return result;
  }
}
