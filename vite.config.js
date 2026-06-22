import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig(({ command }) => ({
  root: 'src',
  publicDir: '../public',

  plugins: [
    glsl({
      include: ['**/*.glsl', '**/*.vert', '**/*.frag', '**/*.vs', '**/*.fs'],
      compress: command === 'build',
    }),
  ],

  server: {
    port: 3000,
    host: true,
    open: true,
  },

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'es2020',
    sourcemap: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap')) return 'gsap';
        },
      },
    },
  },

  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr', '**/*.ktx2', '**/*.bin'],
}));
