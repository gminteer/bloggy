module.exports = {
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          {loader: 'file-loader', options: {name: 'css/style.css'}},
          'extract-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
};
