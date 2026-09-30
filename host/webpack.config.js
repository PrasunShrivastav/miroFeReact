const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devtool: "eval-source-map",

  devServer: {
    port: 3000,
    // Lets you deep-link straight to /products or /cart.
    // Without this, refreshing the page on a route 404s.
    historyApiFallback: true,
    // Remotes are on :3001 / :3002. Module Federation fetches their
    // remoteEntry.js cross-origin, so CORS headers are mandatory.
    headers: { "Access-Control-Allow-Origin": "*" },
  },

  output: {
    // MUST be an absolute URL, not "auto"/"/".
    // Webpack uses publicPath to build the URL of every chunk it loads at
    // runtime. With "auto" it would try to fetch remote chunks from the
    // host's own server, which does not have them.
    publicPath: "http://localhost:3000/",
    clean: true,
  },

  resolve: { extensions: [".js", ".jsx"] },

  // IMPORTANT (this is the subtle part):
  // If you leave the default dev splitChunks on, webpack hoists react into
  // `vendors-*` chunks. That makes the Module Federation runtime reference a
  // share-scope consume chunk (`webpack_sharing_consume_default_react_react`)
  // that it then never actually emits -> 404 -> the app silently never boots.
  // Turning splitChunks off keeps the consume code inlined in the entry while
  // STILL registering react as a singleton in the share scope.
  optimization: { splitChunks: false },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env", "@babel/preset-react"] },
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "host",

      // The host is a pure CONSUMER: it points at the other apps' remoteEntry.js.
      // "products" is the remote name; it is also the prefix you import with.
      //   import("products/ProductsList")
      //   <url>                <exposed module>
      remotes: {
        products: "products@http://localhost:3001/remoteEntry.js",
        cart: "cart@http://localhost:3002/remoteEntry.js",
      },

      // `singleton: true` = exactly ONE copy of React in the whole page.
      // Without it, the host and each remote each ship their own React and
      // "Invalid hook call" fires the moment a remote component uses useState.
      shared: {
        react: { singleton: true, requiredVersion: "^18.3.1" },
        "react-dom": { singleton: true, requiredVersion: "^18.3.1" },
        "react-router-dom": { singleton: true, requiredVersion: "^6.30.0" },
      },
    }),

    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};
