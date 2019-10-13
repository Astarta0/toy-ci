const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');
const postcssNested = require('postcss-nested');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    devtool: 'source-map',
    entry: './src/client/client.js',
    output: {
        path: path.join(__dirname, '/static/dist'),
        filename: 'client-bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: { loader: 'babel-loader' },
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: true,
                            localIdentName: '[name]__[local]--[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                postcssPresetEnv({
                                    stage: 0,
                                    browsers: 'last 2 years',
                                    autoprefixer: true
                                }),
                                postcssNested()
                            ]
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        })
    ],
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'server/src')
        }
    }
};
