var debug = process.env.NODE_ENV !== "production";
var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: debug ? "inline-sourcemap" : false,
    entry: "./source/ThermalVisualizer.js",
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: [
                    path.resolve(__dirname, "node_modules"),
                    path.resolve(__dirname, "bower_components")
                ],
                loader: 'babel-loader',
                options: {
                    presets: ['react', 'env', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
                }
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'visualizer/js/'),
        publicPath: "js/",
        filename: "thermal-visualizer.min.js"
    },
    plugins: debug ? [] : [
        new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin()
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'visualizer'),
        compress: true,
        port: 8081
    }
};