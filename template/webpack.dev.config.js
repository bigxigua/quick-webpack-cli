const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const ProvidePlugin = webpack.ProvidePlugin;

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: {
		bundle: __dirname + '/app/index.js'
	},
	output: {
		path: path.join(__dirname, '/dist'),
		filename: '[name].[chunkhash:8].js',
		// publicPath: '/' //publicPath指定所引用资源的目录，如在html中的引用方式
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
		modules: ['node_modules'],
		alias: {}
	},
	module: {
		loaders: [{
			test: /\.js[x]?$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		},{
			test: /\.(png|jpg)$/,
			exclude: /node_modules/,
			loader: 'url-loader?limit=8192'
		},{
			test: /\.less$/,
      exclude: /^node_modules$/,
      loaders: ['style-loader', 'css-loader', 'less-loader']
		},{
			test: /\.scss$/,
			exclude: /node_modules/,
			loaders: ['style-loader', 'css-loader', 'sass-loader', 'autoprefixer-loader']
		},{
			test: /\.css$/,
			exclude: /node_modules/,
			loaders: ['style-loader', 'css-loader', 'autoprefixer-loader']
		},{
			test: /\.(woff|eot|ttf|svg|gif)/,
			exclude: /node_modules/,
			loader: 'file-loader?name=font/[path][name].[ext]'
		}]
	},
	plugins: [
		//根据模板自动生成html
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.resolve(__dirname, './app/index.html'),
			inject: true, //是否自动在模板文件添加生成的js文件链接
			title: 'fuck you',
			minify: {
				removeComments: true //是否在压缩时去除注释
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		})
	],
	devServer: {
    publicPath: '/',
    contentBase: path.join(__dirname, 'dist'),
    inline: true,
    historyApiFallback: true, //这在设置前端路由时必须为true
    hot: false,
    host: '0.0.0.0',
    port: 3002,
    compress: true //是否启用gzip压缩
  }
}