import { defineNuxtConfig } from 'nuxt'
import webpack from 'webpack'
import inject from '@rollup/plugin-inject'
import commonjs from '@rollup/plugin-commonjs'

const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  publicRuntimeConfig: {
    collection: process.env.APP_COLLECTION,
    iconNetwork: process.env.APP_ICON_NETWORK,
    scoreAddress: process.env.APP_SCORE_ADDRESS,
    logoHash: process.env.APP_LOGO_HASH,
    unrevealedHash: process.env.APP_UNREVEALED_HASH,
  },
  app: {
    head: {
      title: `${process.env.APP_COLLECTION}| Presale`,
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
  css: [
    '~/assets/styles/tailwind.css',
    '~/assets/styles/fonts.css',
    '~/assets/styles/global.css',
    '~/assets/styles/overrides.css',
    '~/assets/styles/transitions.css',
    '~/assets/styles/typography.css',
    '~/assets/styles/utils.css',
  ],
  plugins: [
    '~/plugins/pinia-persistedstate.client',
  ],
  buildModules: [
    '@pinia/nuxt',
  ],
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
  builder: isDev ? 'vite' : 'webpack',
  ...isDev
    ? {
      vite: {
        plugins: [
          commonjs(),
          inject({
            Buffer: ['buffer', 'Buffer'],
          }),
        ],
        optimizeDeps: {
          include: [
            'buffer',
          ],
        },
      },
    }
    : {
      webpack: {
        plugins: [
          new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
          }),
          new webpack.ProvidePlugin({
            process: 'process/browser',
          }),
        ],
      },
    },
})
