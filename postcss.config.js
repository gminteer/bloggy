const purgeCss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    require('autoprefixer'),
    // purgeCss({
    //   content: ['./views/**/*.handlebars'],
    // }),
  ],
};
