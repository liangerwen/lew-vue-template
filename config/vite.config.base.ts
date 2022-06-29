import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import Unocss from 'unocss/vite';
import { presetUno, presetIcons } from 'unocss';

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    svgLoader({ svgoConfig: {} }),
    Unocss({
      presets: [
        presetUno(),
        presetIcons({
          extraProperties: {
            'display': 'inline-block',
            'vertical-align': 'middle',
          },
        }),
      ],
      rules: [
        [
          /^frosted-glass-warpper-\[(.+)\]$/,
          ([, d]) => ({
            'position': 'relative',
            'overflow': 'hidden',
            'background': d,
            'box-shadow': '3px 3px 6px 3px rgba(0, 0, 0, 0.3)',
          }),
        ],
        [
          /^frosted-glass-mask-\[(.+)\]$/,
          ([, d]) => ({
            'content': '',
            'background': d,
            'background-attachment': 'fixed',
            'position': 'absolute',
            'top': 0,
            'bottom': 0,
            'left': 0,
            'right': 0,
            'filter': 'blur(8px)',
            'margin': '-30px',
          }),
        ],
        [
          'titillium',
          {
            'font-family':
              "Titillium Web, PingFang SC, Hiragino Sans GB, 'Microsoft YaHei',Helvetica Neue, Helvetica, Arial, sans-serif !important",
          },
        ],
      ],
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src'),
      },
      {
        find: 'assets',
        replacement: resolve(__dirname, '../src/assets'),
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // Resolve the i18n warning issue
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js', // compile template
      },
    ],
    extensions: ['.ts', '.js'],
  },
  define: {
    'process.env': {},
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            'src/assets/style/breakpoint.less'
          )}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
});
