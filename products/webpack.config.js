const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devtool: "eval-source-map",

  devServer: {
    port: 3001,
    historyApiFallback: true,
    // The HOST (localhost:3000) downloads this app's remoteEntry.js and the
    // exposed chunk cross-origin. Without CORS headers the browser blocks it.
    headers: { "Access-Control-Allow-Origin": "*" },
  },

  output: {
    // Must be absolute so the host can pull this app's chunks at runtime.
    publicPath: "http://localhost:3001/",
    // The file the host downloads to learn what this app exposes.
    filename: "[name].js",
    clean: true,
  },

  resolve: { extensions: [".js", ".jsx"] },

  // See host/webpack.config.js for why this is required.
  // Leaving default splitChunks on makes the runtime request a share-scope
  // consume chunk that webpack never emits (404) and the remote never boots.
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
      // Unique container name; the host refers to this app as "products".
      name: "products",
      // The manifest file. The host loads this FIRST, before anything else.
      filename: "remoteEntry.js",

      // THIS is the public API of the app.
      //   "./ProductsList"  =  the name the host imports:  import("products/ProductsList")
      //   "./src/ProductsList"  =  the file that lives inside this repo
      exposes: {
        "./ProductsList": "./src/ProductsList",
      },

      // This app does not use react-router, but declaring it keeps versions
      // aligned across the three apps so the singleton negotiation never fails.
      shared: {
        react: { singleton: true, requiredVersion: "^18.3.1" },
        "react-dom": { singleton: true, requiredVersion: "^18.3.1" },
        "react-router-dom": { singleton: true, requiredVersion: "^6.30.0" },
      },
    }),

    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};
