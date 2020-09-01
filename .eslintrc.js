const devDependencies = Object.keys(require('./package.json').devDependencies) || {};
const baseEnv = {es2017: true};
const basePlugins = ['prettier', 'promise', 'import'];
const baseExtends = [
  'eslint:recommended',
  'plugin:promise/recommended',
  'plugin:import/errors',
  'plugin:import/warnings',
  'google',
  'prettier',
];
module.exports = {
  env: {node: true, ...baseEnv},
  plugins: ['node', 'security', ...basePlugins],
  extends: ['plugin:node/recommended', 'plugin:security/recommended', ...baseExtends],
  rules: {
    'prettier/prettier': ['warn'],
    'no-template-curly-in-string': ['error'],
    'prefer-template': ['warn'],
    'require-jsdoc': ['off'],
    'new-cap': ['warn', {capIsNewExceptions: ['Router']}],
    'no-debugger': ['warn'],
    'vars-on-top': ['warn'],
    'brace-style': ['error', '1tbs', {allowSingleLine: true}],
    eqeqeq: ['error', 'always'],
    curly: ['error', 'multi-or-nest', 'consistent'],
  },
  overrides: [
    {
      files: ['__tests__/**/*', '__mocks__/**/*', 'test/**/*', 'util/**/*'],
      env: {node: true, 'jest/globals': true, ...baseEnv},
      plugins: ['node', 'jest', ...basePlugins],
      extends: ['plugin:node/recommended', 'plugin:jest/recommended', 'plugin:jest/style', ...baseExtends],
      rules: {
        'node/no-unpublished-require': ['error', {allowModules: devDependencies}],
      },
    },
    {
      files: ['public/**/*.js', 'static/**/*.js'],
      plugins: ['compat', ...basePlugins],
      env: {browser: true, ...baseEnv},
      extends: ['plugin:compat/recommended', ...basePlugins],
      rules: {
        'no-var': ['off'],
        'vars-on-top': ['off'],
        'prettier/prettier': ['off'],
      },
    },
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
};
