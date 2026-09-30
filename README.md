# React Microfrontend Architecture (Webpack Module Federation)

Three separate React apps stitched together at runtime:

| App      | URL                   | Role                                              |
| -------- | --------------------- | ------------------------------------------------- |
| Host     | http://localhost:3000 | Container: navbar (`/products`, `/cart`), loads remotes dynamically |
| Products | http://localhost:3001 | Remote: exposes `./ProductsList` (dummy products + Add to Cart)     |
| Cart     | http://localhost:3002 | Remote: exposes `./CartList` (cart items + Remove)                   |

Communication between apps: `localStorage` (shared cart data) + `window` CustomEvent `"cart-updated"` (change notification).
Shared singletons via Module Federation: `react`, `react-dom`, `react-router-dom`.

## Prerequisites

- Node.js 18+ and npm

## Quick start (one command)

```bash
npm run install:all   # first time only — installs deps for host, products, cart
npm start             # starts all three apps together
```

Then open:

- http://localhost:3000/products → add products to cart
- http://localhost:3000/cart → view / remove items
- http://localhost:3001 → Products app standalone
- http://localhost:3002 → Cart app standalone

> Start the remotes before (or together with) the host 

## Individual commands

```bash
npm run start:products   # port 3001
npm run start:cart       # port 3002
npm run start:host       # port 3000
npm run build:all        # production builds for all three apps
```

## Project structure

```
microfrontend-webpack/
├── package.json            # root: one-command start (concurrently)
├── README.md
├── host/                   # container app (remotes + router + navbar)
│   ├── webpack.config.js   # ModuleFederationPlugin with `remotes`
│   └── src/
│       ├── index.js        # async boundary -> imports bootstrap
│       ├── bootstrap.js    # renders <App/> inside BrowserRouter
│       ├── App.js          # navbar, Routes, React.lazy remotes
│       └── cartStoreHost.js# read-only cart reader (navbar badge)
├── products/               # remote app (exposes ./ProductsList)
│   ├── webpack.config.js   # ModuleFederationPlugin with `exposes`
│   └── src/
│       ├── ProductsList.js # exposed component
│       ├── cartStore.js    # shared cart logic (localStorage + window event)
│       └── App.js          # standalone mode for :3001
└── cart/                   # remote app (exposes ./CartList)
    ├── webpack.config.js   # ModuleFederationPlugin with `exposes`
    └── src/
        ├── CartList.js     # exposed component
        ├── cartStore.js    # shared cart logic (localStorage + window event)
        └── App.js          # standalone mode for :3002
```
