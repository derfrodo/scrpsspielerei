const webpack = require("webpack");
const path = require("path");

console.log("Starting...");

const wpdevconfig = require("./config/webpack.dev.config");

const compiler = webpack(wpdevconfig);

compiler.run((err, stats) => {
    // Print watch/build result here...
    // console.log(stats);
    if (err) {
        console.log("Error!")
        console.log(err);
    }
    else{
        console.log("Deployed!")
        console.log(stats);
    }

});
