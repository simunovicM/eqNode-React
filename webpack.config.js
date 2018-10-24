var path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve('lib'),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            // {
            //     test: /\.(png|svg|jpg|gif)$/,
            //     use: [
            //         {
            //             loader: 'file-loader',
            //             options:{
            //                 fallback: "file-loader",
            //                 name: "[name][md5:hash].[ext]",
            //                 outputPath: 'assets/',
            //                 publicPath: '/assets/'
            //             }
            //         }    
            //     ]
            // },
        ]
    }
}