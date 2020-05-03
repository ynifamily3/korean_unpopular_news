import path from "path";
import * as webpack from "webpack";
import nodeExternals from "webpack-node-externals";
import LoadablePlugin from "@loadable/webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const DIST_PATH = path.resolve(__dirname, "public/dist");
const production = process.env.NODE_ENV === "production";
const development =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

const getConfig = (
  target:
    | "web"
    | "webworker"
    | "node"
    | "async-node"
    | "node-webkit"
    | "atom"
    | "electron"
    | "electron-renderer"
    | "electron-preload"
    | "electron-main"
): webpack.Configuration => ({
  name: target,
  mode: development ? "development" : "production",
  target,
  entry: `./src/client/main-${target}.ts`,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            caller: { target },
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
    ],
  },
  externals:
    target === "node" ? ["@loadable/component", nodeExternals()] : undefined,
  output: {
    path: path.join(DIST_PATH, target),
    filename: production ? "[name]-bundle-[chunkhash:8].js" : "[name].js",
    publicPath: `/dist/${target}/`,
    libraryTarget: target === "node" ? "commonjs2" : undefined,
  },
  plugins: [new LoadablePlugin(), new MiniCssExtractPlugin()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
});

export default [getConfig("web"), getConfig("node")];
