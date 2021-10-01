module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/destructuring-assignment': 0,
    'no-plusplus': 0,
    'no-console': 0,
    'max-len': 0,
    'linebreak-style': 0,
    'no-underscore-dangle': 0,
    'react/button-has-type': 0,
    'jsx-a11y/label-has-associated-control': 0,
  },
};
