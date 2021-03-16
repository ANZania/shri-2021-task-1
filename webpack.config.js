const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack')

module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/index.js'),
    },

    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'stories.js',
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Task 1',
            template: path.resolve(__dirname, './src/templates/template.html'),
            filename: 'index.html',
        }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],

    mode: 'development',

    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, './build/index.html'),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },

            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },

            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },

            {
                test: /\.(sass|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    }
}