import { defineConfig } from 'vite';

export default defineConfig({
  base: '/myportfolio/', // Maps properly to the new GitHub repo name
  build: {
    outDir: 'dist',
  },
});
