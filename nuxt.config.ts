import { defineNuxtConfig } from 'nuxt'
import webpack from 'webpack'
// import inject from '@rollup/plugin-inject'
// import commonjs from '@rollup/plugin-commonjs'
// import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'

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
  builder: 'webpack',
  webpack: {
    plugins: [
      // Work around for Buffer is undefined:
      // https://github.com/webpack/changelog-v5/issues/10
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
  },
  // vite: {
  //   plugins: [
  //     // commonjs(),
  //     inject({
  //       Buffer: ['buffer', 'Buffer'],
  //     }),
  //   ],
  //   optimizeDeps: {
  //     include: [
  //       'buffer',
  //     ],
  //     esbuildOptions: {
  //       plugins: [
  //         esbuildCommonjs(['@ledgerhq/hw-transport-webhid']),
  //       ],
  //     },
  //   },
  // },
})
