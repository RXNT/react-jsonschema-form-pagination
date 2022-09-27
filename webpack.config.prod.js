var path = require("path");
var webpack = require("webpack");
// var ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    mode: 'production',
    entry: path.join(__dirname, "playground/app"),
    output: {
        path: path.join(__dirname, "build"),
        filename: "bundle.js",
        publicPath: "/static/"
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new MiniCssExtractPlugin()

    ],
    resolve: {
      modules: [
        "node_modules",
        path.resolve(__dirname, "app")
      ],
      extensions: [".js", ".jsx", ".css"],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: "babel-loader",
                include: [
                    path.join(__dirname, "src"),
                    path.join(__dirname, "playground"),
                    path.join(__dirname, "node_modules", "codemirror", "mode", "javascript"),
                ],
            },
            {
                test: /\.css$/i,
                // loader: ExtractTextPlugin.extract("css-loader"),
                use: [MiniCssExtractPlugin.loader, "css-loader"],
                include: [
                    path.join(__dirname, "playground"),
                    path.join(__dirname, "node_modules"),
                ],
            }
        ]
    }
};
