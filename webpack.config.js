const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinizerWebpackPlugin = require("css-minimizer-webpack-plugin");

module.exports = env => {
    // Determine build mode
    let mode = "development";
    try {if (env.production) {mode = "production";}} catch {}
    // Entries
    let entries = {};
    fs.readdirSync(path.resolve(__dirname, "src/ts/")).forEach(file => {
        let fpath = path.resolve(__dirname, "src/ts/", file);
        if (fs.lstatSync(fpath).isFile()) {
            let spl = file.split(".");
            let ext = spl.pop();
            let id = spl.join(".");
            if (ext.toLowerCase() == "ts") {
                entries[id] = path.resolve(__dirname, "src/ts/", file);
            }
        }
    });
    // Optimizations
    let optimization = undefined;
    if (mode == "production") {
        optimization = {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        ecma: 6,
                        compress: true,
                        output: {
                            comments: false,
                            beautify: false
                        }
                    },
                    extractComments: false
                }),
                new CssMinizerWebpackPlugin()
            ],
            runtimeChunk: "single",
            splitChunks: {
                cacheGroups: {
                    async: {
                        name: "async",
                        chunks: "async",
                        minChunks: 1,
                        minSize: 10
                    },
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        chunks: "all",
                        minChunks: 1,
                        minSize: 10
                    }
                }
            }
        }
    }
    // Plugins
    let plugins = [
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash:5].css",
            chunkFilename: "css/[name].[contenthash:5].css"
        })
    ];
    fs.readdirSync(path.resolve(__dirname, "src/pug/")).forEach(file => {
        let fpath = path.resolve(__dirname, "src/pug/", file);
        if (fs.lstatSync(fpath).isFile()) {
            let spl = file.split(".");
            let ext = spl.pop();
            let n = spl.join(".");
            if (ext.toLowerCase() == "pug") {
                plugins.push(new HtmlWebpackPlugin({
                    template: path.resolve(__dirname, "src/pug/", file),
                    filename: n + ".html",
                    chunks: ["app", n],
                    inject: true,
                    minify: mode == "production" ? true : false
                }));
            }
        }
    });
    return {
        mode: mode,
        entry: entries,
        output: {
            path: path.resolve(__dirname, "dist/"),
            filename: "js/[name].[contenthash:5].js"
        },
        optimization: optimization,
        plugins: plugins,
        module: {
            rules: [
                {
                    test: /\.(js|ts)$/,
                    use: [
                        'babel-loader'
                    ]
                },
                {
                    test: /\.pug$/,
                    use: [
                        'html-loader',
                        'pug-html-loader'
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: "../"
                            }
                        },
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: "../"
                            }
                        },
                        'css-loader',
                        'postcss-loader'
                    ]
                },
                {
                    test: /\.(woff|woff2|ttf|eot|svg)$/,
                    include: /(font-awesome)/,
                    use: [
                        'file-loader?name=fonts/[name].[contenthash:5].[ext]'
                    ]
                },
                {
                    test: /\.(mp3|wav|ogg)$/,
                    use: [
                        'file-loader?name=music/[name].[ext]'
                    ]
                },
                {
                    test: /\.(txt)$/,
                    use: [
                        'file-loader?name=texts/[name].[ext]'
                    ]
                }
            ]
        },
    }
}