const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'production',
    cache: true,
    context: __dirname + "/src",
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/dist/",
        filename: "form-with-pagination.js",
        library: "JSONSchemaForm",
        libraryTarget: "umd"
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ],
    devtool: "source-map",
    externals: {
        react: {
            root: "React",
            commonjs: "react",
            commonjs2: "react",
            amd: "react"
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["babel-loader"],
            }
        ]
    }
};
