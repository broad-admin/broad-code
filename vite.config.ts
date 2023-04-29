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
  // 公共基础路径
  base: '/broad-code/',
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: {
      overlay: false,
    },
    proxy: {
      '/broad-code': {
        target: 'https://openapi.youdao.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/broad-code/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
