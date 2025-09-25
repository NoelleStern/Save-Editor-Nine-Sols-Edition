import { defineConfig } from 'vite';
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
  ],
  optimizeDeps: {
    exclude: [
      "@syntect/wasm"
    ]
  },
});
