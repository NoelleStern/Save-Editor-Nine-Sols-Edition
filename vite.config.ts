import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import wasm from 'vite-plugin-wasm';


// https://vite.dev/config/
export default defineConfig({
  base: "/Save-Editor-Nine-Sols-Edition/",
  plugins: [
    tailwindcss(),
    svelte(),
    wasm(),
    Icons({
      defaultStyle: 'width: calc(var(--spacing) * 10); height: calc(var(--spacing) * 10);',
      compiler: 'svelte',
    }),
    VitePWA({ 
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest,json}"],
      },
      // generates 'manifest.webmanifest' file on build
      manifest: {
        name: 'Save Editor Nine Sols Edition',
        short_name: 'SENSE',
        start_url: '/Save-Editor-Nine-Sols-Edition/',
        display: 'standalone',
        description: 'A web-based Nine Sols save file editor.',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: 'images/icons/pwa-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'images/icons/pwa-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
        ],
        "screenshots": [
          // Desktop
          {
            "src": "images/screenshots/wide1.png",
            "sizes": "1920x1080",
            "type": "image/png",
            "form_factor": "wide",
            "label": "Welcome screen"
          },
          {
            "src": "images/screenshots/wide2.png",
            "sizes": "1920x1080",
            "type": "image/png",
            "form_factor": "wide",
            "label": "Editor screen"
          },
        ],
      }
    }),
  ],
  optimizeDeps: {
    exclude: [
      "@syntect/wasm"
    ]
  },
});
