import { defineNuxtConfig } from 'nuxt'
import inject from '@rollup/plugin-inject'

export default defineNuxtConfig({
  publicRuntimeConfig: {
    collection: process.env.APP_COLLECTION,
    iconNetwork: process.env.APP_ICON_NETWORK,
    scoreAddress: process.env.APP_SCORE_ADDRESS,
    status: process.env.APP_STATUS,
  },
  app: {
    head: {
      title: process.env.APP_NAME,
      titleTemplate: `%s - ${process.env.APP_NAME}`,
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
  vite: {
    plugins: [
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
})
