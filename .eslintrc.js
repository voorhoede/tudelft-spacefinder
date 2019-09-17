module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  plugins: ['sonarjs'],
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'plugin:sonarjs/recommended',
  ],
  rules: {
    'no-console': ['warn', { allow: ['error', 'info'] }],
    'comma-dangle': ['warn', 'always-multiline'],
  },
};
