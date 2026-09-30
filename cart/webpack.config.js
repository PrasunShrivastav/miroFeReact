const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devtool: "eval-source-map",

  devServer: {
    port: 3002,
    historyApiFallback: true,
    headers: { "Access-Control-Allow-Origin": "*" },
  },

  output: {
    publicPath: "http://localhost:3002/",
    filename: "[name].js",
    clean: true,
  },

  resolve: { extensions: [".js", ".jsx"] },

  // See host/webpack.config.js for why this is required.
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
      name: "cart",
      filename: "remoteEntry.js",

      // Public API: the host imports it as  import("cart/CartList")
      exposes: {
        "./CartList": "./src/CartList",
      },

      shared: {
        react: { singleton: true, requiredVersion: "^18.3.1" },
        "react-dom": { singleton: true, requiredVersion: "^18.3.1" },
        "react-router-dom": { singleton: true, requiredVersion: "^6.30.0" },
      },
    }),

    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};
