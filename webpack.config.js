const path = require('path');

module.exports = {
  entry: './static/js/breathwork-app.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'static/react'),
    publicPath: '/static/react/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  mode: 'development',
  devtool: 'source-map'
};