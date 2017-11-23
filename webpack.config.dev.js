/**
 * @author xuweichen@meitu.io
 * @date 2017/8/22
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: [
        'babel-polyfill',
        './src/index.client.js'
    ],

    target: 'web',
    output: {
        filename: '[name].[hash:4].js',
        chunkFilename: '[name].[chunkhash:4].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            //JS和JSX加载
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                },
                exclude: path.resolve(__dirname, 'node_modules', 'animated')
            },
            {
                test: /\/pages\/.*\.jsx?/, //pages下的都用bundle-loader加载
                use: ['bundle-loader?lazy','babel-loader']
            },
            //css加载
            // {
            //     test: /\.css$/,
            //     use: [ 'style-loader', 'css-loader' ],
            //     include: path.resolve('./src')
            // },
            //图片文件加载
            {
                test: /\.png|jpe?g|gif|svg(\?.*)?/,
                use: {
                    loader:  "url-loader",//引用图片的格式,通过query来指定
                    query: {
                        name: 'img/[name].[hash:4].[ext]',
                        limit: 1000 //小于这个则会通过dataURI引用
                    }
                },
                include: path.resolve('./src')
            },
            //音频视频文件加载
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: 'media/[name].[hash:4].[ext]'
                    }
                }
            },
            //字体加载
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: 'fonts/[name].[hash:4].[ext]'
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'}),

        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development")
            }
        }),
    ],

    devServer: {
        hot: true, //打开 HMR
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        host: '10.194.11.62',
        port: 9000,
        // host: "192.168.0.18"
    }
};