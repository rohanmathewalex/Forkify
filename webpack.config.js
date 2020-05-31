const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: ['babel-polyfill','./src/js/index.js'],
    output: {
        path:path.resolve(__dirname,'dist'),
        filename:'js/bundle.js'
    },
    devServer: {
        //content base monitor in dist folder if there any file changes.
        contentBase: './dist'
    },
    plugins:[
        new HtmlWebPackPlugin({
            filename:'index.html',
            template:'./src/index.html'
        })
    ],
    // module:{
    //     rules:[
    //         {
    //             test:/\.js$/,
    //             exclude: /node_modules/,
    //             use: {
    //                 loader: 'babel-loader'
    //             }
    //         }
    //     ]
    // }

    module: {
        rules: [
          {
            test: /\js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-proposal-object-rest-spread']
              }
            }
          }
        ]
      }

     
    
};