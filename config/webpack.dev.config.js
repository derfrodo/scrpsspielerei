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
        filename: "main",
        path: path.resolve(__dirname, "../dist"),
        sourceMapFilename: "[file].map.js", // normally this is [file].map, 
        // but we need a js file, or it will be rejected by screeps server.
        //devtoolModuleFilenameTemplate: "[resource-path]",
        //pathinfo: true,
        libraryTarget: "commonjs2",
    },
    target: "node",
    node: {
        Buffer: false,
        __dirname: false,
        __filename: false,
        console: true,
        global: true,
        process: false,
    },
    resolve: require("./webpack.resolve"),
    module: require("./webpack.rules"),
    externals: require("./webpack.externals"),
    // devServer:require("./webpack.dev.devserver"),
    plugins: [
        new webpackNotifierPlugin({ alwaysNotify: true }),
        new ScreepsWebpackPlugin(screepsOptions),
    ]
}

