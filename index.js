const webpack = require("webpack");
const path = require("path");

console.log("Starting...");

const wpdevconfig = require("./config/webpack.dev.config");

const compiler = webpack(wpdevconfig);

compiler.watch({
    aggregateTimeout: 500,
    poll: 1000,
    ignored: "/node_modules/"
}, (err, stats) => {
    // Print watch/build result here...
    // console.log(stats);
    if (err) {
        console.log("Error!")
        console.log(err);
    }

});
