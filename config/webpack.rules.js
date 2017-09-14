const autoprefixer = require("autoprefixer");

const babelOptions = {
    "presets": ["es2015"]
}

module.exports = {
    rules: [
        {
            test: /\.tsx?$/,
            use: [
                {
                    loader: "babel-loader",
                    options: babelOptions,
                },
                {
                    loader: "ts-loader",
                    options: {
                        configFile: "../tsconfig.json"
                    }
                },
                {
                    loader: "tslint-loader",
                    options: {
                        failOnHint: false,
                        tsConfigFile: "../tslint.json",
                    }
                }
            ],
        },
        {
            test: /\.jsx?$/,
            use: [
                {
                    loader: "babel-loader",
                    options: babelOptions,
                },
            ],
        },
        {
            test: /\.less$/,
            use: [
                { loader: "style-loader", options: { sourceMap: true } },
                { loader: "css-loader", options: { sourceMap: true, importLoaders: 1 } },
                { loader: "postcss-loader", options: { plugins: (loader) => [autoprefixer({ browsers: ["last 2 versions"] })] } },
                { loader: "less-loader" }
            ]
        },
        {
            test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, use:
            [
                {
                    loader: 'url-loader',
                    options: { limit: 8192, mimetype: "application/font-woff" }
                }
            ]
        },
        {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use:
            [
                {
                    loader: 'url-loader',
                    options: { limit: 8192, mimetype: "application/octet-stream" }
                }
            ]
        },
        {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use:
            [
                {
                    loader: 'url-loader',
                    options: { limit: 8192 }
                }
            ]
        },
        {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use:
            [
                {
                    loader: 'url-loader',
                    options: { limit: 8192, mimetype: "image/svg+xml" }
                }
            ]
        },
        {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: { limit: 8192 }
                }
            ]
        }

    ]
}