const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

module.exports = {
	devtool: 'cheap-module-source-map',
	entry: {
		bundle: __dirname + '/app/index.js',
		// common: [''] //提取公共库
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
			test: /\.scss$/,
			exclude: /node_modules/,
			loader: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader', 'sass-loader']
			})
		},{
			test: /\.less$/,
      exclude: /^node_modules$/,
      loader: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader', 'less-loader']
			})
		},{
			test: /\.(png|jpg)$/,
			exclude: /node_modules/,
			loader: 'url-loader?limit=8192'
		},{
			test: /\.css$/,
			exclude: /node_modules/,
			loader: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader']
			})
		},{
			test: /\.(woff|eot|ttf|svg|gif)/,
			exclude: /node_modules/,
			loader: 'file-loader?name=font/[path][name].[ext]'
		}]
	},
	plugins: [
		//UglifyJsPlugin 推荐只在生产环境使用
		//服务器端还可以开启 gzip 压缩
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
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
		//分类css
		new ExtractTextPlugin('[name].[chunkhash:8].css'),
		//清除旧文件
		new CleanWebpackPlugin(['dist/[name].*.js', 'dist/[name].*.js.map'], {
			root: __dirname,
			verbose: true, //开启在控制台输出信息
			dry: false //启用删除文件
		}),
		//dll
		new webpack.DllReferencePlugin({
			context: __dirname,
			manifest: require('./manifest.json')
		}),
		//引入dll
		new HtmlWebpackIncludeAssetsPlugin({
			assets: [],
			append: true
		})
	]
}