module.exports = {
  env: {
    browser: true,
    es2021: true,
    mocha: true,
  },
  parser: 'babel-eslint',
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },

  rules: {
    'max-len': ['error', { code: 120, ignoreComments: true }],
    'import/no-unresolved': 0, // Turn off "Unable to resolve path to module ..." error
    'import/extensions': 0,
    'implicit-arrow-linebreak': 0,
    'function-paren-newline': 0,
    'object-curly-newline': 0,
    'class-methods-use-this': 0,
  },
};
