const wpdevconfig = require("./webpack.dev.config");

const  path = require("path");

module.exports={
    contentBase: path.resolve("./public"),
    publicPath: wpdevconfig.output.publicPath,
    historyApiFallback:true,
    https:false,
    hot:true,
    headers:{"Access-Control-Allow-Origin":"*"}
    // headers:{"Access-Control-Allow-Origin":"https://localhost:fremderPort"}
}