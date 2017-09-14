//Konfiguration für development

const webpack = require("webpack");
const path = require("path");
const webpackNotifierPlugin = require("webpack-notifier");
const ScreepsWebpackPlugin = require("screeps-webpack-plugin");

const screepsOptions = require("./screepOptions.secret.js");

module.exports = {
    devtool: "source-map",
    entry: require("./webpack.dev.entry"),
    output: {
        filename: "[name]",
        path: path.resolve(__dirname, "../dist"),
        // sourceMapFilename: "[file].map.js", // normally this is [file].map, 
        // but we need a js file, or it will be rejected by screeps server.
        devtoolModuleFilenameTemplate: "[resource-path]",
        pathinfo: false,
        libraryTarget: "commonjs2",
    },
    target: "node",
    resolve: require("./webpack.resolve"),
    module: require("./webpack.rules"),
    externals: require("./webpack.externals"),
    stats:{errorDetails: true},
    // devServer:require("./webpack.dev.devserver"),
    plugins: [
        new webpackNotifierPlugin({ alwaysNotify: false }),
        new ScreepsWebpackPlugin(screepsOptions),
    ]
}

