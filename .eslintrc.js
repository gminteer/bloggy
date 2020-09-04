const devDependencies = Object.keys(require('./package.json').devDependencies) || {};
const baseEnv = {es2017: true};
const basePlugins = ['prettier'];
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
    camelcase: ['off'],
    curly: ['error', 'multi-or-nest', 'consistent'],
    eqeqeq: ['error', 'always'],
    'new-cap': ['warn', {capIsNewExceptions: ['Router']}],
    'no-debugger': ['warn'],
    'no-template-curly-in-string': ['error'],
    'no-unused-vars': ['error', {varsIgnorePattern: '_'}],
    'prefer-template': ['warn'],
    'prettier/prettier': ['warn'],
    'require-jsdoc': ['off'],
    'vars-on-top': ['warn'],
  },
  overrides: [
    {
      files: ['__tests__/**/*', '__mocks__/**/*', 'test/**/*', 'util/**/*'],
      env: {node: true, 'jest/globals': true, ...baseEnv},
      plugins: ['node', 'jest', ...basePlugins],
      extends: [
        'plugin:node/recommended',
        'plugin:jest/recommended',
        'plugin:jest/style',
        ...baseExtends,
      ],
      rules: {
        'node/no-unpublished-require': ['error', {allowModules: devDependencies}],
      },
    },
    {
      files: ['public/**/*.js', 'static/**/*.js'],
      plugins: ['compat', ...basePlugins],
      env: {browser: true, ...baseEnv},
      extends: ['plugin:compat/recommended', ...basePlugins],
    },
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
};
