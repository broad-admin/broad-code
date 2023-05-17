import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
  build: {
    outDir: 'docs',
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: {
      overlay: false,
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
