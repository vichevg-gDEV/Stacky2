import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  let base = './';

  if (process.env.BASE_URL && process.env.BASE_URL !== '/' && process.env.BASE_URL.trim() !== '') {
    base = process.env.BASE_URL;
  } else if (process.env.GITHUB_REPOSITORY) {
    const parts = process.env.GITHUB_REPOSITORY.split('/');
    const owner = parts[0] || '';
    const repo = parts[1] || '';
    if (repo && repo.toLowerCase() === `${owner.toLowerCase()}.github.io`) {
      base = '/';
    } else if (repo) {
      base = `/${repo}/`;
    }
  }

  // Ensure trailing slash for non-relative base paths
  if (base !== './' && !base.endsWith('/')) {
    base = `${base}/`;
  }

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname ?? '.', '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
