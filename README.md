# Craft Presale UI

This repository contains the starter template for Craft NFT presales. You can refer to this documentation if you're setting up your NFT presale: https://docs.craft.network/deploy-a-presale/launch-the-presale-website

## Setup

The first step is to set up the .env file like in the following example:

```
APP_COLOR="#4F46E5"
APP_COLLECTION="Chainspacers"
APP_SCORE_ADDRESS="cx7bf7d1bf899ca4208c87468aecfa1e7cc50f64dd"
APP_ICON_NETWORK="testnet"
APP_LOGO_HASH="QmT6tsH1Y9AiPePWmQeXgAgJYGCKgCehcVPgNbo1qTTaSZ"
APP_UNREVEALED_HASH="QmeLxViTdfUkuyEfuHFFujUxVRT7BJFrkoQspyyQ6THRvm"
```

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.
